import {
  AlertTriangle,
  Book,
  Box,
  Code,
  Cpu,
  List,
  Package,
  Shield,
  Zap,
} from "lucide-react";
import GetStarted from "../GetStarted";
import CodeBlock from "../../components/CodeBlock";
import {
  DocBlock,
  DocCallout,
  DocFeatureGrid,
  DocHeader,
  DocRuleList,
  DocTable,
  Inline,
} from "./components";
import type { DocSection } from "./types";

export const languageSections: DocSection[] = [
  {
    id: "intro",
    title: "Overview",
    icon: Book,
    subsections: [
      { id: "overview", title: "Language Model" },
      { id: "hybrid", title: "Core Areas" },
      { id: "principles", title: "Source-Level Guarantees" },
    ],
    content: (
      <>
        <DocHeader
          title="Overview & Execution Model"
          description={
            <>
              TejX is a statically typed language that compiles ahead of time to
              native code through LLVM. TejX uses explicit typing, static
              imports, <Inline>Optional&lt;T&gt;</Inline> for nullability, and a
              runtime built around moving GC plus explicit root tracking.
            </>
          }
        />

        <DocBlock id="overview" title="Language Model">
          <DocFeatureGrid
            items={[
              {
                title: "Ahead-of-time native compilation",
                description:
                  "Source is parsed, type-checked, lowered, optimized, and emitted as LLVM-backed native code for direct native execution.",
                tone: "purple",
              },
              {
                title: "Typed source rules",
                description:
                  "Nullability is explicit, boolean logic stays typed, and module loading remains static at compile time.",
                tone: "blue",
              },
              {
                title: "Managed runtime",
                description:
                  "TejX uses a moving collector, tagged runtime slots, and explicit roots for long-lived managed values.",
                tone: "green",
              },
              {
                title: "Two concurrency models",
                description:
                  "Async/await handles latency-bound workflows on the event loop, while std:thread exposes true OS threads for CPU-bound parallel work.",
                tone: "amber",
              },
            ]}
          />
        </DocBlock>

        <DocBlock
          id="hybrid"
          title="Core Areas"
          description="These areas shape how TejX source code, modules, memory, and concurrency behave."
        >
          <DocTable
            headers={["Concern", "TejX model"]}
            rows={[
              [
                "Nullability",
                <>
                  One source-level nullable form:{" "}
                  <Inline>Optional&lt;T&gt;</Inline>
                </>,
              ],
              [
                "Modules",
                "Static resolution during lowering with canonicalized paths",
              ],
              [
                "Memory",
                "Moving GC with explicit roots and async-safe handles",
              ],
              [
                "Concurrency",
                "Event-loop async plus native threads with synchronization primitives",
              ],
            ]}
          />
        </DocBlock>

        <DocBlock
          id="principles"
          title="Source-Level Guarantees"
          description="These rules shape declarations, imports, classes, and runtime-managed values across normal TejX programs."
        >
          <DocRuleList
            items={[
              <>
                <Inline>bool</Inline> is the language boolean type used in
                declarations, conditions, and function signatures.
              </>,
              <>
                <Inline>Optional&lt;T&gt;</Inline> is the source-level way to
                model values that may be absent.
              </>,
              <>
                Relative imports, <Inline>std:</Inline> imports, and core
                prelude injection are all resolved before the main type-checking
                pass.
              </>,
              <>
                Classes are nominal runtime values; structural objects are
                checked by shape and must match their declared fields.
              </>,
              <>
                Async code that survives across collections is protected through
                handles and explicit roots across runtime turns.
              </>,
            ]}
          />
        </DocBlock>
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
      { id: "variables", title: "Bindings & Scope" },
      { id: "primitives", title: "Primitive Types" },
      { id: "nullability", title: "Optional<T>" },
      { id: "destructuring", title: "Destructuring" },
      { id: "strings-operators", title: "Strings & Operators" },
      { id: "control-flow", title: "Control Flow" },
    ],
    content: (
      <>
        <DocHeader
          title="Language Basics"
          description={
            <>
              TejX is explicit in the places that usually become runtime bugs:
              binding mutability, primitive types, nullability, and control
              flow. The syntax stays small, but the compiler validates far more
              than a loose scripting language would.
            </>
          }
        />

        <DocBlock
          id="variables"
          title="Bindings & Scope"
          description={
            <>
              Use <Inline>let</Inline> for mutable bindings and{" "}
              <Inline>const</Inline> for immutable ones. Scope is lexical and
              block-based.
            </>
          }
        >
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
}`}
          />
          <DocRuleList
            items={[
              <>
                <Inline>let</Inline> permits rebinding; <Inline>const</Inline>{" "}
                locks the binding after initialization.
              </>,
              "Block scope is lexical, so inner bindings shadow outer ones without mutating them.",
              <>
                Typed non-optional bindings must be initialized when declared.
                The main exception is <Inline>Optional&lt;T&gt;</Inline>, which
                can begin as <Inline>None</Inline>.
              </>,
            ]}
          />
        </DocBlock>

        <DocBlock
          id="primitives"
          title="Primitive Types"
          description="TejX includes numeric and scalar primitives with explicit widths and source-level aliases."
        >
          <DocTable
            headers={["Type", "Meaning", "Notes"]}
            rows={[
              [
                <Inline>int / int32</Inline>,
                "32-bit signed integer",
                "int is an alias for int32",
              ],
              [
                <Inline>int16</Inline>,
                "16-bit signed integer",
                "Useful when ABI or compact storage matters",
              ],
              [
                <Inline>int64</Inline>,
                "64-bit signed integer",
                "Common for timestamps and runtime handles",
              ],
              [
                <Inline>int128</Inline>,
                "128-bit signed integer",
                "Available as a source-level primitive",
              ],
              [
                <Inline>float / float32</Inline>,
                "32-bit floating point",
                "float is an alias for float32",
              ],
              [
                <Inline>float16</Inline>,
                "16-bit floating point",
                "Supported as a primitive type",
              ],
              [
                <Inline>float64</Inline>,
                "64-bit floating point",
                "Double precision",
              ],
              [
                <Inline>bool</Inline>,
                "Boolean",
                "Used for conditions and logical expressions",
              ],
              [<Inline>char</Inline>, "Character value", "Single character"],
              [
                <Inline>string</Inline>,
                "Managed UTF-8 string",
                "Heap-managed runtime value",
              ],
              [
                <Inline>any</Inline>,
                "Dynamic escape hatch",
                "Bypasses many static guarantees",
              ],
            ]}
          />
          <div className="mt-5">
            <DocRuleList
              items={[
                "Integer and float widths are explicit, so ABI-sensitive code can choose the right storage form.",
                <>
                  Comparisons, equality, and logical operators always produce{" "}
                  <Inline>bool</Inline>.
                </>,
                <>
                  <Inline>typeof(value)</Inline> returns the runtime type name,
                  which is useful for debugging and dynamic paths.
                </>,
                <>
                  <Inline>any</Inline> exists for dynamic interop and runtime
                  probing, but it intentionally weakens compile-time checks.
                </>,
              ]}
            />
          </div>
          <div className="mt-5">
            <DocCallout title="Boolean rules" tone="amber" icon={Shield}>
              Conditions use typed boolean expressions, comparisons, and logical
              operators.
            </DocCallout>
          </div>
        </DocBlock>

        <DocBlock
          id="nullability"
          title="Optional<T>"
          description={
            <>
              <Inline>Optional&lt;T&gt;</Inline> is the only nullable
              source-level type. It defaults to <Inline>None</Inline> when
              declared without an initializer.
            </>
          }
        >
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
          <DocTable
            headers={["Pattern", "Meaning"]}
            rows={[
              [
                <Inline>let user: Optional&lt;string&gt;;</Inline>,
                <>
                  Declares an optional binding that starts as{" "}
                  <Inline>None</Inline>.
                </>,
              ],
              [
                <Inline>if (user != None)</Inline>,
                "Narrows the value before direct member access.",
              ],
              [
                <Inline>user?.length()</Inline>,
                "Safely attempts the call and returns None when the receiver is absent.",
              ],
            ]}
          />
          <div className="mt-5">
            <DocCallout title="Optional is explicit" tone="green" icon={Cpu}>
              TejX does not treat every reference as nullable by default. If a
              value may be absent, model that in the type with{" "}
              <Inline>Optional&lt;T&gt;</Inline> and narrow it deliberately.
            </DocCallout>
          </div>
          <div className="mt-5">
            <DocRuleList
              items={[
                <>
                  Use <Inline>Optional&lt;T&gt;</Inline> for values that may be
                  absent.
                </>,
                <>
                  Optional declarations can start without an initializer and
                  begin as <Inline>None</Inline>.
                </>,
                <>
                  Non-optional typed declarations must be initialized when
                  declared.
                </>,
                <>
                  Member access, indexing, and <Inline>instanceof</Inline> on
                  an optional value require narrowing first unless you use{" "}
                  <Inline>?.</Inline>.
                </>,
              ]}
            />
          </div>
        </DocBlock>

        <DocBlock
          id="destructuring"
          title="Destructuring"
          description="TejX supports array and object destructuring, including rest patterns, renaming, and nested extraction."
        >
          <CodeBlock
            filename="destructuring.tx"
            code={`function main() {
    let point = [100, 200];
    let [x, y] = point;

    let [head, ...tail] = [1, 2, 3, 4];

    let obj = { name: "TejX", age: 1 };
    let { name, age } = obj;

    let { name: label, age: years } = { name: "Antigravity", age: 5 };

    let userObj = { user: { profile: { firstName: "John" } } };
    let { user: { profile: { firstName } } } = userObj;

    print(x, y, head, tail.length(), name, age, label, years, firstName);
}`}
          />
          <DocRuleList
            items={[
              "Array destructuring follows positional order.",
              "Object destructuring matches property names and supports renaming with `field: localName` syntax.",
              "Nested patterns let you pull out deeply nested values without manual intermediate variables.",
              "Rest patterns are useful when you want a head/tail split while preserving the remaining values.",
            ]}
          />
        </DocBlock>

        <DocBlock
          id="strings-operators"
          title="Strings & Operators"
          description="String helpers come from the implicitly injected core library. Arithmetic, assignment, logical operators, and comparisons are all type-checked."
        >
          <CodeBlock
            filename="strings_and_ops.tx"
            code={`function main() {
    let s = "  TejX Systems Programming  ";
    let x = 10;
    let ratio: float = 5.5;
    let cleaned = s.trim().toUpperCase();

    print(s.length());
    print(cleaned);
    print(s.substring(2, 6));

    x += 5;
    x *= 2;

    let ok = (x > 10) && (x < 100);
    let negated = !ok;

    print(ok, negated);
    print(typeof(x), typeof(ratio));
}`}
          />
          <DocRuleList
            items={[
              "String helpers are available on managed strings and return new values rather than mutating in place.",
              "Compound assignment operators such as `+=` and `*=` keep the original variable type.",
              "Arithmetic, comparison, and logical expressions are all checked before code generation.",
            ]}
          />
        </DocBlock>

        <DocBlock
          id="control-flow"
          title="Control Flow"
          description="TejX keeps flow control intentionally small: if/else, while, C-style for, and try/catch/finally."
        >
          <CodeBlock
            filename="control_flow.tx"
            code={`function risky(flag: bool): void {
    if (!flag) {
        throw "bad state";
    }
}

function main() {
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

    try {
        risky(false);
    } catch (err) {
        print(err);
    } finally {
        print("cleanup");
    }
}`}
            playgroundCode={`function risky(flag: bool): void {
    if (!flag) {
        throw "bad state";
    }
}

function reportRisk(): void {
    try {
        risky(false);
    } catch (err) {
        print(err);
    } finally {
        print("cleanup");
    }
}

function main() {
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

    reportRisk();
}`}
          />
          <DocRuleList
            items={[
              "Conditions must be typed booleans; there is no loose truthiness model.",
              "Use `continue` and `break` inside loops exactly as in C-style control flow.",
              <>
                <Inline>finally</Inline> runs whether the protected block
                succeeds or throws, so it is the right place for cleanup.
              </>,
            ]}
          />
        </DocBlock>
      </>
    ),
  },
  {
    id: "advanced-types",
    title: "Type System",
    icon: Box,
    subsections: [
      { id: "aliases-composites", title: "Aliases & Composite Types" },
      { id: "arrays-objects", title: "Arrays & Object Shapes" },
      { id: "generics-constraints", title: "Generics & Constraints" },
      { id: "runtime-narrowing", title: "typeof / instanceof" },
      { id: "inference-any", title: "Inference & any" },
    ],
    content: (
      <>
        <DocHeader
          title="Type System"
          description={
            <>
              TejX keeps source types explicit: primitive widths, structural
              object shapes, nominal classes, function types, generics, and
              optional narrowing rules are all enforced before code generation.
            </>
          }
        />

        <DocBlock
          id="aliases-composites"
          title="Aliases & Composite Types"
          description="Type aliases are compile-time names with no runtime cost. Composite types include optionals, arrays, structural objects, classes, interfaces, and function signatures."
        >
          <CodeBlock
            filename="aliases.tx"
            code={`type ID = int;
type Point = { x: int; y: int };
type Handler = (msg: string) => void;

function process(id: ID, p: Point, handler: Handler): void {
    handler("Processing " + id + " at " + p.x + "," + p.y);
}

function main() {
    let p: Point = { x: 10, y: 20 };
    process(123, p, (msg: string) => print(msg));
}`}
          />
          <DocTable
            headers={["Form", "Example", "Role"]}
            rows={[
              [
                "Alias",
                <Inline>type ID = int;</Inline>,
                "Names a type without creating a runtime wrapper.",
              ],
              [
                "Structural object",
                <Inline>{"type Point = { x: int; y: int };"}</Inline>,
                "Captures a record-like shape checked by fields.",
              ],
              [
                "Function type",
                <Inline>type Handler = (msg: string) =&gt; void;</Inline>,
                "Describes callbacks and higher-order APIs.",
              ],
            ]}
          />
        </DocBlock>

        <DocBlock
          id="arrays-objects"
          title="Arrays & Object Shapes"
          description="Dynamic arrays and fixed-size arrays are distinct forms, and structural objects are checked strictly by declared shape."
        >
          <CodeBlock
            filename="arrays_and_objects.tx"
            code={`type Address = { city: string; zip: int };
type User = { id: int; name: string; address: Address };

function main() {
    let numbers: int[] = [1, 2, 3];
    let board: int[4] = [];
    let user: User = {
        id: 1,
        name: "TejX",
        address: { city: "Pune", zip: 411001 }
    };

    numbers.push(4);
    print(numbers[0], numbers[3], numbers.length());
    print(board[0]);
    print(user.name, user.address.city);
    print(Object.keys(user).length());
}`}
          />
          <DocTable
            headers={["Form", "Behavior"]}
            rows={[
              ["Dynamic array `T[]`", "Growable, supports push/pop and runtime length."],
              ["Fixed array `T[n]`", "Fixed-size shape at the type level with indexed access."],
              ["Structural object", "Must satisfy the declared field set and field types."],
            ]}
          />
          <DocRuleList
            items={[
              "Empty array literals need a target type.",
              "Fixed arrays and dynamic arrays are separate source-level forms.",
              "Object-typed variables must be initialized at declaration time.",
              "Object shapes are checked against the declared fields.",
            ]}
          />
        </DocBlock>

        <DocBlock
          id="generics-constraints"
          title="Generics & Constraints"
          description="Generic functions and classes are supported, and type parameters can be constrained against base classes."
        >
          <CodeBlock
            filename="generics_constraints.tx"
            code={`class Base {}
class Sub extends Base {}
class Other extends Base {}

class Box<T: Base> {
    val: T;

    constructor(v: T) {
        this.val = v;
    }

    get(): T {
        return this.val;
    }
}

function processNode<N: Base>(node: N): N {
    return node;
}

function main() {
    let sub = new Sub();
    let box = new Box<Sub>(sub);
    let out = processNode<Sub>(box.get());
    print(out instanceof Sub);
}`}
          />
          <DocRuleList
            items={[
              "Constraints like `T: Base` keep generic APIs open while still requiring a minimum contract.",
              "Explicit instantiation such as `new Box<Sub>(...)` and `processNode<Sub>(...)` is available when you want to show the concrete type.",
              "The return type remains the concrete instantiation, so `Box<Sub>.get()` still produces `Sub`.",
            ]}
          />
          <div className="mt-5">
            <DocCallout
              title="Generic inference is conservative"
              tone="green"
              icon={Cpu}
            >
              TejX tracks concrete instantiations during semantic analysis and
              lowering. Empty arrays benefit from explicit target types, and
              declaration shapes stay visible in the source.
            </DocCallout>
          </div>
        </DocBlock>

        <DocBlock
          id="runtime-narrowing"
          title="typeof / instanceof"
          description="Runtime inspection complements static typing for dynamic and nominal paths."
        >
          <CodeBlock
            filename="runtime_narrowing.tx"
            code={`class Animal {}
class Dog extends Animal {}

function main() {
    let value: Optional<Animal> = new Dog();
    let anything: any = 42;

    if (value != None && value instanceof Dog) {
        print("dog");
    }

    if (typeof(anything) == "int") {
        print("dynamic int");
    }
}`}
          />
          <DocTable
            headers={["Expression", "Common runtime result"]}
            rows={[
              [<Inline>typeof(42)</Inline>, <Inline>int</Inline>],
              [<Inline>typeof(5.5)</Inline>, <Inline>float</Inline>],
              [<Inline>typeof(true)</Inline>, <Inline>bool</Inline>],
              [<Inline>typeof("tejx")</Inline>, <Inline>string</Inline>],
              [<Inline>typeof(None)</Inline>, <Inline>None</Inline>],
              [<Inline>{"typeof([1, 2])"}</Inline>, <Inline>array</Inline>],
            ]}
          />
        </DocBlock>

        <DocBlock
          id="inference-any"
          title="Inference & any"
          description="TejX infers types from initializers while keeping array targets, nullable paths, and structural detail visible in the source."
        >
          <CodeBlock
            filename="inference_any.tx"
            code={`function main() {
    let count = 10;
    let title = "tejx";
    let tags = ["docs", "compiler"];
    let payload: any = { retries: 3, mode: "fast" };

    print(typeof(count), typeof(title), tags.length());
    print(typeof(payload), payload.retries, payload.mode);
}`}
          />
          <DocRuleList
            items={[
              <>
                <Inline>let n = 10</Inline> and{" "}
                <Inline>let name = "tejx"</Inline> infer concrete primitive
                types.
              </>,
              <>
                <Inline>let xs = [1, 2, 3]</Inline> infers an array element
                type, but <Inline>let xs = []</Inline> needs a target type such
                as <Inline>let xs: int[] = []</Inline>.
              </>,
              <>
                <Inline>any</Inline> is available for dynamic or runtime-heavy
                code paths, but it bypasses many static guarantees and should be
                contained.
              </>,
            ]}
          />
          <div className="mt-5">
            <DocCallout title="Prefer narrow boundaries" tone="amber" icon={Shield}>
              Keep <Inline>any</Inline> near interop boundaries, parsing
              layers, or highly dynamic containers. Narrow back to specific
              shapes quickly so the compiler can help again.
            </DocCallout>
          </div>
        </DocBlock>
      </>
    ),
  },
  {
    id: "functions",
    title: "Functions",
    icon: Zap,
    subsections: [
      { id: "typed-functions", title: "Typed Functions" },
      { id: "callbacks", title: "Callbacks & Lambdas" },
      { id: "generic-functions", title: "Generic Functions" },
      { id: "function-rules", title: "Function Rules" },
      { id: "entry-point", title: "Program Entry" },
    ],
    content: (
      <>
        <DocHeader
          title="Functions"
          description={
            <>
              Parameter counts, argument types, return types, and higher-order
              function signatures are checked at compile time. Lambdas, generic
              functions, and async functions all build on that same typed model.
            </>
          }
        />

        <DocBlock
          id="typed-functions"
          title="Typed Functions"
          description="Function declarations require explicit parameter types and typically explicit return types."
        >
          <CodeBlock
            filename="functions.tx"
            code={`function add(a: int, b: int): int {
    return a + b;
}

function square(n: int): int {
    return n * n;
}

function main() {
    print(add(10, 20));
    print(square(5));
}`}
          />
        </DocBlock>

        <DocBlock
          id="callbacks"
          title="Callbacks & Lambdas"
          description="Function types are first-class. Use explicit callback signatures when passing behavior around."
        >
          <CodeBlock
            filename="callbacks.tx"
            code={`function process(value: int, op: (n: int) => int): int {
    return op(value);
}

function runTwice(value: int, op: (n: int) => int): int {
    return op(op(value));
}

function main() {
    let increment = (n: int) => n + 1;
    let square = (n: int) => n * n;

    print(process(5, square));
    print(runTwice(10, increment));
}`}
          />
        </DocBlock>

        <DocBlock
          id="generic-functions"
          title="Generic Functions"
          description="Generic functions and classes share the same type-parameter syntax."
        >
          <CodeBlock
            filename="identity.tx"
            code={`function identity<T>(value: T): T {
    return value;
}

function apply<T>(value: T, op: (item: T) => T): T {
    return op(value);
}

function main() {
    let n = identity(10);
    let s = identity<string>("tejx");
    let doubled = apply<int>(21, (x: int) => x * 2);
    print(n, s, doubled);
}`}
          />
        </DocBlock>

        <DocBlock
          id="function-rules"
          title="Function Rules"
          description="These rules explain most function-related diagnostics."
        >
          <DocRuleList
            items={[
              "Argument count is checked statically.",
              "Argument types must match the declared signature.",
              "Return values must match the declared return type.",
              <>
                Trailing optional parameters are modeled with{" "}
                <Inline>Optional&lt;T&gt;</Inline>, not ad hoc undefined-style
                omission.
              </>,
              "Async functions return Promise<T> and are covered in the concurrency section.",
            ]}
          />
        </DocBlock>

        <DocBlock
          id="entry-point"
          title="Program Entry"
          description="Normal executables start at function main()."
        >
          <DocCallout title="Entry point requirement">
            Every standalone TejX program needs a{" "}
            <Inline>function main()</Inline> entry point. Async programs use{" "}
            <Inline>async function main(): Promise&lt;void&gt;</Inline>.
          </DocCallout>
        </DocBlock>
      </>
    ),
  },
  {
    id: "data-structures",
    title: "Data Structures",
    icon: List,
    subsections: [
      { id: "arrays", title: "Arrays" },
      { id: "records", title: "Structural Records" },
      { id: "collections", title: "Collections" },
      { id: "object-helpers", title: "Object Helpers" },
    ],
    content: (
      <>
        <DocHeader
          title="Data Structures"
          description={
            <>
              TejX gives you language-level arrays and structural records, then
              layers generic containers and helper utilities through the
              standard library.
            </>
          }
        />

        <DocBlock
          id="arrays"
          title="Arrays"
          description="Dynamic arrays support familiar push/pop operations, while fixed-size arrays are explicit and remain distinct at the type level."
        >
          <CodeBlock
            filename="arrays.tx"
            code={`function main() {
    let numbers: int[] = [1, 2, 3];
    let board: int[4] = [];

    numbers.push(4);
    let last = numbers.pop();

    print(numbers[0]);
    print(last);
    print(board[0]);
}`}
          />
          <DocRuleList
            items={[
              "Dynamic arrays expose methods such as `push`, `pop`, `sort`, and `join` through the core runtime.",
              "Fixed arrays keep their declared size in the type and are useful when the shape is known ahead of time.",
              "The element type remains visible to the compiler during indexing and assignment.",
            ]}
          />
        </DocBlock>

        <DocBlock
          id="records"
          title="Structural Records"
          description="Structural object types work well for lightweight records and nested configuration data."
        >
          <CodeBlock
            filename="records.tx"
            code={`type Server = {
    host: string;
    port: int;
};

function main() {
    let primary: Server = {
        host: "127.0.0.1",
        port: 8080
    };

    let secondary: Server = {
        host: "127.0.0.2",
        port: 8081
    };

    let cluster: Server[] = [primary, secondary];

    print(cluster[1].port);
}`}
          />
          <DocRuleList
            items={[
              "Structural records are checked by shape, not by a hidden nominal identity.",
              "Nested arrays and records compose naturally, which makes them useful for configuration and payload objects.",
              "Field presence matters: missing required fields are rejected at compile time.",
            ]}
          />
        </DocBlock>

        <DocBlock
          id="collections"
          title="Collections"
          description="The std:collections module includes both common containers and more specialized structures."
        >
          <CodeBlock
            filename="collections.tx"
            code={`import {
    Stack,
    Queue,
    Map,
    Set,
    MinHeap,
    OrderedMap,
    BloomFilter,
    Trie
} from "std:collections";

function main() {
    let stack = new Stack<int>();
    stack.push(10);
    stack.push(20);

    let queue = new Queue<string>();
    queue.enqueue("job");

    let scores = new Map<string, int>();
    scores.set("alice", 100);

    let seen = new Set<int>();
    seen.add(42);

    let heap = new MinHeap<int>();
    heap.insert(50);
    heap.insert(10);

    let ordered = new OrderedMap<string, int>();
    ordered.put("b", 2);
    ordered.put("a", 1);

    let bloom = new BloomFilter(100, 3);
    bloom.add("apple");

    let trie = new Trie();
    trie.addPath("hello", 1);

    print(stack.pop(), queue.dequeue(), scores.get("alice"));
    print(seen.has(42), heap.extractMin(), ordered.at("a"));
    print(bloom.contains("apple"), trie.find("hello"));
}`}
            playgroundCode={`import {
    Stack,
    Queue,
    Map,
    Set
} from "std:collections";

function main() {
    let stack = new Stack<int>();
    stack.push(10);
    stack.push(20);

    let queue = new Queue<string>();
    queue.enqueue("job");

    let scores = new Map<string, int>();
    scores.set("alice", 100);

    let seen = new Set<int>();
    seen.add(42);

    print(stack.pop(), queue.dequeue(), scores.get("alice"));
    print(seen.has(42), stack.size(), queue.size());
}`}
          />
          <DocFeatureGrid
            items={[
              {
                title: "Core containers",
                description:
                  "Stack<T>, Queue<T>, Map<K, V>, and Set<T> cover the common mutable collection needs.",
                tone: "purple",
              },
              {
                title: "Ordered variants",
                description:
                  "OrderedMap<K, V> and OrderedSet<T> preserve insertion order when that matters.",
                tone: "blue",
              },
              {
                title: "Heap-based queues",
                description:
                  "MinHeap<T>, MaxHeap<T>, and PriorityQueue<T> support extraction-oriented workflows.",
                tone: "green",
              },
              {
                title: "Specialized structures",
                description:
                  "BloomFilter and Trie are available for membership and prefix-oriented algorithms.",
                tone: "amber",
              },
            ]}
          />
        </DocBlock>

        <DocBlock
          id="object-helpers"
          title="Object Helpers"
          description="The core object helpers mirror the operations most people reach for when inspecting record-like data."
        >
          <CodeBlock
            filename="object_helpers.tx"
            code={`function main() {
    let obj = { a: 1, b: 2 };

    let keys = Object.keys(obj);
    let values = Object.values(obj);
    let entries = Object.entries(obj);

    values.sort();

    print(keys.length());
    print(values[0], values[1]);
    print(entries.length());
}`}
          />
        </DocBlock>
      </>
    ),
  },
  {
    id: "oop",
    title: "Classes & Interfaces",
    icon: Box,
    subsections: [
      { id: "classes-inheritance", title: "Classes & Inheritance" },
      { id: "access-static", title: "Access Control & Static Members" },
      { id: "interfaces-abstract", title: "Interfaces & Abstract Classes" },
      { id: "runtime-checks", title: "super / instanceof" },
    ],
    content: (
      <>
        <DocHeader
          title="Classes & Interfaces"
          description={
            <>
              Structural objects are great for plain data, but TejX also
              supports nominal classes, inheritance, interfaces, access
              modifiers, static members, abstract classes, and runtime class
              checks.
            </>
          }
        />

        <DocBlock
          id="classes-inheritance"
          title="Classes & Inheritance"
          description="Classes are nominal runtime values. Inheritance chains are respected by method lookup and instanceof checks."
        >
          <CodeBlock
            filename="classes.tx"
            code={`class Entity {
    id: int32;
    constructor(id: int32) {
        this.id = id;
    }
}

class Robot extends Entity {
    model: string;

    constructor(id: int32, model: string) {
        super(id);
        this.model = model;
    }

    identify(): string {
        return this.model;
    }
}

function main() {
    let r = new Robot(101, "T-800");
    print(r.id, r.identify());
}`}
          />
        </DocBlock>

        <DocBlock
          id="access-static"
          title="Access Control & Static Members"
          description="TejX supports public, private, and protected members as well as static fields and methods."
        >
          <CodeBlock
            filename="access_static.tx"
            code={`class BankAccount {
    private balance: int32 = 0;
    public owner: string;
    static bankName: string = "MyBank";

    constructor(owner: string, initialBalance: int32) {
        this.owner = owner;
        this.balance = initialBalance;
    }

    public deposit(amount: int32): void {
        this.balance += amount;
    }

    public getBalance(): int32 {
        return this.balance;
    }

    static getBankName(): string {
        return BankAccount.bankName;
    }
}

function main() {
    let acc = new BankAccount("Alice", 100);
    acc.deposit(50);
    print(BankAccount.getBankName(), acc.getBalance());
}`}
          />
        </DocBlock>

        <DocBlock
          id="interfaces-abstract"
          title="Interfaces & Abstract Classes"
          description="Interfaces define contracts, while abstract classes let you share structure and require implementations."
        >
          <CodeBlock
            filename="interfaces_abstract.tx"
            code={`interface Greeter {
    greet(name: string): string;
}

abstract class Shape {
    protected name: string;
    constructor() {
        this.name = "Unknown Shape";
    }
    abstract area(): int32;
}

class Circle extends Shape implements Greeter {
    private radius: int32;

    constructor(radius: int32) {
        super();
        this.name = "Circle";
        this.radius = radius;
    }

    area(): int32 {
        return 3 * this.radius * this.radius;
    }

    greet(name: string): string {
        return "Hello " + name;
    }
}

function main() {
    let c = new Circle(2);
    print(c.area(), c.greet("TejX"));
}`}
          />
        </DocBlock>

        <DocBlock
          id="runtime-checks"
          title="super / instanceof"
          description="super lets derived classes reuse base behavior, and instanceof checks inheritance relationships at runtime."
        >
          <CodeBlock
            filename="super_and_instanceof.tx"
            code={`class BaseSC {
    greet(name: string): string { return "Hello " + name + " from Base"; }
}

class DerivedSC extends BaseSC {
    greet(name: string): string {
        return super.greet(name) + " (and Derived)";
    }
}

class Animal {}
class Dog extends Animal {}

function main() {
    let d = new DerivedSC();
    let pet: Animal = new Dog();

    print(d.greet("Alice"));
    print(pet instanceof Dog);
    print(pet instanceof Animal);
}`}
          />
          <DocRuleList
            items={[
              "Use `super.method()` when derived behavior should extend rather than replace base behavior.",
              "`instanceof` follows the inheritance chain, so a derived instance also matches its base class.",
              "Structural records do not participate in `instanceof`; that operator is for nominal classes.",
            ]}
          />
          <div className="mt-5">
            <DocCallout title="Nominal vs structural">
              Structural object types are matched by shape. Classes are nominal
              entities with inheritance, identity, and runtime type checks.
            </DocCallout>
          </div>
        </DocBlock>
      </>
    ),
  },
  {
    id: "errors",
    title: "Error Handling",
    icon: AlertTriangle,
    subsections: [
      { id: "throwing", title: "Throw / Catch / Finally" },
      { id: "custom-errors", title: "Custom Error Types" },
    ],
    content: (
      <>
        <DocHeader
          title="Error Handling"
          description={
            <>
              TejX supports explicit exceptions with <Inline>throw</Inline>,{" "}
              <Inline>try</Inline>, <Inline>catch</Inline>, and{" "}
              <Inline>finally</Inline>. You can throw simple values or model
              richer failures with classes that extend <Inline>Error</Inline>.
            </>
          }
        />

        <DocBlock
          id="throwing"
          title="Throw / Catch / Finally"
          description="Use try/catch/finally when cleanup or controlled recovery matters."
        >
          <CodeBlock
            filename="try_catch.tx"
            code={`function divide(a: int, b: int): int {
    if (b == 0) {
        throw "Division by zero";
    }
    return a / b;
}

function main() {
    try {
        let result = divide(10, 0);
        print(result);
    } catch (e) {
        print("Error caught: ", e);
    } finally {
        print("Execution complete");
    }
}`}
          />
        </DocBlock>

        <DocBlock
          id="custom-errors"
          title="Custom Error Types"
          description="For typed exception flows, extend Error and add the fields you need."
        >
          <CodeBlock
            filename="custom_error.tx"
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
        if (e instanceof HttpError) {
            print(e.statusCode, e.getMessage());
        }
    }
}`}
          />
          <DocRuleList
            items={[
              "Extend `Error` when you want both a message and structured fields.",
              "Catch blocks can narrow with `instanceof` before reading custom members.",
              "Simple throw values are fine for lightweight failures, but classes work better for APIs and larger programs.",
            ]}
          />
        </DocBlock>
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
      { id: "exports-cycles", title: "Exports & Cycles" },
    ],
    content: (
      <>
        <DocHeader
          title="Modules"
          description={
            <>
              TejX uses a static compile-time module system. Imports are
              resolved during lowering, merged into the active compilation unit,
              and checked before code generation.
            </>
          }
        />

        <DocBlock
          id="imports"
          title="Import Forms"
          description="Relative imports, std imports, named imports, aliases, and default exports are all supported."
        >
          <CodeBlock
            filename="math.tx"
            code={`export function add(a: int, b: int): int {
    return a + b;
}

export const PI = 3.14;

export default function multiply(a: int, b: int): int {
    return a * b;
}`}
            playgroundCode={`function add(a: int, b: int): int {
    return a + b;
}

const PI = 3.14;

function multiply(a: int, b: int): int {
    return a * b;
}

function main() {
    print(add(10, 20));
    print(PI);
    print(multiply(5, 5));
}`}
          />
          <CodeBlock
            filename="main.tx"
            code={`import mul, { add, PI } from "./math.tx";
import { now } from "std:time";
import { existsSync } from "std:fs";

function main() {
    print(add(10, 20));
    print(mul(5, 5));
    print(PI);
    print(now() > 0);
    print(existsSync("main.tx"));
}`}
            playgroundCode={`import { existsSync, writeFileSync } from "std:fs";
import { now } from "std:time";

function add(a: int, b: int): int {
    return a + b;
}

const PI = 3.14;

function mul(a: int, b: int): int {
    return a * b;
}

function main() {
    writeFileSync("main.tx", "demo");

    print(add(10, 20));
    print(mul(5, 5));
    print(PI);
    print(now() > 0);
    print(existsSync("main.tx"));
}`}
          />
          <div className="mt-5">
            <DocCallout title="Correct std module paths">
              TejX standard-library modules use the <Inline>std:</Inline>{" "}
              prefix. Import functions directly, for example{" "}
              <Inline>{'import { readFileSync } from "std:fs";'}</Inline>.
            </DocCallout>
          </div>
        </DocBlock>

        <DocBlock
          id="resolution"
          title="Resolution Rules"
          description="Relative and std imports follow different resolution paths, but both are handled before semantic analysis runs on the merged program."
        >
          <DocTable
            headers={["Import kind", "Resolution behavior"]}
            rows={[
              [
                <>
                  <Inline>./local.tx</Inline> or <Inline>../shared.tx</Inline>
                </>,
                "Resolved from the importing file's directory with the explicit .tx file path.",
              ],
              [
                <>
                  <Inline>std:time</Inline> or <Inline>std:collections</Inline>
                </>,
                <>
                  Resolved from the configured stdlib root in this order:{" "}
                  <Inline>--stdlib-path</Inline>, local project{" "}
                  <Inline>lib/</Inline>, then installed SDK library paths.
                </>,
              ],
            ]}
          />
        </DocBlock>

        <DocBlock
          id="core-imports"
          title="Implicit Core Imports"
          description="Normal source files receive core helpers automatically before user imports are resolved."
        >
          <DocFeatureGrid
            items={[
              {
                title: <Inline>core/prelude.tx</Inline>,
                description:
                  "Provides core runtime-facing helpers, Promise support, Error, print, and other language-level utilities.",
                tone: "purple",
              },
              {
                title: <Inline>core/array.tx</Inline>,
                description:
                  "Injects the common array helpers used by normal source files.",
                tone: "blue",
              },
              {
                title: <Inline>core/string.tx</Inline>,
                description:
                  "Injects the common string helpers used without explicit imports.",
                tone: "green",
              },
            ]}
          />
          <div className="mt-5">
            <DocCallout title="Why core helpers seem built in">
              This prelude injection happens automatically for normal modules,
              which is why common string and array helpers are available without
              manual imports.
            </DocCallout>
          </div>
        </DocBlock>

        <DocBlock
          id="exports-cycles"
          title="Exports & Cycles"
          description="Exports are explicit, and the resolver tracks active import chains during module resolution."
        >
          <DocRuleList
            items={[
              <>
                Use <Inline>export</Inline> to make functions, classes,
                constants, or types importable.
              </>,
              <>
                Default imports require a matching{" "}
                <Inline>export default</Inline>.
              </>,
              "Each imported file is processed once per canonical path within a compilation.",
              "If A imports B and B reaches back into A through the active stack, the compiler reports a circular dependency diagnostic.",
            ]}
          />
        </DocBlock>
      </>
    ),
  },
];
