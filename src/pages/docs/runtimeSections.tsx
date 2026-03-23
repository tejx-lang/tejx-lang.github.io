import { Activity, Layers, Server } from "lucide-react";
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

export const runtimeSections: DocSection[] = [
  {
    id: "async",
    title: "Async & Concurrency",
    icon: Activity,
    subsections: [
      { id: "async-await", title: "Async / Await" },
      { id: "event-loop", title: "Event Loop Model" },
      { id: "timers-promises", title: "Timers & Promise.all" },
      { id: "threads", title: "Native Threads" },
      { id: "choosing-model", title: "Which Model to Use" },
    ],
    content: (
      <>
        <DocHeader
          title="Async & Concurrency"
          description={
            <>
              TejX includes async/await for event-loop workflows and{" "}
              <Inline>std:thread</Inline> for native threaded execution.
            </>
          }
        />

        <DocBlock
          id="async-await"
          title="Async / Await"
          description="Async functions return Promise<T> and support timers, networking, file I/O, and non-blocking workflows."
        >
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

    print(first);
    print(second);
}`}
            playgroundCode={`function fetchData(id: int): string {
    return "Data for ID: " + id;
}

function main() {
    let first = fetchData(1);
    let second = fetchData(2);

    print(first);
    print(second);
}`}
          />
          <DocRuleList
            items={[
              "Async functions return `Promise<T>` and can be awaited only from other async functions.",
              "Await suspends the current TejX task without blocking the runtime event loop.",
              "The runtime preserves managed values that survive across an await boundary with GC-safe handles.",
            ]}
          />
        </DocBlock>

        <DocBlock
          id="event-loop"
          title="Event Loop Model"
          description="Async user callbacks resume on the TejX event loop even when background work is driven by runtime services."
        >
          <DocFeatureGrid
            items={[
              {
                title: "Task queue",
                description:
                  "Pending TejX callbacks are stored in a runtime queue and executed on the event-loop thread.",
                tone: "purple",
              },
              {
                title: "Async operation tracking",
                description:
                  "The runtime counts in-flight async work so it knows when the loop can shut down cleanly.",
                tone: "blue",
              },
              {
                title: "Tokio bridge",
                description:
                  "Background async polling is delegated to a Tokio runtime, then results are funneled back into TejX tasks.",
                tone: "green",
              },
              {
                title: "GC-safe handles",
                description:
                  "Managed values that outlive a task turn are protected through global handles so moving GC can update them safely.",
                tone: "amber",
              },
            ]}
          />
        </DocBlock>

        <DocBlock
          id="timers-promises"
          title="Timers & Promise.all"
          description="The time module provides timer APIs, and Promise.all is available for waiting on multiple promises together."
        >
          <CodeBlock
            filename="timers_promises.tx"
            code={`import {
    delay,
    setTimeout,
    setInterval,
    clearInterval
} from "std:time";

async function compute(x: int): Promise<int> {
    await delay(10);
    return x * 2;
}

async function main(): Promise<void> {
    let timerId = setTimeout(() => print("timeout fired"), 5);
    let ticks = 0;
    let intervalId = setInterval(() => {
        ticks++;
        print("tick", ticks);
    }, 5);

    let results = await Promise.all([
        compute(10),
        compute(20)
    ]);

    clearInterval(intervalId);
    print(timerId, results[0], results[1]);
}`}
            playgroundCode={`function compute(x: int): int {
    return x * 2;
}

function main() {
    print("timeout fired");
    print("tick", 1);
    print("tick", 2);
    print(1, compute(10), compute(20));
}`}
          />
          <DocTable
            headers={["API", "Typical use"]}
            rows={[
              [<Inline>delay(ms)</Inline>, "Pause inside async code without blocking the event loop."],
              [<Inline>setTimeout(fn, ms)</Inline>, "Schedule one future callback."],
              [<Inline>setInterval(fn, ms)</Inline>, "Schedule repeated callbacks until cleared."],
              [<Inline>Promise.all([...])</Inline>, "Wait for multiple async results together."],
            ]}
          />
        </DocBlock>

        <DocBlock
          id="threads"
          title="Native Threads"
          description="The std:thread module provides threads and synchronization primitives for parallel work."
        >
          <CodeBlock
            filename="threads.tx"
            code={`import {
    Thread,
    Mutex,
    Atomic,
    Condition,
    SharedQueue
} from "std:thread";

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
            playgroundCode={`function producer(queue: int[]): void {
    queue.push(21);
    queue.push(21);
}

function consume(queue: int[]): int {
    return queue[0] + queue[1];
}

function main() {
    let queue: int[] = [];
    producer(queue);
    print(consume(queue));
}`}
          />
          <DocRuleList
            items={[
              "Thread, Atomic, Mutex, Condition, and SharedQueue are the main synchronization primitives.",
              "Protect shared mutable state explicitly with Mutex, Atomic, Condition, or SharedQueue.",
              "Keep long CPU loops off the async event loop and move them into threads instead.",
            ]}
          />
          <div className="mt-5">
            <DocTable
              headers={["Primitive", "Role"]}
              rows={[
                [<Inline>Thread</Inline>, "Runs a function on an OS thread."],
                [<Inline>Mutex</Inline>, "Protects shared mutable state."],
                [<Inline>Atomic</Inline>, "Handles lock-free numeric coordination."],
                [<Inline>Condition</Inline>, "Lets threads wait and notify around shared state."],
                [<Inline>SharedQueue</Inline>, "Provides a queue-like synchronization channel."],
              ]}
            />
          </div>
        </DocBlock>

        <DocBlock
          id="choosing-model"
          title="Which Model to Use"
          description="Async and threads cover different execution patterns inside the language runtime."
        >
          <DocTable
            headers={["Use case", "Preferred model"]}
            rows={[
              ["Timers, sockets, HTTP, non-blocking workflows", "async / await"],
              ["True CPU parallelism across cores", "std:thread"],
              ["Code that must not block the event loop", "std:thread"],
              ["Sequential-looking I/O orchestration", "async / await"],
            ]}
          />
          <div className="mt-5">
            <DocCallout title="Decision rule">
              If the work is mostly waiting on external services, stay in
              async. If the work burns CPU or would stall the event loop, move
              it into threads and synchronize explicitly.
            </DocCallout>
          </div>
        </DocBlock>
      </>
    ),
  },
  {
    id: "memory",
    title: "Memory Model",
    icon: Layers,
    subsections: [
      { id: "runtime-model", title: "Runtime Value Model" },
      { id: "heap-layout", title: "Heap Layout" },
      { id: "gc-model", title: "Garbage Collection" },
      { id: "roots-async", title: "Roots & Async Safety" },
    ],
    content: (
      <>
        <DocHeader
          title="Memory Model"
          description={
            <>
              TejX uses a moving garbage-collected runtime with explicit root
              tracking throughout the compiler and runtime.
            </>
          }
        />

        <DocBlock
          id="runtime-model"
          title="Runtime Value Model"
          description="The compiler and runtime move many values through 64-bit slots and use tagged references for managed objects."
        >
          <DocFeatureGrid
            items={[
              {
                title: "64-bit runtime slots",
                description:
                  "Generic and dynamic containers frequently store values in i64-sized slots even when source code started as a more specific type.",
                tone: "purple",
              },
              {
                title: "Tagged managed references",
                description:
                  "Heap-managed references are encoded as tagged integer-like handles so runtime services can distinguish them from immediates.",
                tone: "blue",
              },
              {
                title: "Heap vs stack offsets",
                description:
                  "The runtime uses offset markers to distinguish heap-managed object bodies from stack-resident fast paths.",
                tone: "green",
              },
              {
                title: "Optional<T> runtime shape",
                description:
                  "At runtime, None is represented as zero in nullable and dynamic contexts, which keeps optional checks efficient.",
                tone: "amber",
              },
            ]}
          />
          <div className="mt-5">
            <DocRuleList
              items={[
                "Primitive immediates and managed references share the same broad runtime slot model.",
                "Dynamic features such as `any`, arrays, objects, and generic containers all rely on these runtime encodings.",
                "The runtime type tag is what powers operations such as `typeof`, array checks, and dynamic formatting.",
              ]}
            />
          </div>
        </DocBlock>

        <DocBlock
          id="heap-layout"
          title="Heap Layout"
          description="The collector is generational and separates short-lived, long-lived, and oversized allocations."
        >
          <DocTable
            headers={["Region", "Purpose"]}
            rows={[
              ["Eden / young generation", "Fresh allocations for common short-lived objects"],
              ["Survivor spaces", "Copy targets for live young objects that survive minor collections"],
              ["Old generation", "Longer-lived objects managed by major mark/compact collection"],
              ["Large object space (LOS)", "Oversized allocations that bypass the normal young-generation path"],
            ]}
          />
          <div className="mt-5">
            <DocCallout title="Managed object header">
              Managed objects begin with metadata for mark/forwarding state,
              runtime type ID, flags, length, capacity, and alignment padding.
              Arrays also record element-size and pointer-array metadata in the
              header flags.
            </DocCallout>
          </div>
        </DocBlock>

        <DocBlock
          id="gc-model"
          title="Garbage Collection"
          description="Minor and major collections use different strategies, and old-to-young references are tracked explicitly."
        >
          <DocRuleList
            items={[
              "Minor GC copies live young objects into survivor space and promotes values that survive enough cycles.",
              "Major GC clears marks, marks from roots, computes new addresses, updates pointers, compacts old generation, and sweeps large-object entries.",
              "Pointer arrays and non-pointer arrays are scanned differently for correctness and speed.",
              "A card-table write barrier tracks old-to-young references so minor GC cannot miss young objects reachable from the old generation.",
            ]}
          />
        </DocBlock>

        <DocBlock
          id="roots-async"
          title="Roots & Async Safety"
          description="Moving objects stay safe through explicit roots and runtime handle tracking."
        >
          <DocFeatureGrid
            items={[
              {
                title: "Thread-local shadow stacks",
                description:
                  "Managed values that are live in active execution frames are registered explicitly.",
                tone: "purple",
              },
              {
                title: "Static roots",
                description:
                  "Global runtime-managed values are kept visible to the collector across collections.",
                tone: "blue",
              },
              {
                title: "Task queue entries",
                description:
                  "Async callbacks waiting to resume are considered roots while they sit in the event loop queue.",
                tone: "green",
              },
              {
                title: "Global handles",
                description:
                  "Background async work stores stable handle IDs so resumed tasks can resolve the moved object after collection.",
                tone: "amber",
              },
            ]}
          />
          <div className="mt-5">
            <DocTable
              headers={["Root source", "Why it matters"]}
              rows={[
                ["Active stack frame", "Prevents locals still in use from being moved out from under running code."],
                ["Static/global root", "Keeps long-lived runtime values reachable across the whole program."],
                ["Queued async task", "Preserves captured values until the callback resumes."],
                ["Global handle table", "Lets background services refer back to moved managed objects safely."],
              ]}
            />
          </div>
        </DocBlock>
      </>
    ),
  },
  {
    id: "stdlib",
    title: "Standard Library",
    icon: Server,
    subsections: [
      { id: "fs", title: "std:fs" },
      { id: "net", title: "std:net" },
      { id: "json", title: "std:json" },
      { id: "time", title: "std:time" },
      { id: "system-math", title: "std:system & std:math" },
    ],
    content: (
      <>
        <DocHeader
          title="Standard Library"
          description={
            <>
              The standard library is split between implicit core helpers and
              opt-in <Inline>std:</Inline> modules. The most common modules
              cover files, networking, JSON, timing, threads, collections,
              environment access, and math utilities.
            </>
          }
        />

        <DocBlock
          id="fs"
          title="std:fs"
          description="File-system helpers are imported as named functions from the std:fs module."
        >
            <CodeBlock
              filename="fs.tx"
              code={`import {
    appendFileSync,
    existsSync,
    readFileSync,
    readdirSync,
    writeFileSync
} from "std:fs";

function main() {
    writeFileSync("config.tx", "DEBUG=true");
    appendFileSync("config.tx", "\\nPORT=8080");

    let content = readFileSync("config.tx");
    print(content);

    if (existsSync(".")) {
        let files = readdirSync(".");
        print(files.length());
    }
}`}
            />
          <DocRuleList
            items={[
              "Use sync file helpers for straightforward scripts and startup/config loading.",
              "Directory reads return string arrays, so standard array operations apply immediately.",
              "The browser playground provides a virtual in-memory file system for std:fs examples rather than your real disk.",
            ]}
          />
          <div className="mt-5">
            <DocCallout title="Use named std imports">
              Use the <Inline>std:</Inline> prefix for standard-library modules
              and import the functions you need directly, for example{" "}
              <Inline>{'import { readFileSync } from "std:fs";'}</Inline>.
            </DocCallout>
          </div>
        </DocBlock>

        <DocBlock
          id="net"
          title="std:net"
          description="Networking exposes low-level TCP helpers plus sync and async HTTP namespaces."
        >
          <CodeBlock
            filename="net.tx"
            code={`import { http, net } from "std:net";

async function main(): Promise<void> {
    let body = await http.get("https://example.com");
    print(body.length());

    let stream = net.connect("127.0.0.1:9000");
    if (stream != None) {
        stream.send("ping");
        print(stream.receive(128));
        stream.close();
    }
}`}
            playgroundCode={`function fakeGet(_url: string): string {
    return "example response";
}

function main() {
    let body = fakeGet("https://example.com");
    print(body.length());
    print("pong");
}`}
          />
          <div className="mt-5">
            <DocCallout title="Two network layers" tone="green">
              <Inline>http</Inline> covers request/response workflows, while{" "}
              <Inline>net</Inline> gives you lower-level stream-style TCP
              access when you need custom protocols.
            </DocCallout>
          </div>
        </DocBlock>

        <DocBlock
          id="json"
          title="std:json"
          description="JSON serialization supports pretty-print spacing, custom toJSON hooks, array/object traversal, and dynamic parsing."
        >
          <CodeBlock
            filename="json.tx"
            code={`import { parse, stringify } from "std:json";

function main() {
    let payload = {
        name: "TejX",
        fast: true,
        tags: ["native", "typed"],
        meta: { version: 1 }
    };

    let jsonStr = stringify(payload, 2);
    let obj: any = parse(jsonStr);

    print(jsonStr);
    print(obj.name);
    print(obj.tags[1], obj.meta.version);
}`}
            playgroundCode={`import { parse, stringify } from "std:json";

function main() {
    let value = 42;
    let jsonStr = stringify(value);
    let parsed: int = parse(jsonStr);

    print(jsonStr);
    print(parsed);
}`}
          />
          <DocRuleList
            items={[
              "Use `stringify(value, 2)` for readable pretty-printed output.",
              "Parsed JSON is usually handled as `any` first, then narrowed as your program inspects the shape.",
              "Object, array, string, numeric, boolean, and null-like values are all supported by the runtime JSON helpers.",
            ]}
          />
        </DocBlock>

        <DocBlock
          id="time"
          title="std:time"
          description="Time helpers cover synchronous sleep, async delay, timers, and a lightweight Date wrapper."
        >
          <CodeBlock
            filename="time.tx"
            code={`import {
    now,
    sleep,
    delay,
    setTimeout,
    clearTimeout,
    Date
} from "std:time";

async function main(): Promise<void> {
    let timer = setTimeout(() => print("later"), 10);

    print(now() > 0);
    sleep(1);
    await delay(1);
    clearTimeout(timer);

    let d = new Date();
    print(d.toISOString());
}`}
            playgroundCode={`import { now, Date } from "std:time";

function main() {
    print(now() > 0);

    let d = new Date();
    print(d);
}`}
          />
          <DocRuleList
            items={[
              "Use `sleep` only when blocking the current thread is acceptable.",
              "Prefer `delay` in async code so the event loop can keep progressing.",
              "Timer IDs from `setTimeout` and `setInterval` can be canceled explicitly when work is no longer needed.",
            ]}
          />
        </DocBlock>

        <DocBlock
          id="system-math"
          title="std:system & std:math"
          description="Process arguments, environment values, exits, and common math utilities are split into focused modules."
        >
          <CodeBlock
            filename="system_math.tx"
            code={`import { args, env } from "std:system";
import { sqrt, pow, random, round } from "std:math";

function main() {
    let argv = args();
    let home = env("HOME");

    print(argv.length());
    print(home);
    print(sqrt(81.0));
    print(pow(2.0, 10.0));
    print(round(random() * 10.0));
}`}
          />
          <DocTable
            headers={["Module", "Examples"]}
            rows={[
              [<Inline>std:system</Inline>, "args(), argv(), env(key), getEnv(key), exit(code)"],
              [<Inline>std:math</Inline>, "abs, min, max, sin, cos, sqrt, floor, ceil, round, pow, random"],
            ]}
          />
          <DocRuleList
            items={[
              "std:system exports exit(code), env(key), args(), and aliases argv() / getEnv().",
              "std:math exports abs, min, max, sin, cos, sqrt, floor, ceil, round, pow, and random.",
              "Collections and threading modules are covered in the data-structures and concurrency sections because they are large enough to deserve dedicated treatment.",
            ]}
          />
        </DocBlock>
      </>
    ),
  },
];
