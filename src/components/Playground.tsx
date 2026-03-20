import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { LoaderCircle, Play, RotateCcw, Terminal } from "lucide-react";
import { compiler } from "../lib/compiler";

const DEFAULT_CODE = `function main() {
    print("TejX Demo");
    print("----------------------------");

    let x = 10;
    let y = 5.5;
    let sum = x + y;
    print("Integer 10 + Float 5.5 =", sum);

    let arr = [1, 2, 3];
    arr.push(42);
    print("Array support:", arr);

    let obj = {
        name: "TejX",
        version: "1.0.0",
        is_awesome: true
    };
    print("Object support:", obj);

    if (sum > 10) {
        print("Comparison logic: sum is greater than 10");
    }

    print("Success!");
}

`;

interface PlaygroundProps {
  height?: string | number;
}

const Playground: React.FC<PlaygroundProps> = ({ height = "600px" }) => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<string | null>(null);

  const runSource = async (source: string) => {
    setIsRunning(true);
    setExecutionTime(null);
    const startTime = performance.now();

    try {
      const result = await compiler.compile(source);
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(3);

      if (result.success) {
        setExecutionTime(duration);
      }

      setOutput(result.output);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setOutput([message]);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    compiler.init();
  }, []);

  const runCode = async () => {
    await runSource(code);
  };

  const resetCode = () => {
    setCode(DEFAULT_CODE);
    setOutput([]);
    setExecutionTime(null);
  };

  return (
    <div
      className="playground-container glass-card"
      style={{
        padding: "1rem",
        minHeight: height,
        height: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="playground-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
          alignItems: "center",
          flexShrink: 0, // Prevent header from shrinking
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Terminal size={20} className="accent-text" />
          <span style={{ fontWeight: 600 }}>TejX Playground</span>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={resetCode}
            className="btn-secondary transition-all active:scale-95 hover:text-white"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={16} /> Reset
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="btn-primary transition-all active:scale-95 hover:brightness-110"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--accent-primary)",
              padding: "0.5rem 1.2rem",
              borderRadius: "12px",
              fontWeight: 600,
              opacity: isRunning ? 0.7 : 1,
              cursor: isRunning ? "default" : "pointer",
            }}
            aria-busy={isRunning}
          >
            {isRunning ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Play size={16} fill="white" />
            )}{" "}
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      <div className="editor-layout flex flex-col lg:flex-row gap-4 flex-1 min-h-[600px] lg:min-h-0">
        <div className="flex-[1.5] lg:flex-[1.5] relative rounded-xl overflow-hidden border border-white/10 min-h-[400px] lg:min-h-0">
          <div className="absolute inset-0">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              onMount={(_editor, monaco) => {
                // TejX syntax intentionally diverges from TypeScript in places
                // like `import { readFileSync } from "std:fs";`, so Monaco's
                // TS parser is too noisy here.
                monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                  {
                    noSemanticValidation: true,
                    noSyntaxValidation: true,
                  },
                );

                // Declare TejX runtime globals and std library modules
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                  `
                  declare function print(...args: any[]): void;
                  declare function len(x: any): number;

                  declare module 'std:math' {
                    export function min(a: number, b: number): number;
                    export function max(a: number, b: number): number;
                    export function abs(x: number): number;
                    export function pow(x: number, y: number): number;
                    export function sqrt(x: number): number;
                    export function floor(x: number): number;
                    export function ceil(x: number): number;
                    export function round(x: number): number;
                    export function sin(x: number): number;
                    export function cos(x: number): number;
                    export function random(): number;
                  }

                  declare module 'std:json' {
                    export function stringify(val: any): string;
                    export function parse(str: string): any;
                  }
                  `,
                  "filename/tejx-runtime.d.ts",
                );
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "var(--font-mono)",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                roundedSelection: true,
                padding: { top: 0, bottom: 0 },
                fixedOverflowWidgets: true,
              }}
            />
          </div>
        </div>
        <div className="console-output flex-1 lg:flex-1 self-stretch rounded-xl border border-white/10 bg-black p-4 font-mono text-[13px] overflow-auto whitespace-pre min-h-[400px] lg:min-h-0">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                color: "#64748b",
                textTransform: "uppercase",
                fontSize: "10px",
                letterSpacing: "1px",
              }}
            >
              Output
            </div>
            {executionTime && (
              <div
                style={{
                  color: "#10b981",
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                Time: {executionTime}s
              </div>
            )}
          </div>
          {output.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.startsWith("[Line") ? "#ef4444" : "#fff",
                marginBottom: "0.2rem",
              }}
            >
              <span style={{ color: "#444", marginRight: "0.5rem" }}>
                {">"}
              </span>
              {line}
            </div>
          ))}
          {output.length === 0 && (
            <div style={{ color: "#444" }}>
              Empty output. Press "Run" to execute.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;
