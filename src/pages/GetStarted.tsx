import React, { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Copy, Check } from "lucide-react";
import CodeBlock from "../components/CodeBlock";
const InstallBlock: React.FC<{ command: string; label: string }> = ({
  command,
  label,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-black/60 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-widest">
          <Terminal size={12} className="text-purple-400" />
          {label}
        </div>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors"
          title="Copy command"
        >
          {copied ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
      <div className="p-6 font-mono text-sm break-all text-purple-300 selection:bg-purple-500/30">
        <div className="flex gap-3">
          <span className="text-gray-600 select-none">$</span>
          <span>{command}</span>
        </div>
      </div>
    </div>
  );
};

const GetStarted: React.FC = () => {
  return (
    <div className="w-full text-white">
      <div className="w-full">
        <div className="flex flex-col gap-6">
          {/* Step 1: Install */}
          <motion.div
            id="install"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                <span className="text-yellow-500/50">01</span>
                Quick Install
              </h3>
              <p className="text-gray-400 text-sm max-w-2xl">
                Universal installer for macOS & Linux. Installs the compiler,
                runtime, and standard library into
                <code className="text-purple-400"> ~/.tejx</code>.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <InstallBlock
                label="Shell"
                command="curl -fsSL https://tejx-lang.github.io/install.sh | sh"
              />
            </div>

          </motion.div>

          {/* Step 2: Setup Project */}
          <motion.div
            id="init"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-purple-500/50">02</span>
                <h4 className="text-2xl font-bold">Setup Project</h4>
              </div>
              <p className="text-gray-400 text-sm max-w-2xl">
                Create a new directory for your project and navigate into it.
              </p>
            </div>
            <div className="w-full max-w-xl bg-black/40 rounded-xl p-5 border border-white/5 font-mono text-sm text-purple-300">
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <span className="text-gray-600 select-none">$</span>
                  <span>mkdir my-app && cd my-app</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3: Write Example */}
          <motion.div
            id="example"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-orange-500/50">03</span>
                <h4 className="text-2xl font-bold">Create an Example</h4>
              </div>
              <p className="text-gray-400 text-sm max-w-2xl">
                Save this small starter program into{" "}
                <code className="text-orange-400">main.tx</code> to compile and
                run your first TejX program.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <CodeBlock
                filename="main.tx"
                code={`function add(a: int, b: int): int {
    return a + b;
}

function main() {
    let name = "TejX";
    let total = add(4, 6);

    print("Hello,", name);
    print("4 + 6 =", total);
}`}
              />
            </div>
          </motion.div>

          {/* Step 4: Run */}
          <motion.div
            id="run"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-blue-500/50">04</span>
                <h4 className="text-2xl font-bold">Build & Run</h4>
              </div>
              <p className="text-gray-400 text-sm max-w-2xl">
                Execute your code with native performance. TejX compiles
                directly to machine code via LLVM.
              </p>
            </div>
            <div className="w-full max-w-xl bg-black/40 rounded-xl p-5 border border-white/5 font-mono text-sm text-blue-300">
              <div className="flex gap-3">
                <span className="text-gray-600 select-none">$</span>
                <span>tejxc main.tx && ./main</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
