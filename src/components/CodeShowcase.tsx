import React from "react";
import { motion } from "framer-motion";

const CodeShowcase: React.FC = () => {
  const codeSnippet = `import { parse, stringify } from "std:json";

function main() {
    let x = 42;
    let s = stringify(x);
    print("Stringified x:", s);

    let parsed = parse(s);
    print("Parsed value (dummy 42 for now):", parsed);
}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="rounded-xl overflow-hidden bg-[#0F1117] border border-white/10 shadow-2xl">
        {/* Window Controls */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <div className="ml-auto text-xs text-gray-500 font-mono">main.tx</div>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-x-auto min-h-[220px]">
          <pre className="font-mono text-sm leading-relaxed">
            <code className="text-gray-300">
              {codeSnippet.split("\n").map((line, i) => (
                <div key={i} className="flex">
                  <span className="text-gray-700 w-8 flex-shrink-0 select-none text-right pr-4">
                    {i + 1}
                  </span>
                  <span className="whitespace-pre">
                    {(() => {
                      const regex =
                        /(\b(?:function|func|return|if|else|let|const|import|from|int|string|bool|void|main|add|print|parse|stringify)\b|"(?:[^"\\]|\\.)*"|\/\/.*)/g;
                      const parts = line.split(regex);
                      return parts.map((part, index) => {
                        if (
                          /^(function|func|return|if|else|let|const|import|from)$/.test(
                            part,
                          )
                        ) {
                          return (
                            <span
                              key={index}
                              className="text-purple-400 font-bold"
                            >
                              {part}
                            </span>
                          );
                        }
                        if (/^(int|string|bool|void)$/.test(part)) {
                          return (
                            <span key={index} className="text-yellow-400">
                              {part}
                            </span>
                          );
                        }
                        if (/^".*"$/.test(part)) {
                          return (
                            <span key={index} className="text-green-400">
                              {part}
                            </span>
                          );
                        }
                        if (/^\/\/.*$/.test(part)) {
                          return (
                            <span key={index} className="text-gray-500 italic">
                              {part}
                            </span>
                          );
                        }
                        if (/^(main|add|print|parse|stringify)$/.test(part)) {
                          return (
                            <span key={index} className="text-blue-400">
                              {part}
                            </span>
                          );
                        }
                        return part;
                      });
                    })()}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeShowcase;
