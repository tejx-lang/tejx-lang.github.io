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
  Box,
  Activity,
  Server,
  List,
  AlertTriangle,
  Package,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import GetStarted from "./GetStarted";
import CodeBlock from "../components/CodeBlock";

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
      title: "Philosophy & Vision",
      icon: Book,
      subsections: [
        { id: "overview", title: "Evolution of Systems Code" },
        { id: "hybrid", title: "The Hybrid Strategy" },
        { id: "principles", title: "Core Principles" },
      ],
      content: (
        <>
          <div className="mb-12">
            <h2
              id="overview"
              className="text-4xl md:text-5xl font-black mb-6 tracking-tight gradient-text"
            >
              Philosophy & Vision
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-3xl">
              TejX is built on the belief that code should be as expressive as
              JavaScript but as robust and predictable as a systems language. By
              leveraging the **LLVM 18** infrastructure, TejX compiles directly
              to optimized machine code, eliminating the overhead of interpreted
              runtimes and garbage collections.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {[
              {
                icon: Zap,
                title: "Near-Native Performance",
                desc: "Compiled directly to machine code via LLVM with aggressive optimizations.",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
              },
              {
                icon: Shield,
                title: "Safety Without GC",
                desc: "A strict ownership-based memory model prevents leaks and races at compile-time.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                icon: Layers,
                title: "Native Concurrency",
                desc: "First-class support for multithreading and parallel execution on modern hardware.",
                color: "text-green-400",
                bg: "bg-green-500/10",
              },
              {
                icon: Code,
                title: "Modern Identity",
                desc: "Typed equality and static identity checks ensure your logic is stable and sound.",
                color: "text-yellow-400",
                bg: "bg-yellow-500/10",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${feat.bg} ${feat.color} flex items-center justify-center mb-4`}
                >
                  <feat.icon size={20} />
                </div>
                <h4 className="font-bold mb-2">{feat.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          <section id="hybrid" className="mb-16">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">
                🌓
              </span>
              The Hybrid Strategy
            </h3>
            <div className="prose prose-invert max-w-none text-gray-400 space-y-6">
              <p>
                TejX represents a total evolution from the baggage of legacy
                dynamic languages. We've removed the fragile parts of the
                ecosystem—like `null/undefined` confusion and prototype
                pollution—and replaced them with proven systems architecture:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse border border-white/5">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="p-3">Aspect</th>
                      <th className="p-3">Dynamic Baggage (Removed)</th>
                      <th className="p-3">TejX Evolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-white/5">
                      <td className="p-3 font-bold text-purple-400">Memory</td>
                      <td className="p-3 italic text-gray-500">
                        Garbage Collection (Pauses)
                      </td>
                      <td className="p-3">
                        Deterministic ARC (Automatic Ref Count)
                      </td>
                    </tr>
                    <tr className="border-t border-white/5">
                      <td className="p-3 font-bold text-blue-400">Logic</td>
                      <td className="p-3 italic text-gray-500">
                        Truthy/Falsy Coercion
                      </td>
                      <td className="p-3">Strict Typed Booleans</td>
                    </tr>
                    <tr className="border-t border-white/5">
                      <td className="p-3 font-bold text-green-400">Types</td>
                      <td className="p-3 italic text-gray-500">
                        Loose Structural Refs
                      </td>
                      <td className="p-3">Memory-Stable Static Structs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="principles" className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Core Philosophy</h3>
            <div className="space-y-4">
              {[
                {
                  title: "Deterministic Execution",
                  content:
                    "Resource cleanup happens the moment a variable goes out of scope. No unexpected pauses, just steady performance.",
                },
                {
                  title: "Exhaustive Safety",
                  content:
                    "From Option types to Result-based error handling, the compiler ensures you handle every possible state of your program.",
                },
                {
                  title: "Zero-Cost Abstractions",
                  content:
                    "Protocols and Extensions allow for high-level design patterns without the runtime performance penalties usually associated with them.",
                },
              ].map((p, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex-shrink-0 mt-1">
                    <ChevronRight
                      className="text-purple-500 group-hover:translate-x-1 transition-transform"
                      size={20}
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-200 mb-1">{p.title}</h5>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {p.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ),
    },
    {
      id: "get-started",
      title: "Get Started",
      icon: Zap,
      subsections: [
        { id: "install", title: "Quick Install" },
        { id: "init", title: "Setup Project" },
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
        { id: "variables", title: "Variable Scoping" },
        { id: "primitives", title: "Native Primitives" },
        { id: "strings", title: "String Manipulation" },
        { id: "control-flow", title: "Control Flow" },
        { id: "templates", title: "Template Literals" },
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
            <h3 className="text-2xl font-bold mb-4">Variable Scoping</h3>
            <p className="text-gray-400 mb-4">
              TejX uses Lexical Scoping and prevents "hoisting" behaviors common
              in dynamic languages. Immutability is enforced at the hardware
              level when using <code className="text-purple-400">const</code>.
            </p>
            <CodeBlock
              filename="scoping.tx"
              code={`function main() {
    let x: int = 10; // Mutable variable
    const Y: int = 20; // Immutable constant

    {
        let x: int = 30; // Shadowing: this 'x' only exists in this block
        print(x); // 30
    }
    print(x); // 10

    // Y = 30; // Error: Assignment to constant variable
}`}
            />
          </section>

          <section id="primitives" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Native Primitives</h3>
            <p className="text-gray-400 mb-4">
              Unlike the generic "number" in JS, TejX provides precision types
              mapping directly to CPU registers.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                { type: "int / int32", desc: "Standard 32-bit integer" },
                { type: "int64", desc: "64-bit wide integer" },
                { type: "float / f32", desc: "Single-precision decimal" },
                { type: "f64", desc: "Double-precision decimal" },
                { type: "bool", desc: "Strict boolean (true/false)" },
                { type: "string", desc: "UTF-8 encoded sequence of chars" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="font-mono text-purple-400 font-bold mb-1">
                    {item.type}
                  </div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="operators" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Operators</h3>
            <p className="text-gray-400 mb-4">
              Full suite of arithmetic, relational, and logical operators.
            </p>
            <CodeBlock
              code={`function main() {
    // Arithmetic
    let sum = 10 + 5;
    let diff = 10 - 5;
    let prod = 10 * 5;
    let quot = 10 / 2;
    let mod = 10 % 3;

    // Compound Assignment
    let x = 10;
    x += 5; // 15
    x *= 2; // 30

    // Logical
    let res = (x > 10) && (x < 100);
    let isValid = !res || true;

    // Type Check
    if (typeof(x) == "int") {
        print("x is an integer");
    }
}`}
            />
          </section>

          <section id="strings" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">String Manipulation</h3>
            <p className="text-gray-400 mb-4">
              Strings in TejX are UTF-8 encoded and provide a range of built-in
              methods for manipulation and inspection.
            </p>
            <CodeBlock
              filename="strings_demo.tx"
              code={`function main() {
    let s = "  TejX Systems Programming  ";

    // Length and indexing
    print("Length: ", s.length);
    print("Char at 2: ", s.at(2)); // "T"

    // Search and extract
    print("Index of 'Systems': ", s.indexOf("Systems"));
    print("Substring: ", s.substring(2, 6)); // "TejX"

    // Transformation
    print("Upper: ", s.toUpper());
    print("Lower: ", s.toLower());
    print("Trimmed: [", s.trim(), "]");
}`}
            />
          </section>

          <section id="control-flow">
            <h3 className="text-2xl font-bold mb-4">Control Flow</h3>
            <p className="text-gray-400 mb-4">
              Comprehensive control structures for program logic.
            </p>

            <h4 className="text-lg font-bold mb-2 text-purple-300">
              Conditionals
            </h4>
            <CodeBlock
              code={`function main() {
    let score = 85;

    if (score >= 90) {
        print("Grade: A");
    } else if (score >= 80) {
        print("Grade: B");
    } else {
        print("Grade: C");
    }

    // Switch Statement
    switch (score) {
        case 100: print("Perfect!"); break;
        case 0: print("Failed"); break;
        default: print("Score is ", score);
    }
}`}
            />

            <h4 className="text-lg font-bold mb-2 text-purple-300">Loops</h4>
            <CodeBlock
              code={`function main() {
    // C-Style For Loop
    for (let i = 0; i < 5; i++) {
        if (i == 2) continue; // Skip 2
        if (i == 4) break;    // Stop at 4
        print("i: ", i);
    }

    // While Loop
    let j = 0;
    while (j < 3) {
        print("j: ", j);
        j++;
    }

    // For-Of Loop (Iterables)
    let items = [10, 20, 30];
    for (let item of items) {
        print("Item: ", item);
    }
}`}
            />
          </section>

          <section
            id="basics-example"
            className="mt-8 pt-8 border-t border-white/5"
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">
              <Zap size={18} className="inline mr-2" />
              Complete Example
            </h3>
            <CodeBlock
              filename="basics_demo.tx"
              runCommand="tejx run basics_demo.tx"
              code={`function main() {
    let name = "TejX User";
    let score = 95;

    print("Hello, ", name);

    if (score > 90) {
        print("Rank: S");
    } else {
        print("Rank: A");
    }

    print("Counting down:");
    // C-style loop
    for(let i = 3; i > 0; i--) {
        print(i);
    }
}`}
            />
          </section>
        </>
      ),
    },
    {
      id: "advanced-types",
      title: "Advanced Type System",
      icon: Box,
      subsections: [
        { id: "type-aliases", title: "Type Aliases" },
        { id: "option-types", title: "Option<T> & Null Safety" },
        { id: "structural-typing", title: "Structural Typing" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            Advanced Type System
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            TejX features a sophisticated type system designed for maximum
            safety and zero runtime overhead.
          </p>

          <section id="type-aliases" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Type Aliases</h3>
            <p className="text-gray-400 mb-4">
              Create semantic names for complex types. These are resolved at
              compile-time and have zero runtime cost.
            </p>
            <CodeBlock
              filename="aliases.tx"
              code={`type ID = int;
type Point = { x: int, y: int };
type Handler = (msg: string) => void;

function process(id: ID, p: Point): void {
    print("Processing ID: ", id);
}

function main() {
    let p: Point = { x: 10, y: 20 };
    process(123, p);
}`}
            />
          </section>

          <section id="option-types" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">
              Option&lt;T&gt; & Null Safety
            </h3>
            <p className="text-gray-400 mb-4">
              TejX eliminates "Null Pointer Exceptions" by using the{" "}
              <code className="text-purple-400">Option</code> type. A value is
              either <code className="text-purple-400">Some(value)</code> or{" "}
              <code className="text-purple-400">None</code>.
            </p>
            <CodeBlock
              filename="options.tx"
              code={`function findUser(id: int): Option<string> {
    if (id == 1) return Some("Alice");
    return None;
}

function main() {
    let user = findUser(2);

    // Optional Chaining
    let len = user?.length; 

    // Nullish Coalescing
    let name = user ?? "Guest";

    print("Hello, ", name);
}`}
            />
          </section>

          <section
            id="types-example"
            className="mt-8 pt-8 border-t border-white/5"
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">
              <Zap size={18} className="inline mr-2" />
              Complete Example
            </h3>
            <CodeBlock
              filename="types_pro.tx"
              runCommand="tejx run types_pro.tx"
              code={`type User = { id: int, name: string };

function getUser(id: int): Option<User> {
    if (id == 42) return Some({ id: 42, name: "Douglas" });
    return None;
}

function main() {
    let user = getUser(42);
    
    // Pattern matching is the best way to handle Options (see next section)
    if (user != None) {
        print("Found: ", user.name);
    } else {
        print("User not found");
    }
    
    // Using nullish coalescing for defaults
    let display = user?.name ?? "Anonymous";
    print("Welcome, ", display);
}`}
            />
          </section>
        </>
      ),
    },
    {
      id: "functions",
      title: "Functions & Ownership",
      icon: Zap,
      subsections: [
        { id: "func-basics", title: "Basics" },
        { id: "func-ownership", title: "Ownership & Moves" },
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
            First-class functions with support for lambdas and closures.
          </p>
          <div className="mb-6">
            <CodeBlock
              filename="functions.tx"
              code={`// Named Function with Return Type
function add(a: int, b: int): int {
    return a + b;
}

// Higher-Order Functions
function process(val: int, op: (n: int) => int): int {
    return op(val);
}

// Closures
function makeAdder(base: int): (n: int) => int {
    return (n: int) => base + n;
}

function main() {
    // Arrow Functions (Lambdas)
    let square = (x: int) => x * x;

    print("Add: ", add(10, 20));
    print("Process: ", process(5, square));

    let add5 = makeAdder(5);
    print("Add5: ", add5(10)); // 15
}`}
            />
          </div>

          <section id="func-ownership" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">
              Ownership & Move Semantics
            </h3>
            <p className="text-gray-400 mb-4">
              To achieve C++ performance without GC, TejX uses an ownership
              model. When you pass a non-primitive value to a function,
              ownership is **moved** by default.
            </p>
            <CodeBlock
              filename="ownership.tx"
              code={`function takeOwnership(s: string): void {
    print("Received: ", s);
} // 's' is dropped here

function main() {
    let data: string = "Important Data";
    takeOwnership(data);
    
    // print(data); // Error: 'data' was moved to takeOwnership
}`}
            />
          </section>

          <section
            id="funcs-example"
            className="mt-8 pt-8 border-t border-white/5"
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">
              <Zap size={18} className="inline mr-2" />
              Complete Example
            </h3>
            <CodeBlock
              filename="funcs_demo.tx"
              runCommand="tejx run funcs_demo.tx"
              code={`function add(a: int, b: int):int {
    return a + b;
}

function process(n: int, op: (x: int) => int):int {
    return op(n);
}

function main() {
    let res = add(10, 20);
    print("Add: ", res);

    let square = (x: int) => x * x;
    print("Square 5: ", process(5, square));
}`}
            />
          </section>
          <div
            id="func-entry"
            className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-8"
          >
            <h4 className="flex items-center gap-2 font-bold text-blue-300 mb-2">
              <Info size={18} /> Entry Point
            </h4>
            <p className="text-sm text-gray-400">
              Every TejX program requires a{" "}
              <code className="text-white font-bold">function main()</code> as
              its starting point.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "data-structures",
      title: "Data Structures",
      icon: List,
      subsections: [
        { id: "arrays", title: "Arrays" },
        { id: "structs-obj", title: "Structs & Objects" },
        { id: "collections", title: "Collections" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            Data Structures
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Efficient primitives and standard collections.
          </p>

          <section id="arrays" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Arrays</h3>
            <p className="text-gray-400 mb-4">
              Dynamic, growable arrays with a rich standard library of methods.
            </p>
            <CodeBlock
              code={`function main() {
    // Creation
    let numbers: int[] = [1, 2, 3];
    let names = ["Alice", "Bob"];

    // Access & Mutation
    let first = numbers[0];
    numbers[1] = 99;

    // Methods
    numbers.push(4);             // Append: [1, 99, 3, 4]
    let last = numbers.pop();    // Remove last: 4
    let len = numbers.length;    // Property: 3
    let idx = numbers.indexOf(99); // 1
    let part = numbers.slice(0, 2); // [1, 99]

    // Functional Methods
    let doubled = numbers.map((x: int) => x * 2);
    let evens = numbers.filter((x: int) => x % 2 == 0);
    numbers.forEach((x: int) => print(x));

    print("Length: ", numbers.length);
    print("Doubled[0]: ", doubled[0]);
}`}
            />
          </section>

          <section id="structs-obj" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">
              Structs (Anonymous Objects)
            </h3>
            <p className="text-gray-400 mb-4">
              Lightweight data structures for organizing related data.
            </p>
            <CodeBlock
              code={`function main() {
    // Object Literal
    let user = {
        id: 1,
        name: "TejX",
        metadata: {
            role: "admin",
            active: true
        }
    };

    // Access
    print("User: ", user.name);
    print("Role: ", user.metadata.role);

    // Array of Objects
    let users = [
        { id: 1, name: "A" },
        { id: 2, name: "B" }
    ];
    print("Users count: ", users.length);
}`}
            />
          </section>

          <section id="collections">
            <h3 className="text-2xl font-bold mb-4">Standard Collections</h3>
            <p className="text-gray-400 mb-4">
              High-performance data structures available in{" "}
              <code className="text-purple-400">std:collections</code>.
            </p>
            <CodeBlock
              filename="collections_demo.tx"
              code={`import { Stack, Queue, Map, Set } from "std:collections";

function main() {
    // Stack (LIFO)
    let s = new Stack<int>();
    s.push(10);
    s.push(20);
    print("Pop Stack: ", s.pop()); // 20

    // Queue (FIFO)
    let q = new Queue<string>();
    q.enqueue("Task 1");
    print("Dequeue: ", q.dequeue());

    // Map (Key-Value)
    let config = new Map<string, int>();
    config.put("port", 8080);
    config.put("timeout", 1000);
    print("Port: ", config.at("port"));
    print("Has timeout: ", config.has("timeout"));
    config.remove("timeout");
    print("Size: ", config.size());

    // Set (Unique Values)
    let unique = new Set<int>();
    unique.add(1);
    unique.add(1); // Duplicate ignored
    print("Has 1: ", unique.has(1));
    unique.remove(1);
    print("Set Size: ", unique.size()); // 0
    unique.clear();
}`}
            />
          </section>

          <section
            id="ds-example"
            className="mt-8 pt-8 border-t border-white/5"
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">
              <Zap size={18} className="inline mr-2" />
              Complete Example
            </h3>
            <CodeBlock
              filename="ds_demo.tx"
              runCommand="tejx run ds_demo.tx"
              code={`import { Stack, Map } from "std:collections";

function main() {
    // Array
    let nums = [10, 20, 30];
    nums.push(40);
    print("Array[3]: ", nums[3]);

    // Stack
    let s = new Stack<string>();
    s.push("First");
    s.push("Second");
    print("Pop Stack: ", s.pop());

    // Map
    let scores = new Map<string, int>();
    scores.put("Alice", 100);
    print("Alice Score: ", scores.at("Alice"));
}`}
            />
          </section>
        </>
      ),
    },
    {
      id: "errors",
      title: "Error Handling",
      icon: AlertTriangle,
      subsections: [
        { id: "try-catch", title: "Try/Catch" },
        { id: "custom-errors", title: "Custom Errors" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            Error Handling
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Robust error handling with try-catch and custom error types.
          </p>

          <section id="try-catch" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Try, Catch, Finally</h3>
            <p className="text-gray-400 mb-4">
              Safe error propagation and resource cleanup.
            </p>
            <CodeBlock
              code={`function divide(a: int, b: int): int {
    if (b == 0) {
        throw "Division by zero";
    }
    return a / b;
}

function main() {
    try {
        let result = divide(10, 0);
        print("Result: ", result);
    } catch (e) {
        print("Error caught: ", e);
    } finally {
        print("Execution complete");
    }

    // Nested Try-Catch matching scopes correctly
    try {
        try {
            throw "Inner error";
        } catch(e) {
            throw e; // Rethrow
        }
    } catch(e) {
        print("Handled in outer block: ", e);
    }
}`}
            />
          </section>

          <section id="custom-errors">
            <h3 className="text-2xl font-bold mb-4">Custom Errors</h3>
            <p className="text-gray-400 mb-4">
              Extend the base <code>Error</code> class for typed exception
              handling.
            </p>
            <CodeBlock
              code={`class HttpError extends Error {
    statusCode: int;

    constructor(message: string, code: int) {
        super(message);
        this.statusCode = code;
    }
}

function main() {
    try {
        throw new HttpError("Not Found", 404);
    } catch (e) {
        if (e.statusCode == 404) {
            print("Page not found (404)");
        }
        print("Error Message: ", e.message);
    }
}`}
            />
          </section>

          <section
            id="errors-example"
            className="mt-8 pt-8 border-t border-white/5"
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">
              <Zap size={18} className="inline mr-2" />
              Complete Example
            </h3>
            <CodeBlock
              filename="errors_demo.tx"
              runCommand="tejx run errors_demo.tx"
              code={`class AuthError extends Error {
    constructor(msg: string) { super(msg); }
}

function login(token: string) {
    if (token == "") throw new AuthError("Empty Token");
    print("Logged in with ", token);
}

function main() {
    try {
        login("");
    } catch (e) {
        if (e instanceof AuthError) {
            print("Auth Failed: ", e.message);
        } else {
            print("Unknown Error: ", e);
        }
    } finally {
        print("Login attempt finished.");
    }
}`}
            />
          </section>
        </>
      ),
    },
    {
      id: "modules",
      title: "Modules",
      icon: Package,
      subsections: [{ id: "imports", title: "Imports & Exports" }],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">Modules</h2>
          <p className="text-xl text-gray-400 mb-8">
            Organize code into reusable files.
          </p>

          <section id="imports">
            <h3 className="text-2xl font-bold mb-4">Imports & Exports</h3>
            <CodeBlock
              filename="math.tx"
              code={`// Named Export
export function add(a: int, b: int):int {
    return a + b;
}

// Export Constant
export const PI = 3.14;

// Default Export
export default function multiply(a: int, b: int): int {
    return a * b;
}`}
            />
            <CodeBlock
              filename="main.tx"
              code={`import mul, { add, PI } from "./math.tx";

print(add(10, 20));
print(mul(5, 5));`}
            />
          </section>

          <section
            id="modules-example"
            className="mt-8 pt-8 border-t border-white/5"
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">
              <Zap size={18} className="inline mr-2" />
              Complete Example
            </h3>
            <CodeBlock
              filename="modules_demo.tx"
              runCommand="tejx run modules_demo.tx"
              code={`// --- file: math_utils.tx ---
// export function double(n: int):int { return n * 2; }

// --- file: modules_demo.tx ---
import { double } from "./math_utils.tx";

function main() {
    // Assuming math_utils.tx exists
    // print("Double 10: ", double(10));
    
    // For this single-file demo, we simulate logic:
    print("Module system allows splitting code.");
    print("Use 'import' to bring in exported functions.");
}`}
            />
          </section>
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
    {
      id: "oop",
      title: "Object-Oriented Programming",
      icon: Box,
      subsections: [
        { id: "oop-basics", title: "Classes & Inheritance" },
        { id: "protocols", title: "Protocols (Interfaces)" },
        { id: "extensions", title: "Type Extensions" },
        { id: "access-control", title: "Access Control" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            Object-Oriented Programming
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Modern OOP with strict contracts, traits, and powerful extensions.
          </p>

          <section id="oop-basics" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Classes & Inheritance</h3>
            <p className="text-gray-400 mb-4">
              Single inheritance with support for abstract base classes and
              automatic method dispatching.
            </p>
            <CodeBlock
              filename="oop.tx"
              code={`abstract class Animal {
    name: string;
    constructor(name: string) { this.name = name; }
    abstract makeSound(): void;
}

class Dog extends Animal {
    makeSound(): void { print(this.name, " says Woof!"); }
}

function main() {
    let d = new Dog("Buddy");
    d.makeSound();
}`}
            />
          </section>

          <section id="protocols" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Protocols (Interfaces)</h3>
            <p className="text-gray-400 mb-4">
              Protocols define strict contracts. Unlike structural typing,
              Protocols are nominally checked for robustness.
            </p>
            <CodeBlock
              filename="protocols.tx"
              code={`protocol Drawable {
    draw(): void;
}

class Circle implements Drawable {
    draw(): void { print("Drawing Circle"); }
}

function render(item: Drawable): void {
    item.draw();
}

function main() {
    let c = new Circle();
    render(c);
}`}
            />
          </section>

          <section id="extensions" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Type Extensions</h3>
            <p className="text-gray-400 mb-4">
              Add new functionality to existing types (even primitives) without
              modifying their original source.
            </p>
            <CodeBlock
              filename="extensions.tx"
              code={`extension string {
    function greet(): void {
        print("Hello, " + this);
    }
}

function main() {
    "User".greet(); // Hello, User
}`}
            />
          </section>

          <section id="access-control" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Access Control</h3>
            <p className="text-gray-400 mb-4">
              TejX supports standard access modifiers to ensure encapsulation.
            </p>
            <CodeBlock
              code={`class SecureBank {
    public id: int;
    private balance: float;
    protected managerId: string;
    
    constructor() {
        this.balance = 0.0;
    }
}`}
            />
          </section>

          <section
            id="oop-example"
            className="mt-8 pt-8 border-t border-white/5"
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">
              <Zap size={18} className="inline mr-2" />
              Complete Example
            </h3>
            <CodeBlock
              filename="oop_pro.tx"
              runCommand="tejx run oop_pro.tx"
              code={`protocol Shaper {
    area(): float;
}

class Rect implements Shaper {
    w: float; h: float;
    constructor(w: float, h: float) {
        this.w = w; this.h = h;
    }
    area(): float { return this.w * this.h; }
}

extension Rect {
    function log(): void {
        print("Rectangle: ", this.w, "x", this.h);
    }
}

function main() {
    let r = new Rect(10.0, 5.0);
    r.log();
    print("Area: ", r.area());
}`}
            />
          </section>
        </>
      ),
    },
    {
      id: "async",
      title: "Async & Concurrency",
      icon: Activity,
      subsections: [
        { id: "async-await", title: "Structured Async" },
        { id: "threading", title: "Heavyweight Threads" },
        { id: "mutex", title: "Shared State & Locks" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            Async & Concurrency
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            TejX provides high-level structured concurrency and low-level thread
            management for maximum hardware utilization.
          </p>

          <section id="async-await" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Structured Async/Await</h3>
            <p className="text-gray-400 mb-4">
              Use <code className="text-purple-400">async</code> to define tasks
              and <code className="text-purple-400">await</code> to resolve them
              without blocking the event loop.
            </p>
            <CodeBlock
              filename="async.tx"
              code={`async function fetchData(url: string): string {
    await time.sleep(100); // Simulate I/O
    return "Response from " + url;
}

async function main() {
    let [res1, res2] = await Promise.all([
        fetchData("api1.com"),
        fetchData("api2.com")
    ]);
    print(res1, res2);
}`}
            />
          </section>

          <section id="threads" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Heavyweight Threads</h3>
            <p className="text-gray-400 mb-4">
              For CPU-intensive tasks, TejX maps directly to OS threads using
              the <code className="text-purple-400">Thread</code> module.
            </p>
            <CodeBlock
              code={`import { Thread } from "std:thread";

function heavyTask(range: int): void {
    for (let i = 0; i < range; i++) { /* complex math */ }
    print("Done");
}

function main() {
    Thread.spawn(() => heavyTask(1000000));
}`}
            />
          </section>

          <section id="mutex" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Shared State (Mutex)</h3>
            <p className="text-gray-400 mb-4">
              Protect shared data with the built-in Mutex for thread-safe
              concurrency.
            </p>
            <CodeBlock
              filename="mutex.tx"
              code={`import { Mutex } from "std:sync";

let lock = new Mutex();
let counter = 0;

function increment(): void {
    lock.lock();
    counter++;
    lock.unlock();
}

function main() {
    Thread.spawn(increment);
    Thread.spawn(increment);
}`}
            />
          </section>

          <section
            id="async-example"
            className="mt-8 pt-8 border-t border-white/5"
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">
              <Zap size={18} className="inline mr-2" />
              Complete Example
            </h3>
            <CodeBlock
              filename="concurrency_pro.tx"
              runCommand="tejx run concurrency_pro.tx"
              code={`import { Thread } from "std:thread";
import { Mutex } from "std:sync";

let counterLock = new Mutex();
let count = 0;

function work(id: int): void {
    counterLock.lock();
    count++;
    print("Worker ", id, " updated count to ", count);
    counterLock.unlock();
}

function main() {
    print("Starting concurrent workers...");
    for (let i = 0; i < 5; i++) {
        Thread.spawn(() => work(i));
    }
    // Wait slightly for threads (proper join planned)
    time.sleep(100);
    print("Final Count: ", count);
}`}
            />
          </section>
        </>
      ),
    },
    {
      id: "stdlib",
      title: "Standard Library Reference",
      icon: Server,
      subsections: [
        { id: "fs", title: "std:fs (File System)" },
        { id: "net", title: "std:net (Networking)" },
        { id: "json", title: "std:json (Serialization)" },
        { id: "time", title: "std:time (Timing)" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            Standard Library Reference
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            The TejX standard library provides zero-cost wrappers around native
            C++ system capabilities.
          </p>

          <section id="fs" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">std:fs</h3>
            <CodeBlock
              code={`import fs from "std:fs";

function main() {
    fs.writeFileSync("config.tx", "DEBUG=true");
    let content = fs.readFileSync("config.tx");
    print("Content: ", content);

    if (fs.exists("logs")) {
        fs.readdir("logs").forEach((f: string) => print("Log File: ", f));
    }
}`}
            />
          </section>

          <section id="json" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">std:json</h3>
            <CodeBlock
              code={`import { parse, stringify } from "std:json";

function main() {
    let data = { name: "TejX", fast: true };
    let jsonStr = stringify(data);
    let obj = parse(jsonStr);

    print("Name from JSON: ", obj.name); // TejX
}`}
            />
          </section>

          <section
            id="stdlib-example"
            className="mt-8 pt-8 border-t border-white/5"
          >
            <h3 className="text-xl font-bold mb-4 text-green-400">
              <Zap size={18} className="inline mr-2" />
              Complete Example
            </h3>
            <CodeBlock
              filename="system_pro.tx"
              runCommand="tejx run system_pro.tx"
              code={`import fs from "std:fs";
import { stringify } from "std:json";
import time from "std:time";

function main() {
    let session = {
        ts: time.now(),
        event: "DOCS_VIEW"
    };

    let logLine = stringify(session);
    print("Logging: ", logLine);

    try {
        fs.writeFileSync("session.log", logLine);
        print("Successfully logged to disk.");
    } catch(e) {
        print("IO Error: ", e);
    }
}`}
            />
          </section>
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
          md:sticky md:top-24 md:block md:w-72 md:shrink-0 
          md:h-[calc(100vh-6rem)] md:overflow-y-auto custom-scrollbar
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        >
          <div className="p-8 md:p-0 md:pb-24">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
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
