import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  ChevronRight,
  Code,
  Layers,
  Shield,
  Zap,
  Menu,
  X,
  Info,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import GetStarted from "./GetStarted";

interface DocSection {
  id: string;
  title: string;
  icon: any;
  subsections?: { id: string; title: string }[];
  content: React.ReactNode;
}

const Documentation: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeSection = sectionId || "intro";

  const sections: DocSection[] = [
    {
      id: "intro",
      title: "Introduction",
      icon: Book,
      subsections: [
        { id: "overview", title: "Overview" },
        { id: "principles", title: "Core Principles" },
      ],
      content: (
        <>
          <h2 id="overview" className="text-4xl font-black mb-6 tracking-tight">
            Introduction
          </h2>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            TejX is a high-performance, single-threaded scripting language built
            on LLVM. It aims to provide the developer ergonomics of modern
            scripting languages like TypeScript while achieving the execution
            speeds of native code.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="glass-card p-6 border-purple-500/20 bg-purple-500/5">
              <h4 className="font-bold flex items-center gap-2 mb-3 text-purple-300">
                <Zap size={18} /> Performance First
              </h4>
              <p className="text-sm text-gray-400">
                Direct LLVM emission ensures that your code is optimized for the
                host architecture.
              </p>
            </div>
            <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5">
              <h4 className="font-bold flex items-center gap-2 mb-3 text-blue-300">
                <Shield size={18} /> Memory Safety
              </h4>
              <p className="text-sm text-gray-400">
                A single-ownership memory model prevents common bugs without the
                overhead of a GC.
              </p>
            </div>
          </div>

          <h3 id="principles" className="text-2xl font-bold mb-4">
            Core Principles
          </h3>
          <ul className="space-y-4 mb-8 text-gray-300">
            <li className="flex gap-3">
              <ChevronRight
                className="text-purple-500 flex-shrink-0"
                size={20}
              />
              <span>
                <strong>Static Analysis:</strong> Caught errors at compile time,
                not at 3 AM in production.
              </span>
            </li>
            <li className="flex gap-3">
              <ChevronRight
                className="text-purple-500 flex-shrink-0"
                size={20}
              />
              <span>
                <strong>Explicit Ownership:</strong> Clear resource management
                for predictable performance.
              </span>
            </li>
            <li className="flex gap-3">
              <ChevronRight
                className="text-purple-500 flex-shrink-0"
                size={20}
              />
              <span>
                <strong>Modern Syntax:</strong> Inspired by the best of Rust,
                Go, and TypeScript.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "get-started",
      title: "Get Started",
      icon: Zap,
      subsections: [
        { id: "install", title: "Quick Install" },
        { id: "init", title: "Initialize" },
        { id: "example", title: "Create Example" },
        { id: "run", title: "Build & Run" },
      ],
      content: <GetStarted />,
    },
    {
      id: "basics",
      title: "Language Basics",
      icon: Code,
      subsections: [
        { id: "variables", title: "Variables" },
        { id: "control-flow", title: "Control Flow" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            Language Basics
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Get familiar with the core syntax and grammar of TejX.
          </p>

          <section id="variables" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Variables & Data Types</h3>
            <p className="text-gray-400 mb-4">
              TejX uses <code className="text-purple-400">let</code> for
              variable declaration. Types can be explicitly annotated or
              inferred.
            </p>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] my-6">
              <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-xs font-mono text-gray-500">
                example.tx
              </div>
              <pre className="p-4 font-mono text-sm text-gray-300">
                {`let count = 10; // inferred as int
let name: string = "TejX";
let is_valid: bool = true;

// Immutable by default
// count = 11; // Error! Use 'mut' if mutability is needed (planned)`}
              </pre>
            </div>
          </section>

          <section id="control-flow">
            <h3 className="text-2xl font-bold mb-4">Control Flow</h3>
            <p className="text-gray-400 mb-4">
              Standard boolean logic and loops.
            </p>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] my-6">
              <pre className="p-4 font-mono text-sm text-gray-300">
                {`if count > 5 {
    print("Greater than 5");
} else {
    print("Less or equal");
}`}
              </pre>
            </div>
          </section>
        </>
      ),
    },
    {
      id: "functions",
      title: "Functions",
      icon: Zap,
      subsections: [
        { id: "func-basics", title: "Basics" },
        { id: "func-entry", title: "Entry Point" },
      ],
      content: (
        <>
          <h2
            id="func-basics"
            className="text-4xl font-black mb-6 tracking-tight"
          >
            Functions
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Functions are first-class citizens in TejX.
          </p>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] my-6">
            <pre className="p-4 font-mono text-sm text-gray-300">
              {`func add(a: int, b: int) -> int {
    return a + b;
}

func main() {
    let result = add(10, 20);
    print(result);
}`}
            </pre>
          </div>
          <div
            id="func-entry"
            className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-8"
          >
            <h4 className="flex items-center gap-2 font-bold text-blue-300 mb-2">
              <Info size={18} /> Entry Point
            </h4>
            <p className="text-sm text-gray-400">
              Every TejX program requires a{" "}
              <code className="text-white font-bold">func main()</code> as its
              starting point.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "memory",
      title: "Memory Model",
      icon: Layers,
      subsections: [{ id: "memory-rules", title: "Ownership Rules" }],
      content: (
        <>
          <h2
            id="memory-rules"
            className="text-4xl font-black mb-6 tracking-tight"
          >
            Memory Model
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Predictable resource management through single-ownership.
          </p>
          <p className="text-gray-300 mb-6 leading-relaxed">
            TejX avoids the pauses associated with Garbage Collection by using a
            strictly defined ownership system. Every object has exactly one
            owner at any given time.
          </p>
          <div className="glass-card p-8 border-purple-500/20 mb-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Shield size={120} />
            </div>
            <h4 className="text-xl font-bold mb-4">Ownership Rules</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  1
                </span>
                <span>
                  Each value in TejX has a variable that’s called its{" "}
                  <strong>owner</strong>.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  2
                </span>
                <span>There can only be one owner at a time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  3
                </span>
                <span>
                  When the owner goes out of scope, the value will be{" "}
                  <strong>dropped</strong> (freed).
                </span>
              </li>
            </ul>
          </div>
        </>
      ),
    },
  ];

  const scrollToSection = (id: string) => {
    navigate(`/docs/${id}`);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSubsection = (sectionId: string, subsectionId: string) => {
    setIsSidebarOpen(false);
    if (activeSection !== sectionId) {
      navigate(`/docs/${sectionId}`);
      // Wait for navigation and render
      setTimeout(() => {
        const element = document.getElementById(subsectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(subsectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020202]">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-purple-600 text-white shadow-2xl"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="container flex items-start gap-12 py-12 relative">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:bg-transparent md:backdrop-blur-none
          md:sticky md:top-24 md:block md:w-72 md:shrink-0 h-fit
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        >
          <div className="p-8 md:p-0">
            <div className="flex items-center gap-3 mb-10 px-2">
              <Book className="text-purple-500" />
              <span className="text-xl font-black uppercase tracking-[0.2em]">
                Docs
              </span>
            </div>
            <nav className="space-y-8">
              {/* Core Documentation Links */}
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4 px-2">
                  Content
                </p>
                <div className="space-y-1">
                  {sections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          activeSection === section.id
                            ? "bg-purple-500/10 text-white font-bold border border-purple-500/20 shadow-lg shadow-purple-500/5"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <section.icon
                            size={18}
                            className={
                              activeSection === section.id
                                ? "text-purple-500"
                                : "text-gray-500"
                            }
                          />
                          <span>{section.title}</span>
                        </div>
                        {activeSection === section.id && (
                          <motion.div
                            layoutId="active-indicator"
                            className="w-1 h-4 bg-purple-500 rounded-full"
                          />
                        )}
                      </button>

                      {/* Subsections */}
                      <AnimatePresence>
                        {activeSection === section.id &&
                          section.subsections && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="ml-9 mt-1 flex flex-col gap-1 overflow-hidden border-l border-white/5 py-1"
                            >
                              {section.subsections.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() =>
                                    scrollToSubsection(section.id, sub.id)
                                  }
                                  className="w-full text-left px-3 py-1.5 text-[11px] text-gray-500 hover:text-purple-400 transition-colors hover:bg-white/5 rounded-lg"
                                >
                                  {sub.title}
                                </button>
                              ))}
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-grow max-w-4xl pt-4 transition-all duration-300 ${isSidebarOpen ? "blur-sm md:blur-none" : ""}`}
        >
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {sections.find((s) => s.id === activeSection)?.content}

            {/* Pagination Controls */}
            <div className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-sm">
              <div className="text-gray-500 font-mono flex items-center gap-2">
                <Zap size={14} className="text-purple-500" />
                TejX Documentation v1.0
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-gray-400 hover:text-white flex items-center gap-2 group"
              >
                Back to Top{" "}
                <ChevronRight
                  size={14}
                  className="-rotate-90 text-purple-500 group-hover:-translate-y-1 transition-transform"
                />
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Documentation;
