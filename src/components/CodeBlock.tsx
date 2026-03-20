import React, { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy, LoaderCircle, Play, Terminal } from "lucide-react";
import { compiler } from "../lib/compiler";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  runCommand?: string;
  playgroundCode?: string;
  runnable?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "tsx",
  filename,
  runCommand,
  playgroundCode,
  runnable = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runFailed, setRunFailed] = useState(false);
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const resolvedPlaygroundCode = playgroundCode ?? code;
  const usesPlaygroundVariant = resolvedPlaygroundCode !== code;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    if (isRunning) {
      return;
    }

    setHasRun(true);
    setIsRunning(true);
    setRunFailed(false);
    setExecutionTime(null);

    const startTime = performance.now();

    try {
      const result = await compiler.compile(resolvedPlaygroundCode);
      const endTime = performance.now();
      setExecutionTime(((endTime - startTime) / 1000).toFixed(3));
      setRunFailed(!result.success);
      setOutput(
        result.output.length > 0
          ? result.output
          : [result.success ? "Program finished with no output." : "Run failed."],
      );
    } catch (error: unknown) {
      const endTime = performance.now();
      const message = error instanceof Error ? error.message : String(error);
      setExecutionTime(((endTime - startTime) / 1000).toFixed(3));
      setRunFailed(true);
      setOutput([message]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] my-6 group">
      {(filename || runCommand || runnable) && (
        <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-xs font-mono text-gray-400 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {filename && <span>{filename}</span>}
          </div>
          <div className="flex items-center gap-2">
            {runCommand && (
              <div className="flex items-center gap-2 text-green-400">
                <Terminal size={12} />
                <span className="font-bold">{runCommand}</span>
              </div>
            )}
            {runnable && (
              <button
                type="button"
                onClick={handleRun}
                disabled={isRunning}
                title={
                  usesPlaygroundVariant
                    ? "Run a browser-safe demo for this example"
                    : "Run this example here"
                }
                className="inline-flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-purple-200 transition-colors hover:border-purple-400/40 hover:bg-purple-500/15 hover:text-white disabled:cursor-default disabled:opacity-70"
                aria-busy={isRunning}
              >
                {isRunning ? (
                  <LoaderCircle size={12} className="animate-spin" />
                ) : (
                  <Play size={12} />
                )}
                <span>{usesPlaygroundVariant ? "Run Demo" : "Run"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute right-4 top-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>

        <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} p-4 font-mono text-sm overflow-x-auto`}
              style={{ ...style, backgroundColor: "transparent" }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-8 select-none text-gray-600 text-right pr-4 opacity-50">
                    {i + 1}
                  </span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>

      {(hasRun || isRunning) && (
        <div className="border-t border-white/10 bg-black/70">
          <div className="flex items-center justify-between px-4 py-2 text-[11px] font-mono uppercase tracking-widest">
            <span className={runFailed ? "text-red-300" : "text-gray-400"}>
              {runFailed ? "Error Output" : "Output"}
            </span>
            {executionTime && (
              <span className={runFailed ? "text-red-300/80" : "text-green-400"}>
                {executionTime}s
              </span>
            )}
          </div>
          <div className="border-t border-white/5 px-4 py-3 font-mono text-sm">
            {isRunning ? (
              <div className="flex items-center gap-2 text-gray-400">
                <LoaderCircle size={14} className="animate-spin" />
                <span>Running example...</span>
              </div>
            ) : (
              <pre
                className={`overflow-x-auto whitespace-pre-wrap ${
                  runFailed ? "text-red-200" : "text-emerald-200"
                }`}
              >
                {output.join("\n")}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
