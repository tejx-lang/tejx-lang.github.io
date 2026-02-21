/**
 * This is a boilerplate for integrating a WASM-based compiler.
 * To use this, you should first compile your Rust/C++ compiler to WASM
 * and place the generated files in this directory.
 */

import { runtimePatches, createRuntime } from "./runtime";

export interface CompilerResult {
  output: string[];
  success: boolean;
  binary?: Uint8Array; // Added binary to result for execution
}

export class TejXCompiler {
  private wasmInstance: WebAssembly.Instance | null = null;
  private memory: WebAssembly.Memory | null = null;
  private compilerLogs: string[] = [];
  private stdlibMetadata: Record<string, Record<string, number>> | null = null;

  async init() {
    try {
      const response = await fetch("/tejxc_wasm.wasm");
      const buffer = await response.arrayBuffer();

      this.compilerLogs = [];

      const compilerImports = {
        env: {
          compiler_log: (ptr: number | bigint, len: number | bigint) => {
            if (!this.memory) return;
            const p = Number(ptr);
            const l = Number(len);
            const mem = new Uint8Array(this.memory.buffer);
            const str = new TextDecoder().decode(mem.subarray(p, p + l));
            console.log("[Compiler Log]:", str);
            this.compilerLogs.push(str);
          },
          longjmp: () => {
            throw new Error("longjmp");
          },
          setjmp: () => 0,
          __cxa_throw: () => {
            throw new Error("exception");
          },
          __cxa_allocate_exception: () => 0,
          __cxa_free_exception: () => {},
          proc_exit: (code: number) => {
            console.log(`Compiler exited with ${code}`);
          },
        },
        wasi_snapshot_preview1: {
          fd_write: (
            _fd_val: number,
            _iovs_val: number,
            _iovs_len_val: number,
            _nwritten_ptr: number,
          ) => 0,
          fd_close: () => 0,
          fd_seek: () => 0,
          fd_read: () => 0,
          environ_sizes_get: () => 0,
          environ_get: () => 0,
          clock_time_get: () => 0,
        },
      };

      const { instance } = await WebAssembly.instantiate(
        buffer,
        compilerImports,
      );

      this.wasmInstance = instance;
      // Use exported memory
      this.memory = instance.exports.memory as WebAssembly.Memory;

      // Fallback if memory isn't exported (e.g. older builds)
      if (!this.memory && (compilerImports.env as Record<string, any>).memory) {
        this.memory = (compilerImports.env as Record<string, any>).memory;
      }

      // NEW: Fetch stdlib metadata from the compiler
      const exports = instance.exports as any;
      if (
        exports.tejx_get_stdlib_metadata &&
        exports.tejx_get_stdlib_metadata_len
      ) {
        const ptr = Number(exports.tejx_get_stdlib_metadata());
        const len = Number(exports.tejx_get_stdlib_metadata_len());
        const mem = new Uint8Array(this.memory!.buffer);
        const json = new TextDecoder().decode(mem.subarray(ptr, ptr + len));
        try {
          this.stdlibMetadata = JSON.parse(json);
          console.log(
            "[TejXCompiler] StdLib Metadata loaded:",
            this.stdlibMetadata,
          );
        } catch (e) {
          console.error("[TejXCompiler] Failed to parse stdlib metadata:", e);
        }
      }

      console.log("TejX Compiler initialized.");
    } catch (err: unknown) {
      console.error("WASM load failed:", err);
    }
  }

