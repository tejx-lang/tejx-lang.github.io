// @ts-expect-error Upstream browser runtime is copied in as a plain .mjs module.
import { TejxCompiler as BrowserTejxCompiler } from "./browserRuntime.mjs";

export interface CompilerResult {
  output: string[];
  success: boolean;
  binary?: Uint8Array;
}

interface CompileReport {
  ok?: boolean;
  full_error?: string;
  message?: string;
  stage?: string;
}

interface ProgramHost {
  unsupportedCalls: Set<string>;
  runMain(): unknown;
}

interface BrowserCompiler {
  compileToWatReport(
    source: string,
    filename?: string,
    config?: Record<string, unknown>,
  ): CompileReport;
  compileAndInstantiate(
    source: string,
    options?: {
      filename?: string;
      config?: Record<string, unknown>;
      onOutput?: (line: string) => void;
    },
  ): Promise<ProgramHost>;
}

interface BrowserCompilerConstructor {
  fromUrl(
    url: string | URL,
    options?: { onLog?: (line: string) => void },
  ): Promise<BrowserCompiler>;
}

const BrowserCompilerApi =
  BrowserTejxCompiler as BrowserCompilerConstructor;

export class TejXCompiler {
  private compiler: BrowserCompiler | null = null;
  private initPromise: Promise<void> | null = null;

  async init() {
    if (this.compiler) {
      return;
    }

    if (!this.initPromise) {
      this.initPromise = BrowserCompilerApi.fromUrl("/tejxc_wasm.wasm", {
        onLog: (line: string) => {
          console.log("[Compiler Log]:", line);
        },
      })
        .then((compiler: BrowserCompiler) => {
          this.compiler = compiler;
        })
        .finally(() => {
          this.initPromise = null;
        });
    }

    await this.initPromise;
  }

  async compile(code: string): Promise<CompilerResult> {
    if (!this.compiler) {
      await this.init();
    }

    if (!this.compiler) {
      return { output: ["Not initialized"], success: false };
    }

    const filename = "playground.tx";
    const report = this.compiler.compileToWatReport(
      code,
      filename,
      {},
    ) as CompileReport;

    if (!report.ok) {
      const message =
        report.full_error ||
        report.message ||
        (report.stage ? `Compile failed at ${report.stage}` : "") ||
        "Compilation failed";
      return { output: [message], success: false };
    }

    const output: string[] = [];

    try {
      const host = (await this.compiler.compileAndInstantiate(code, {
        filename,
        onOutput: (line: string) => {
          output.push(line);
        },
      })) as ProgramHost;

      host.runMain();

      if (host.unsupportedCalls.size) {
        output.push(
          `Unsupported runtime imports hit: ${[...host.unsupportedCalls].join(", ")}`,
        );
      }

      return { output, success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { output: [message], success: false };
    }
  }
}

export const compiler = new TejXCompiler();
