import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Cpu, Code, ArrowRight, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_CONFIG } from "../lib/constants";
import CodeShowcase from "../components/CodeShowcase";

const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="container pt-32 pb-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 to-blue-500/30 blur-[100px] rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              v{APP_CONFIG.VERSION} is now live
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
              The Future of <br />
              <span className="gradient-text">Modern Programming</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
              {APP_CONFIG.DESCRIPTION} Build high-performance applications with
              the simplicity of TypeScript and the speed of C.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/get-started"
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Start Building <ArrowRight size={20} />
              </Link>
              <Link
                to="/docs"
                className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors font-bold"
              >
                Documentation
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <div className="relative">
            <CodeShowcase />
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 p-4 glass-card bg-black/40 border-purple-500/30 backdrop-blur-xl z-20 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold">
                    Performance
                  </div>
                  <div className="font-mono font-bold text-white">
                    Native Speed
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Runtime", value: "Zero GC" },
              { label: "Backend", value: "LLVM 18" },
              { label: "Safety", value: "Borrow Checker" },
              { label: "License", value: "Open Source" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Features */}
      <section id="features" className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Built for Performance
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the power of a systems language with the ergonomics of a
            modern programming language.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {[
            {
              icon: Zap,
              color: "text-purple-400",
              bg: "bg-purple-500/10 border-purple-500/20",
              title: "Native Performance",
              desc: "TejX is a compiled language that targets native machine code via LLVM, delivering C++ level performance with the ergonomics of TypeScript.",
            },
            {
              icon: Shield,
              color: "text-blue-400",
              bg: "bg-blue-500/10 border-blue-500/20",
              title: "Ownership Memory",
              desc: "A unique ownership-based memory model ensures safety without a garbage collector, eliminating data races and memory leaks at compile time.",
            },
            {
              icon: Cpu,
              color: "text-green-400",
              bg: "bg-green-500/10 border-green-500/20",
              title: "Compiled & Multithreaded",
              desc: "Built from the ground up for modern hardware, TejX supports efficient multithreading and parallel execution for maximum throughput.",
            },
            {
              icon: Code,
              color: "text-yellow-400",
              bg: "bg-yellow-500/10 border-yellow-500/20",
              title: "TypeScript Syntax",
              desc: "Write high-performance systems code using the syntax you already know. TypeScript-like types and patterns meet native power.",
            },
          ].map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`p-8 rounded-3xl border ${feat.bg} transition-all hover:bg-opacity-20`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${feat.bg} ${feat.color} flex items-center justify-center mb-6`}
              >
                <feat.icon size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-24">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-black p-12 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to start building?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the developers building the next generation of
              high-performance applications with TejX.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/get-started"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-100 transition-colors"
              >
                Get Started Now
              </Link>
              <a
                href={APP_CONFIG.GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-bold flex items-center justify-center gap-2"
              >
                <Github size={20} /> Star on GitHub
              </a>
            </div>
          </div>

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500/10 blur-[100px] pointer-events-none" />
        </div>
      </section>
    </>
  );
};

export default Home;
