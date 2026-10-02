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
    title: "Concurrency & Parallelism",
    icon: Activity,
    subsections: [
      { id: "virtual-threads", title: "Virtual Threads & Parallelism" },
      { id: "event-loop", title: "Event Loop & Timers" },
      { id: "threads", title: "Native OS Threads" },
      { id: "choosing-model", title: "Which Model to Use" },
    ],
    content: (
      <>
        <DocHeader
          title="Concurrency & Parallelism"
          description={
            <>
              TejX uses a true parallel Promise API powered by an M:N work-stealing scheduler for lightweight concurrency, alongside native <Inline>std:thread</Inline>s for heavy workloads.
            </>
          }
        />

        <DocBlock
          id="virtual-threads"
          title="Virtual Threads & Parallelism"
          description="TejX provides an M:N coroutine scheduler with lightweight virtual threads. Promises execute concurrently across all available CPU cores."
        >
          <CodeBlock
            filename="promises.tx"
            code={`import { sleep } from "std:time";

function heavyTask(id: int): int {
    sleep(500);
    return id * 10;
}

function main(): void {
    // Spawns a lightweight virtual thread
    let p = Promise.spawn(() => heavyTask(1));
    
    // Runs multiple tasks in true parallel
    let results = Promise.all([
        () => heavyTask(2),
        () => heavyTask(3)
    ]);

    print(results[0], results[1]);
}`}
            playgroundCode={`function heavyTask(id: int): int {
    return id * 10;
}

function main() {
    print(heavyTask(2), heavyTask(3));
}`}
          />
          <DocRuleList
            items={[
              "Promise.spawn() executes closures on a lightweight background virtual thread (~32KB stack).",
              "Promise.all() and Promise.settled() distribute tasks across all CPU cores for true parallelism.",
              "The runtime's M:N scheduler handles yielding and balancing tasks automatically."
            ]}
          />
        </DocBlock>

        <DocBlock
          id="event-loop"
          title="Event Loop & Timers"
          description="Timers are managed by a dedicated lock-free Min-Heap event loop thread."
        >
          <CodeBlock
            filename="timers.tx"
            code={`import {
    setTimeout,
    setInterval,
    clearInterval
} from "std:time";

function main(): void {
    let timerId = setTimeout(() => print("timeout fired"), 5);
    
    let ticks = 0;
    let intervalId = setInterval(() => {
        ticks++;
        print("tick", ticks);
        if (ticks > 2) clearInterval(intervalId);
    }, 5);
}`}
            playgroundCode={`function main() {
    print("timeout fired");
    print("tick", 1);
    print("tick", 2);
}`}
          />
          <DocTable
            headers={["API", "Typical use"]}
            rows={[
              [<Inline>Promise.spawn(fn)</Inline>, "Dispatch a background closure."],
              [<Inline>setTimeout(fn, ms)</Inline>, "Schedule one future callback."],
              [<Inline>setInterval(fn, ms)</Inline>, "Schedule repeated callbacks until cleared."],
              [<Inline>Promise.all([...])</Inline>, "Wait for multiple parallel results."],
            ]}
          />
        </DocBlock>

        <DocBlock
          id="threads"
          title="Native Threads"
          description="The std:thread module provides OS threads, thread-per-connection models for network servers (std:http), and synchronization primitives for parallel work."
        >
          <CodeBlock
            filename="threads.tx"
            code={`import {
    Mutex,
    Atomic,
    Condition,
    SharedQueue,
    spawn
} from "std:thread";

// Quick thread-per-connection scaling via spawn()
spawn(() => {
    print("Background worker on a dedicated OS thread");
});

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
              "Use virtual threads (Promise.spawn) for lightweight concurrent tasks; use native OS threads when explicit synchronization is required.",
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
          description="Virtual threads and native OS threads cover different execution patterns inside the language runtime."
        >
          <DocTable
            headers={["Use case", "Preferred model"]}
            rows={[
              ["Lightweight parallel tasks and network I/O", "Promises (Promise.spawn)"],
              ["True CPU parallelism across cores", "Promises (Promise.spawn)"],
              ["Low-level OS synchronization", "Native OS Threads (std:thread)"],
            ]}
          />
          <div className="mt-5">
            <DocCallout title="Decision rule">
              Virtual threads via Promises are extremely cheap and scheduled across all cores automatically via an M:N scheduler. Use them for almost everything. Only reach for Native OS Threads when you need explicit OS-level synchronization primitives like Mutexes or Condition variables.
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
              "Dynamic GC triggers at a flexible 60% heap threshold (bypassing old 512MB limits) with robust Out Of Memory (OOM) fatal protection.",
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
                  "Deferred task and timer callbacks waiting to resume are considered roots while they sit in the queue.",
                tone: "green",
              },
              {
                title: "Global handles",
                description:
                  "Background worker tasks store stable handle IDs so resumed tasks can resolve the moved object after collection.",
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
                ["Queued task/timer", "Preserves captured values until the callback resumes."],
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
      { id: "http", title: "std:http" },
      { id: "net", title: "std:net" },
      { id: "crypto", title: "std:crypto" },
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
              opt-in <Inline>std:</Inline> modules. Key modules include
              filesystem (<Inline>std:fs</Inline>), HTTP server & client (<Inline>std:http</Inline>),
              TCP networking (<Inline>std:net</Inline>), cryptography (<Inline>std:crypto</Inline>),
              JSON (<Inline>std:json</Inline>), timing (<Inline>std:time</Inline>),
              system utilities (<Inline>std:system</Inline>), and math (<Inline>std:math</Inline>).
            </>
          }
        />

        <DocBlock
          id="fs"
          title="std:fs"
          description="File-system helpers are imported as named functions directly from the std:fs module or accessed via the fs namespace."
        >
          <CodeBlock
            filename="fs.tx"
            code={`import {
    readFile,
    writeFile,
    appendFile,
    exists,
    readdir,
    remove
} from "std:fs";

function main(): void {
    writeFile("config.txt", "PORT=8080\\n");
    appendFile("config.txt", "DEBUG=true\\n");

    let content = readFile("config.txt");
    print(content);

    if (exists(".")) {
        let entries = readdir(".");
        print("Total files:", entries.length());
    }
}`}
          />
          <DocRuleList
            items={[
              "Canonical helpers: readFile(path), writeFile(path, content), appendFile(path, content), exists(path), remove(path), mkdir(path), readdir(path).",
              "Also available via the export namespace fs: fs.readFile, fs.writeFile, etc.",
              "Directory reads return string arrays, so standard array operations apply immediately.",
              "The browser playground provides an in-memory virtual file system for safe client-side execution.",
            ]}
          />
          <div className="mt-5">
            <DocCallout title="Clean named imports">
              Use the <Inline>std:</Inline> prefix for standard-library modules
              and import the functions you need directly:{" "}
              <Inline>{'import { readFile, writeFile } from "std:fs";'}</Inline>.
            </DocCallout>
          </div>
        </DocBlock>

        <DocBlock
          id="http"
          title="std:http"
          description="High-performance HTTP server with route handlers and asynchronous fetch client."
        >
          <CodeBlock
            filename="http_server.tx"
            code={`import { HttpServer, ServerRequest, ServerResponse, fetch } from "std:http";

function main(): void {
    let app = new HttpServer();

    // Fast routing with typed Request and Response
    app.get("/", function(req: ServerRequest, res: ServerResponse): void {
        res.json({
            "status": "ok",
            "message": "Hello from TejX!"
        });
    });

    app.post("/api/echo", function(req: ServerRequest, res: ServerResponse): void {
        res.status(200).json({
            "received": req.body,
            "path": req.path
        });
    });

    app.listen(8080, () => {
        print("Server running at http://127.0.0.1:8080");
    });
}`}
            playgroundCode={`import { fetch } from "std:http";

function main(): void {
    print("HTTP client and server ready.");
}`}
          />
          <DocRuleList
            items={[
              "HttpServer provides expressive routing: app.get(path, handler), app.post(), app.put(), app.delete(), app.all().",
              "ServerRequest provides req.method, req.path, req.body, req.header(name).",
              "ServerResponse provides res.status(code), res.setHeader(k, v), res.json(data), res.send(text), res.html(str), res.end().",
              "fetch(url, options?) performs HTTP/HTTPS client requests returning typed Response objects.",
            ]}
          />
          <div className="mt-5">
            <DocCallout title="Concurrency Under Load" tone="green">
              TejX HTTP servers leverage lightweight virtual threads to handle thousands of requests per second concurrently without manual thread management.
            </DocCallout>
          </div>
        </DocBlock>

        <DocBlock
          id="net"
          title="std:net"
          description="Low-level TCP networking with stream sockets and listeners."
        >
          <CodeBlock
            filename="net.tx"
            code={`import { connect, listen, TcpListener, TcpStream } from "std:net";

function main(): void {
    // Start a raw TCP listener
    let server: TcpListener = listen("127.0.0.1:9000");

    // Connect as a client
    let client: Optional<TcpStream> = connect("127.0.0.1:9000");
    if (client != None) {
        let stream = client as TcpStream;
        stream.write("PING\\n");
        stream.close();
    }

    server.close();
}`}
          />
          <div className="mt-5">
            <DocCallout title="TCP Networking" tone="green">
              <Inline>std:net</Inline> provides direct access to TCP sockets (<Inline>TcpStream</Inline>) and listeners (<Inline>TcpListener</Inline>) for custom protocol development.
            </DocCallout>
          </div>
        </DocBlock>

        <DocBlock
          id="crypto"
          title="std:crypto"
          description="Cryptographic hash functions, HMAC authentication, random bytes, and UUIDs."
        >
          <CodeBlock
            filename="crypto.tx"
            code={`import {
    sha256,
    sha512,
    md5,
    hmacSha256,
    randomBytes,
    randomUUID
} from "std:crypto";

function main(): void {
    let hash = sha256("password123");
    print("SHA-256:", hash);

    let hmac = hmacSha256("payload", "secret-key");
    print("HMAC:", hmac);

    let id = randomUUID();
    print("UUID:", id);
}`}
          />
          <DocRuleList
            items={[
              "sha256(data) / sha512(data) / md5(data): Fast cryptographic hashing returning hex strings.",
              "hmacSha256(data, key): Message authentication code generation with a secret key.",
              "randomUUID(): Generates RFC 4122 v4 UUID strings.",
              "randomBytes(length): Cryptographically secure random byte sequences.",
            ]}
          />
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
          description="Time helpers cover synchronous sleep, timers, and a lightweight Date wrapper."
        >
          <CodeBlock
            filename="time.tx"
            code={`import {
    now,
    sleep,
    setTimeout,
    clearTimeout,
    Date
} from "std:time";

function main(): void {
    let timer = setTimeout(() => print("later"), 10);

    print(now() > 0);
    sleep(1);
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
              "Use `now()` to get the current timestamp in milliseconds.",
              "Use `sleep` to pause the current thread.",
              "Timer IDs from `setTimeout` and `setInterval` can be canceled explicitly with `clearTimeout` / `clearInterval`.",
            ]}
          />
        </DocBlock>

        <DocBlock
          id="system-math"
          title="std:system & std:math"
          description="Process arguments, environment values, system metadata, exits, and common math utilities."
        >
          <CodeBlock
            filename="system_math.tx"
            code={`import { args, env, getenv, cpus, platform, arch, cwd, uptime } from "std:system";
import { sqrt, pow, random, round, abs } from "std:math";

function main() {
    let argv = args();
    print("Arguments count:", argv.length());
    print("Platform:", platform(), "CPUs:", cpus(), "Arch:", arch());

    let home = getenv("HOME");
    print("Home:", home);

    print(sqrt(81.0));
    print(pow(2.0, 10.0));
    print(round(random() * 10.0));
}`}
          />
          <DocTable
            headers={["Module", "Examples"]}
            rows={[
              [<Inline>std:system</Inline>, "args(), env(), getenv(key), setenv(k,v), cwd(), exit(code), exec(cmd), pid(), cpus(), platform(), arch(), uptime()"],
              [<Inline>std:math</Inline>, "abs, min, max, sin, cos, sqrt, floor, ceil, round, pow, random, randomInt"],
            ]}
          />
          <DocRuleList
            items={[
              "std:system exports exit(code), env(), getenv(key), setenv(key, val), cwd(), args(), cpus(), platform(), arch(), uptime(), exec(command).",
              "std:math exports abs, min, max, sin, cos, sqrt, floor, ceil, round, pow, and random.",
              "Collections and threading modules are covered in the data-structures and concurrency sections because they are large enough to deserve dedicated treatment.",
            ]}
          />
        </DocBlock>
      </>
    ),
  },
];