  async compile(code: string): Promise<CompilerResult> {
    if (!this.wasmInstance || !this.memory)
      return { output: ["Not initialized"], success: false };

    this.compilerLogs = [];

    const exports = this.wasmInstance.exports as Record<string, any>;

    // Helper: Write string to compiler memory
    const writeString = (str: string) => {
      const bytes = new TextEncoder().encode(str);
      const ptr = exports.tejx_alloc(bytes.length);
      const p = Number(ptr);
      new Uint8Array(this.memory!.buffer, p, bytes.length).set(bytes);
      return { ptr, len: bytes.length };
    };

    let capturedOutputBuffer = "";

    try {
      const source = writeString(code);
      const filename = writeString("playground.tx");

      // 1. Compile directly to WASM
      // fn tejx_compile(src_ptr, src_len, file_ptr, file_len, async_enabled) -> *const u8
      const resultPtr = exports.tejx_compile(
        Number(source.ptr),
        Number(source.len),
        Number(filename.ptr),
        Number(filename.len),
        true, // async_enabled
      );

      // Read result from LAST_RESULT via tejx_get_result_len (if exported)
      // or assume resultPtr points to valid memory if we implemented that way.
      // In our Rust implementation:
      // resultPtr is pointer to LAST_RESULT content.
      // We also need length.

      const resultLen = Number(
        exports.tejx_get_result_len ? exports.tejx_get_result_len() : 0,
      );
      const p = Number(resultPtr);

      const resultBytes = new Uint8Array(this.memory!.buffer).slice(
        p,
        p + resultLen,
      );

      // Check for error string
      let resultStr = new TextDecoder().decode(resultBytes).trim();

      // 1.5 Handle JSON Error Messages from Compiler
      const jsonMatch = resultStr.match(/\{"error":true,.*\}/);
      if (jsonMatch) {
        try {
          const errObj = JSON.parse(jsonMatch[0]);
          if (errObj.error) {
            let msg = errObj.full_error || errObj.message;
            if (errObj.line) {
              msg = `[Line ${errObj.line}] ${msg}`;
            }
            return { output: [msg], success: false };
          }
        } catch (e) {
          console.warn("[TejXCompiler] Failed to parse error JSON:", e);
        }
      }

      const isError =
        resultStr.includes("WASM_COMPILE_ERROR") ||
        resultStr.includes("Compilation Error") ||
        resultStr.startsWith("Error:");

      if (isError) {
        const lineMatch =
          resultStr.match(/line\s+(\d+)/i) || resultStr.match(/:(\d+):/);
        let finalMsg = resultStr;
        if (lineMatch) {
          const lineNum = lineMatch[1];
          if (!resultStr.startsWith(`[Line ${lineNum}]`)) {
            finalMsg = `[Line ${lineNum}] ${resultStr.replace(/^WASM_COMPILE_ERROR:\s*/i, "").replace(/^Error:\s*/i, "")}`;
          }
        }
        return { output: [finalMsg], success: false };
      }

      let binary: Uint8Array = resultBytes;

      // DETECT OUTPUT FORMAT: WAT or BINARY?
      // Magic header for WASM binary is: \0asm (0x00 0x61 0x73 0x6d)
      if (
        resultBytes.length >= 4 &&
        resultBytes[0] === 0x00 &&
        resultBytes[1] === 0x61 &&
        resultBytes[2] === 0x73 &&
        resultBytes[3] === 0x6d
      ) {
        // It's binary, use directly
      } else if (resultStr.trim().startsWith("(module")) {
        // It's text (WAT), convert to binary using WABT

        // PATCH: Inject missing imports for Map operations if they are used but not imported
        // Use regex to insert AFTER the module header (and optional name)
        // Matches (module $optionalName ... or (module ...
        const moduleHeaderRegex = /(\(module(?:\s+\$[\w\d_$.]+)?)/;

        let missingImports = "";
        for (const imp of runtimePatches) {
          // Check if used (e.g. call $name) but not defined/imported (e.g. (func $name))
          if (
            resultStr.includes(`$${imp.name}`) &&
            !resultStr.includes(`(func $${imp.name}`)
          ) {
            missingImports += ` (import "env" "${imp.name}" ${imp.sig})`;
            console.log(
              `[TejXCompiler] Prepared missing import for ${imp.name}`,
            );
          }
        }

        if (missingImports) {
          // Use callback to avoid special replacement patterns with $
          resultStr = resultStr.replace(
            moduleHeaderRegex,
            (match) => match + missingImports,
          );
        }

        if (!(window as any).WabtModule) {
          return {
            output: [
              "Compiler output WAT but WabtModule not found on window. Please include libwabt.js or update compiler to output binary.",
            ],
            success: false,
          };
        }
        const wabt = await (window as any).WabtModule();
        const module = wabt.parseWat("playground.wat", resultStr);
        binary = new Uint8Array(module.toBinary({}).buffer);
        console.log("[TejXCompiler] Converted WAT to WASM Binary via WABT");
      } else {
        console.warn(
          "[TejXCompiler] Unknown output format, attempting to use as binary...",
          resultStr.substring(0, 50),
        );
      }

      const userMemory = new WebAssembly.Memory({ initial: 256 });

      const runtimeImports = createRuntime(
        userMemory,
        (str) => {
          capturedOutputBuffer += str;
        },
        this.stdlibMetadata || undefined,
      );

      // 4. Run
      const { instance: userInstance } = (await WebAssembly.instantiate(
        binary,
        runtimeImports,
      )) as unknown as WebAssembly.WebAssemblyInstantiatedSource;

      const userExports = userInstance.exports;
      if (userExports.main) {
        (userExports.main as () => void)();
      }

      const finalOutput = capturedOutputBuffer.split("\n");
      // Remove trailing empty line if the last char was a newline
      if (
        finalOutput.length > 0 &&
        finalOutput[finalOutput.length - 1] === "" &&
        capturedOutputBuffer.endsWith("\n")
      ) {
        finalOutput.pop();
      }

      return { output: finalOutput, success: true, binary };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      const combinedOutput = capturedOutputBuffer
        ? [...capturedOutputBuffer.split("\n"), "Error: " + msg]
        : ["Error: " + msg];
      return {
        output: combinedOutput.filter((line) => line !== ""),
        success: false,
      };
    }
  }
}

export const compiler = new TejXCompiler();
