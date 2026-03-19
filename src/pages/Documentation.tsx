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
              leveraging LLVM, TejX compiles ahead of time to optimized native
              code with static module resolution, explicit
              <code className="text-purple-400"> Optional&lt;T&gt;</code>, and a
              runtime built around moving GC plus explicit root tracking.
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
                title: "GC-Aware Safety",
                desc: "A moving collector, explicit roots, and strict source-level typing keep nullable and runtime-managed values predictable.",
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
                        Null-like ambiguity and hidden runtime behavior
                      </td>
                      <td className="p-3">
                        Moving GC with explicit roots and typed optionals
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
                  title: "Explicit Nullability",
                  content:
                    "TejX uses Optional<T> as the only nullable source-level type. There is no loose null/undefined union model.",
                },
                {
                  title: "Exhaustive Safety",
                  content:
                    "Argument counts, return types, object shapes, and optional narrowing are checked before code generation.",
                },
                {
                  title: "Zero-Cost Abstractions",
                  content:
                    "Generics, fixed-size arrays, and standard-library helpers are lowered ahead of time instead of loaded dynamically at runtime.",
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
        { id: "nullability", title: "Nullability" },
        { id: "strings", title: "String Manipulation" },
        { id: "operators", title: "Operators" },
        { id: "control-flow", title: "Control Flow" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            Language Basics
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            TejX is strict by default: static types, explicit nullability, no
            truthy or falsy coercion, and compile-time checked control flow.
          </p>

          <section id="variables" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Variable Scoping</h3>
            <p className="text-gray-400 mb-4">
              TejX uses lexical scoping with explicit mutability. Use{" "}
              <code className="text-purple-400">let</code> for mutable
              bindings and <code className="text-purple-400">const</code> for
              immutable ones.
            </p>
            <CodeBlock
              filename="scoping.tx"
              code={`function main() {
    let count: int = 10;
    const LIMIT: int = 20;

    {
        let count: int = 30;
        print(count);
    }

    print(count);
    // LIMIT = 30; // Compile error
}`}
            />
          </section>

          <section id="primitives" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Native Primitives</h3>
            <p className="text-gray-400 mb-4">
              Unlike JavaScript&apos;s single <code>number</code> model, TejX
              exposes source-level numeric and scalar types directly.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                { type: "int / int32", desc: "Standard 32-bit integer" },
                { type: "int16", desc: "16-bit signed integer" },
                { type: "int64", desc: "64-bit wide integer" },
                { type: "int128", desc: "128-bit signed integer" },
                { type: "float / float32", desc: "Single-precision decimal" },
                { type: "float16", desc: "16-bit floating point" },
                { type: "float64", desc: "Double-precision decimal" },
                { type: "bool", desc: "Strict boolean (true/false)" },
                { type: "char", desc: "Single character value" },
                { type: "string", desc: "UTF-8 encoded sequence of chars" },
                { type: "any", desc: "Dynamic escape hatch" },
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
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <code className="text-purple-400">bool</code> is the valid
                boolean type name. <code>boolean</code> is not valid TejX
                syntax.
              </li>
              <li>
                <code className="text-purple-400">int</code> is an alias for{" "}
                <code>int32</code>, and <code>float</code> is an alias for{" "}
                <code>float32</code>.
              </li>
            </ul>
          </section>

          <section id="nullability" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Nullability</h3>
            <p className="text-gray-400 mb-4">
              <code className="text-purple-400">Optional&lt;T&gt;</code> is the
              only nullable source-level type. There is no
              <code className="text-purple-400"> T | None</code> union syntax
              and no separate <code>undefined</code> model.
            </p>
            <CodeBlock
              filename="optional.tx"
              code={`function getUserName(id: int): Optional<string> {
    if (id == 1) return "Alice";
    return None;
}

function main() {
    let user: Optional<string> = getUserName(2);
    let fallback: Optional<int>;

    if (user != None) {
        print("Length: ", user.length());
    }

    print(user?.length());
    print(fallback == None);
}`}
            />
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Optional declarations may be left uninitialized; they default to <code className="text-purple-400">None</code>.</li>
              <li>Non-optional typed declarations must be initialized at declaration time.</li>
            </ul>
          </section>

          <section id="operators" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Operators</h3>
            <p className="text-gray-400 mb-4">
              Arithmetic, comparison, and logical operators are fully typed.
              Runtime inspection is available through{" "}
              <code className="text-purple-400">typeof</code>.
            </p>
            <CodeBlock
              code={`function main() {
    let sum = 10 + 5;
    let diff = 10 - 5;
    let prod = 10 * 5;
    let quot = 10 / 2;
    let mod = 10 % 3;

    let x = 10;
    x += 5;
    x *= 2;

    let res = (x > 10) && (x < 100);
    let isValid = !res || true;

    if (typeof(x) == "int") {
        print("x is an integer");
    }
}`}
            />
          </section>

          <section id="strings" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">String Manipulation</h3>
            <p className="text-gray-400 mb-4">
              Strings are UTF-8 managed runtime values with familiar helper
              methods from the core library.
            </p>
            <CodeBlock
              filename="strings_demo.tx"
              code={`function main() {
    let s = "  TejX Systems Programming  ";

    print("Length: ", s.length());
    print("Char at 2: ", s[2]);
    print("Substring: ", s.substring(2, 6));
    print("Upper: ", s.toUpper());
    print("Lower: ", s.toLower());
    print("Trimmed: [", s.trim(), "]");
}`}
            />
          </section>

          <section id="control-flow">
            <h3 className="text-2xl font-bold mb-4">Control Flow</h3>
            <p className="text-gray-400 mb-4">
              Core flow control is intentionally small and explicit:{" "}
              <code className="text-purple-400">if</code>,{" "}
              <code className="text-purple-400">while</code>, C-style{" "}
              <code className="text-purple-400">for</code>, and{" "}
              <code className="text-purple-400">try/catch/finally</code>.
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
}`}
            />

            <h4 className="text-lg font-bold mb-2 text-purple-300">Loops</h4>
            <CodeBlock
              code={`function main() {
    for (let i = 0; i < 5; i++) {
        if (i == 2) continue;
        if (i == 4) break;
        print("i: ", i);
    }

    let j = 0;
    while (j < 3) {
        print("j: ", j);
        j++;
    }
}`}
            />
            <h4 className="text-lg font-bold mb-2 text-purple-300">
              Error Flow
            </h4>
            <CodeBlock
              code={`function risky(flag: bool): void {
    if (!flag) {
        throw "bad state";
    }
}

function main() {
    try {
        risky(false);
    } catch (err) {
        print(err);
    } finally {
        print("cleanup");
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
    let nickname: Optional<string>;
    let score = 95;

    print("Hello, ", name);
    print("Nickname set? ", nickname != None);

    if (score > 90) {
        print("Rank: S");
    } else {
        print("Rank: A");
    }

    for (let i = 3; i > 0; i--) {
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
        { id: "option-types", title: "Optional<T> & Narrowing" },
        { id: "structural-typing", title: "Structural Objects" },
        { id: "inference-generics", title: "Generics & Inference" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            Advanced Type System
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            TejX keeps the source type system explicit: strict object shapes,
            opt-in nullability, typed functions, and conservative inference.
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
              Optional&lt;T&gt; & Narrowing
            </h3>
            <p className="text-gray-400 mb-4">
              <code className="text-purple-400">Optional&lt;T&gt;</code> is the
              only nullable source-level type. To use an optional as a concrete
              value, first narrow it with an explicit{" "}
              <code className="text-purple-400">!= None</code> check or use
              optional chaining.
            </p>
            <CodeBlock
              filename="options.tx"
              code={`function findUser(id: int): Optional<string> {
    if (id == 1) return "Alice";
    return None;
}

function main() {
    let user: Optional<string> = findUser(2);

    if (user != None) {
        print("Found: ", user);
    }

    print(user?.length());
}`}
            />
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <code className="text-purple-400">Option&lt;T&gt;</code> is not
                the supported spelling. Use{" "}
                <code className="text-purple-400">Optional&lt;T&gt;</code>.
              </li>
              <li>
                Member access, indexing, and <code>instanceof</code> checks on
                optional values require narrowing first unless you use{" "}
                <code className="text-purple-400">?.</code>.
              </li>
            </ul>
          </section>

          <section id="structural-typing" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Structural Objects</h3>
            <p className="text-gray-400 mb-4">
              Structural object types are checked by shape. Extra unexpected
              properties are rejected, and object-typed variables must be
              initialized when declared.
            </p>
            <CodeBlock
              filename="structural.tx"
              code={`type Point = { x: int; y: int };

function main() {
    let p: Point = { x: 1, y: 2 };
    print(p.x, p.y);

    // let bad: Point = { x: 1, y: 2, z: 3 }; // Compile error
}`}
            />
          </section>

          <section id="inference-generics" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Generics & Inference</h3>
            <p className="text-gray-400 mb-4">
              Generic functions and classes are fully supported, but inference is
              intentionally conservative. Empty arrays still need a target type,
              and missing initializers do not imply optionality.
            </p>
            <CodeBlock
              filename="generics.tx"
              code={`function identity<T>(value: T): T {
    return value;
}

class Box<T> {
    value: T;
    constructor(value: T) {
        this.value = value;
    }
}

function main() {
    let n = identity(10);
    let name = identity("tejx");
    let box = new Box<int>(42);
    let xs: int[] = [];

    print(n, name, box.value, xs.length());
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
              code={`type User = { id: int; name: string };

function getUser(id: int): Optional<User> {
    if (id == 42) return { id: 42, name: "Douglas" };
    return None;
}

function main() {
    let user = getUser(42);

    if (user != None) {
        print("Found: ", user.name);
    } else {
        print("User not found");
    }

    print(user?.name);
}`}
            />
          </section>
        </>
      ),
    },
    {
      id: "functions",
      title: "Functions & Generics",
      icon: Zap,
      subsections: [
        { id: "func-basics", title: "Typed Functions" },
        { id: "func-signatures", title: "Function Types" },
        { id: "func-generics", title: "Generic Functions" },
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
            Functions are fully typed. Parameter counts, argument types, return
            types, and higher-order function signatures are validated at compile
            time.
          </p>
          <div className="mb-6">
            <CodeBlock
              filename="functions.tx"
              code={`// Named function with explicit return type
function add(a: int, b: int): int {
    return a + b;
}

// Higher-order function
function process(val: int, op: (n: int) => int): int {
    return op(val);
}

function main() {
    let square = (x: int) => x * x;
    print("Add: ", add(10, 20));
    print("Process: ", process(5, square));
}`}
            />
          </div>

          <section id="func-signatures" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Function Types</h3>
            <p className="text-gray-400 mb-4">
              Function values can be passed around just like other typed values.
              Use explicit function signatures for callbacks and model trailing
              optional parameters with{" "}
              <code className="text-purple-400">Optional&lt;T&gt;</code>.
            </p>
            <CodeBlock
              filename="callbacks.tx"
              code={`function runTwice(value: int, op: (n: int) => int): int {
    return op(op(value));
}

function main() {
    let increment = (n: int) => n + 1;
    print(runTwice(10, increment));
}`}
            />
          </section>

          <section id="func-generics" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Generic Functions</h3>
            <p className="text-gray-400 mb-4">
              Generic functions and generic classes follow the same syntax. The
              compiler tracks concrete instantiations during semantic analysis
              and lowering.
            </p>
            <CodeBlock
              filename="identity.tx"
              code={`function identity<T>(value: T): T {
    return value;
}

function main() {
    let n = identity(10);
    let s = identity("tejx");
    print(n, s);
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

function process<T>(value: T, op: (x: T) => T): T {
    return op(value);
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
            TejX supports strict array forms, structural objects, and generic
            collections in the standard library.
          </p>

          <section id="arrays" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Arrays</h3>
            <p className="text-gray-400 mb-4">
              Dynamic arrays and fixed-size arrays are distinct source-level
              types. Empty array literals need an explicit target type.
            </p>
            <CodeBlock
              code={`function main() {
    let numbers: int[] = [1, 2, 3];
    let board: int[4] = [];
    let names: string[] = [];

    let first = numbers[0];
    numbers[1] = 99;
    numbers.push(4);
    let last = numbers.pop();

    print(first);
    print(last);
    print(numbers.length());
    print(board[0]);
    print(names.length());
}`}
            />
          </section>

          <section id="structs-obj" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">
              Structural Objects
            </h3>
            <p className="text-gray-400 mb-4">
              Object literals are shape-checked against their declared types and
              work well for lightweight data records.
            </p>
            <CodeBlock
              code={`type User = { id: int; name: string };

function main() {
    let user: User = { id: 1, name: "TejX" };
    print("User: ", user.name);

    let users: User[] = [
        { id: 1, name: "A" },
        { id: 2, name: "B" }
    ];
    print("Users count: ", users.length());
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
    let s = new Stack<int>();
    s.push(10);
    s.push(20);
    print("Pop Stack: ", s.pop());

    let q = new Queue<string>();
    q.enqueue("Task 1");
    print("Dequeue: ", q.dequeue());

    let config = new Map<string, int>();
    config.set("port", 8080);
    config.set("timeout", 1000);
    print("Port: ", config.get("port"));
    print("Has timeout: ", config.has("timeout"));
    config.delete("timeout");
    print("Size: ", config.size());

    let unique = new Set<int>();
    unique.add(1);
    unique.add(1);
    print("Has 1: ", unique.has(1));
    unique.delete(1);
    print("Set Size: ", unique.size());
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
    let nums: int[] = [10, 20, 30];
    nums.push(40);
    print("Array len: ", nums.length());

    let s = new Stack<string>();
    s.push("First");
    s.push("Second");
    print("Pop Stack: ", s.pop());

    let scores = new Map<string, int>();
    scores.set("Alice", 100);
    print("Alice Score: ", scores.get("Alice"));
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
      subsections: [
        { id: "imports", title: "Import Forms" },
        { id: "resolution", title: "Resolution Rules" },
        { id: "core-imports", title: "Implicit Core Imports" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">Modules</h2>
          <p className="text-xl text-gray-400 mb-8">
            TejX uses a static, compile-time module system. Imports are
            resolved during lowering and merged into the active compilation unit
            before code generation.
          </p>

          <section id="imports" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Import Forms</h3>
            <p className="text-gray-400 mb-4">
              TejX supports relative imports, <code>std:</code> imports, named
              imports, aliases, and default exports. If a relative import omits
              <code className="text-purple-400">.tx</code>, the compiler adds
              it automatically.
            </p>
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
              code={`import mul, { add, PI } from "./math";
import { now } from "std:time";
import std:fs;

function main() {
    print(add(10, 20));
    print(mul(5, 5));
    print(now() > 0);
    print(fs.existsSync("main.tx"));
}`}
            />
          </section>

          <section id="resolution" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Resolution Rules</h3>
            <p className="text-gray-400 mb-4">
              Standard-library imports are resolved from the configured stdlib
              root in this order:
            </p>
            <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside mb-4">
              <li><code className="text-purple-400">--stdlib-path &lt;path&gt;</code></li>
              <li>local project <code className="text-purple-400">lib/</code></li>
              <li>installed SDK under <code className="text-purple-400">$HOME/.tejx/lib</code></li>
            </ol>
            <p className="text-gray-400 mb-4">
              Relative imports resolve from the importing file&apos;s directory.
              The compiler canonicalizes module paths and reports diagnostics
              against the original source file.
            </p>
          </section>

          <section id="core-imports" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Implicit Core Imports</h3>
            <p className="text-gray-400 mb-4">
              Normal source files automatically receive core helpers before user
              imports are resolved. This is why common array and string helpers
              are available without manual imports.
            </p>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-sm text-gray-300 font-mono">
              <div>core/prelude.tx</div>
              <div>core/array.tx</div>
              <div>core/string.tx</div>
            </div>
            <p className="text-gray-400 mt-4">
              Circular dependencies are detected during module resolution, and a
              file is processed only once per canonical path.
            </p>
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
export function double(n: int): int { return n * 2; }

// --- file: modules_demo.tx ---
import { double } from "./math_utils";

function main() {
    print("Double 10: ", double(10));
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
      subsections: [
        { id: "memory-rules", title: "Runtime Value Model" },
        { id: "gc-model", title: "Garbage Collection" },
        { id: "root-tracking", title: "Root Tracking" },
      ],
      content: (
        <>
          <h2
            id="memory-rules"
            className="text-4xl font-black mb-6 tracking-tight"
          >
            Memory Model
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            The current TejX runtime uses a moving garbage collector with
            explicit root tracking. Older ownership-only notes have been
            replaced by this model.
          </p>
          <section className="mb-12">
            <p className="text-gray-300 mb-6 leading-relaxed">
              Runtime-managed values move through 64-bit slots. Heap-managed
              references are encoded as tagged handles, and{" "}
              <code className="text-purple-400">None</code> is represented as
              zero in nullable and dynamic contexts.
            </p>
            <div className="glass-card p-8 border-purple-500/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Shield size={120} />
              </div>
              <h4 className="text-xl font-bold mb-4">Heap Layout</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>Eden / young generation</li>
                <li>two survivor spaces</li>
                <li>old generation</li>
                <li>large object space</li>
              </ul>
            </div>
          </section>

          <section id="gc-model" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Garbage Collection</h3>
            <p className="text-gray-400 mb-4">
              Minor GC copies live young objects into survivor space and
              promotes long-lived values. Major GC marks, updates, compacts, and
              sweeps old-generation objects.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Old-to-young references are tracked with a card-table write barrier.</li>
              <li>Pointer arrays and non-pointer arrays are scanned differently for correctness and performance.</li>
              <li>Large objects bypass the normal young-generation path and move into LOS.</li>
            </ul>
          </section>

          <section id="root-tracking" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Root Tracking</h3>
            <p className="text-gray-400 mb-4">
              Because the collector moves objects, the runtime relies on
              explicit roots instead of stack walking.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>thread-local shadow stacks</li>
              <li>static roots</li>
              <li>task queue entries</li>
              <li>global handles used by async runtime bridges</li>
            </ul>
            <p className="text-gray-400 mt-4">
              This is also how async work remains safe across collections:
              background operations keep stable handles, and resumed callbacks
              resolve the moved object through the handle table.
            </p>
          </section>

        </>
      ),
    },
    {
      id: "oop",
      title: "Classes & Interfaces",
      icon: Box,
      subsections: [
        { id: "oop-basics", title: "Classes & Inheritance" },
        { id: "protocols", title: "Interfaces" },
        { id: "extensions", title: "Runtime Checks" },
        { id: "access-control", title: "Structural vs Nominal" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            Classes & Interfaces
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            TejX supports both structural object types and nominal classes.
            Interfaces define method contracts, while runtime inspection uses
            <code className="text-purple-400"> typeof</code> and{" "}
            <code className="text-purple-400">instanceof</code>.
          </p>

          <section id="oop-basics" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Classes & Inheritance</h3>
            <p className="text-gray-400 mb-4">
              Classes are nominal runtime values and support inheritance.
            </p>
            <CodeBlock
              filename="oop.tx"
              code={`class Animal {
    speak(): string { return "noise"; }
}

class Dog extends Animal {
    speak(): string { return "bark"; }
}

function main() {
    let d = new Dog();
    print(d.speak());
}`}
            />
          </section>

          <section id="protocols" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Interfaces</h3>
            <p className="text-gray-400 mb-4">
              Interfaces define required method shapes and class contracts.
            </p>
            <CodeBlock
              filename="interfaces.tx"
              code={`interface Greeter {
    greet(name: string): string;
}

class Robot implements Greeter {
    greet(name: string): string {
        return "Hello, " + name;
    }
}

function welcome(item: Greeter): void {
    print(item.greet("TejX"));
}

function main() {
    let bot = new Robot();
    welcome(bot);
}`}
            />
          </section>

          <section id="extensions" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Runtime Checks</h3>
            <p className="text-gray-400 mb-4">
              <code className="text-purple-400">typeof(value)</code> returns
              the runtime type name, and <code>instanceof</code> checks class
              relationships. Narrow optionals before using{" "}
              <code>instanceof</code>.
            </p>
            <CodeBlock
              filename="runtime_checks.tx"
              code={`class Animal {}
class Dog extends Animal {}

function main() {
    let value: Optional<Animal> = new Dog();

    if (value != None && value instanceof Dog) {
        print("dog");
    }

    print(typeof(value));
}`}
            />
          </section>

          <section id="access-control" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Structural vs Nominal</h3>
            <p className="text-gray-400 mb-4">
              Structural objects are checked by shape, while classes are nominal
              entities with identity and methods.
            </p>
            <CodeBlock
              code={`type User = { id: int; name: string };

class Session {
    user: User;
    constructor(user: User) {
        this.user = user;
    }
}

function main() {
    let u: User = { id: 1, name: "A" };
    let s = new Session(u);
    print(s.user.name);
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
              code={`interface AreaShape {
    area(): float;
}

class Rect implements AreaShape {
    w: float;
    h: float;
    constructor(w: float, h: float) {
        this.w = w;
        this.h = h;
    }
    area(): float { return this.w * this.h; }
}

function main() {
    let r = new Rect(10.0, 5.0);
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
        { id: "async-await", title: "Async / Await" },
        { id: "threading", title: "Native Threads" },
        { id: "mutex", title: "Shared State & Coordination" },
      ],
      content: (
        <>
          <h2 className="text-4xl font-black mb-6 tracking-tight">
            Async & Concurrency
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            TejX supports two different concurrency models: async/await for
            latency-bound work and native OS threads for real parallel CPU work.
          </p>

          <section id="async-await" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Async / Await</h3>
            <p className="text-gray-400 mb-4">
              Async code runs through the TejX event loop. User callbacks resume
              on that loop, while background I/O completion is funneled back
              into the TejX task queue.
            </p>
            <CodeBlock
              filename="async.tx"
              code={`import { delay } from "std:time";

async function fetchData(id: int): Promise<string> {
    await delay(100);
    return "Data for ID: " + id;
}

async function main(): Promise<void> {
    let first = await fetchData(1);
    let second = await fetchData(2);
    let both = await Promise.all([fetchData(10), fetchData(20)]);

    print(first);
    print(second);
    print(both.length());
}`}
            />
            <ul className="space-y-2 text-sm text-gray-400 mt-4">
              <li>Use async for timers, networking, file I/O, and other latency-bound workflows.</li>
              <li>Avoid heavy CPU loops on the async event loop.</li>
            </ul>
          </section>

          <section id="threading" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Native Threads</h3>
            <p className="text-gray-400 mb-4">
              For CPU-bound work, use <code className="text-purple-400">std:thread</code>.
              This gives real parallel execution across cores.
            </p>
            <CodeBlock
              code={`import { Thread, Atomic } from "std:thread";

function worker(args: any[]): void {
    let result = args[0] as Atomic;
    result.store(42);
}

function main() {
    let result = new Atomic(0);
    let t = new Thread(worker, [result as any]);
    t.join();
    print(result.load());
}`}
            />
          </section>

          <section id="mutex" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">
              Shared State & Coordination
            </h3>
            <p className="text-gray-400 mb-4">
              Protect shared mutable state with <code>Mutex</code>, or use
              <code className="text-purple-400">Atomic</code>,{" "}
              <code className="text-purple-400">Condition</code>, and{" "}
              <code className="text-purple-400">SharedQueue&lt;T&gt;</code> when
              coordinating threaded workers.
            </p>
            <CodeBlock
              filename="mutex.tx"
              code={`import { Thread, Mutex, Atomic } from "std:thread";

function increment(args: any[]): void {
    let lock = args[0] as Mutex;
    let counter = args[1] as Atomic;

    for (let i = 0; i < 1000; i++) {
        lock.lock();
        let value = counter.load();
        counter.store(value + 1);
        lock.unlock();
    }
}

function main() {
    let lock = new Mutex();
    let counter = new Atomic(0);
    let args: any[] = [lock as any, counter as any];
    let t1 = new Thread(increment, args);
    let t2 = new Thread(increment, args);
    t1.join();
    t2.join();
    print(counter.load());
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
              code={`import { Thread, Mutex, Condition, SharedQueue, Atomic } from "std:thread";

function producer(args: any[]): void {
    let q = args[0] as SharedQueue<int>;
    let lock = args[1] as Mutex;
    let cond = args[2] as Condition;
    lock.lock();
    q.enqueue(21);
    q.enqueue(21);
    cond.notifyAll();
    lock.unlock();
}

function consumer(args: any[]): void {
    let q = args[0] as SharedQueue<int>;
    let lock = args[1] as Mutex;
    let cond = args[2] as Condition;
    let total = args[3] as Atomic;

    lock.lock();
    while (q.isEmpty()) {
        cond.wait(lock);
    }
    total.add(q.dequeue() as int);
    total.add(q.dequeue() as int);
    lock.unlock();
}

function main() {
    let q = new SharedQueue<int>();
    let lock = new Mutex();
    let cond = new Condition();
    let total = new Atomic(0);
    let shared: any[] = [q as any, lock as any, cond as any, total as any];

    let tp = new Thread(producer, shared);
    let tc = new Thread(consumer, shared);
    tp.join();
    tc.join();

    print(total.load());
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
            The standard library is split between implicit core helpers and
            opt-in <code className="text-purple-400">std:</code> modules such as
            file system, networking, JSON, time, collections, and threading.
          </p>

          <section id="fs" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">std:fs</h3>
            <p className="text-gray-400 mb-4">
              File-system helpers are exposed through the exported{" "}
              <code className="text-purple-400">fs</code> namespace.
            </p>
            <CodeBlock
              code={`import std:fs;

function main() {
    fs.writeFileSync("config.tx", "DEBUG=true");
    let content = fs.readFileSync("config.tx");
    print("Content: ", content);

    if (fs.existsSync(".")) {
        let files = fs.readdirSync(".");
        print(files.length());
    }
}`}
            />
          </section>

          <section id="net" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">std:net</h3>
            <p className="text-gray-400 mb-4">
              Networking exposes low-level TCP helpers and async/sync HTTP
              namespaces.
            </p>
            <CodeBlock
              code={`import { http, net } from "std:net";

async function main(): Promise<void> {
    let body = await http.get("https://example.com");
    print(body.length());

    let stream = net.connect("127.0.0.1:9000");
    if (stream != None) {
        stream.send("ping");
        net.close(stream);
    }
}`}
            />
          </section>

          <section id="json" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">std:json</h3>
            <p className="text-gray-400 mb-4">
              <code className="text-purple-400">parse</code> returns dynamic
              values, and <code className="text-purple-400">stringify</code>{" "}
              supports pretty-print spacing.
            </p>
            <CodeBlock
              code={`import { parse, stringify } from "std:json";

function main() {
    let data = { name: "TejX", fast: true };
    let jsonStr = stringify(data, 2);
    let obj = parse(jsonStr);

    print("Name from JSON: ", obj.name);
}`}
            />
          </section>

          <section id="time" className="mb-12">
            <h3 className="text-2xl font-bold mb-4">std:time</h3>
            <p className="text-gray-400 mb-4">
              Time helpers cover synchronous sleep, async delay, timer APIs, and
              a lightweight <code>Date</code> wrapper.
            </p>
            <CodeBlock
              code={`import { now, sleep, delay, Date } from "std:time";

async function main(): Promise<void> {
    print(now() > 0);
    sleep(10);
    await delay(10);

    let d = new Date();
    print(d.toISOString());
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
              code={`import std:fs;
import { stringify } from "std:json";
import { now } from "std:time";

function main() {
    let session = {
        ts: now(),
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
