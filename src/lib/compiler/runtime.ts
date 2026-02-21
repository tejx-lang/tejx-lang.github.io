/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * TejX Compiler Runtime and WAT Patches
 *
 * Provides the JavaScript runtime environment that bridges WASM-compiled
 * TejX code with browser APIs. Uses a Map-based heap with numeric keys
 * and a Proxy to auto-stub any missing imports.
 */

// ────────────────────────────────────────────
// WAT Patch Signatures (for missing-import injection)
// ────────────────────────────────────────────

export interface RuntimePatch {
  name: string;
  sig: string;
}

export const runtimePatches: RuntimePatch[] = [
  // Map
  { name: "rt_Map_new", sig: "(func $rt_Map_new (result i64))" },
  {
    name: "rt_Map_set",
    sig: "(func $rt_Map_set (param i64 i64 i64) (result i64))",
  },
  {
    name: "rt_Map_get",
    sig: "(func $rt_Map_get (param i64 i64) (result i64))",
  },
  {
    name: "rt_Map_has",
    sig: "(func $rt_Map_has (param i64 i64) (result i32))",
  },
  {
    name: "rt_Map_delete",
    sig: "(func $rt_Map_delete (param i64 i64) (result i32))",
  },
  { name: "rt_Map_size", sig: "(func $rt_Map_size (param i64) (result i32))" },
  // Conversion
  {
    name: "rt_to_string",
    sig: "(func $rt_to_string (param i64) (result i64))",
  },
  {
    name: "rt_to_number",
    sig: "(func $rt_to_number (param i64) (result f64))",
  },
  {
    name: "rt_to_boolean",
    sig: "(func $rt_to_boolean (param i64) (result i32))",
  },
  // Object/Map accessors
  { name: "m_get", sig: "(func $m_get (param i64 i64) (result i64))" },
  { name: "m_delete", sig: "(func $m_delete (param i64 i64) (result i32))" },
  // Array accessors
  { name: "a_get", sig: "(func $a_get (param i64 i64) (result i64))" },
  { name: "a_set", sig: "(func $a_set (param i64 i64 i64) (result i64))" },
  { name: "a_len", sig: "(func $a_len (param i64) (result i32))" },
  { name: "a_pop", sig: "(func $a_pop (param i64) (result i64))" },
  // String
  {
    name: "rt_str_concat",
    sig: "(func $rt_str_concat (param i64 i64) (result i64))",
  },
  {
    name: "rt_string_concat",
    sig: "(func $rt_string_concat (param i64 i64) (result i64))",
  },
  { name: "rt_concat", sig: "(func $rt_concat (param i64 i64) (result i64))" },
  { name: "rt_str_len", sig: "(func $rt_str_len (param i64) (result i32))" },
  { name: "rt_str_eq", sig: "(func $rt_str_eq (param i64 i64) (result i32))" },
  {
    name: "rt_str_cmp",
    sig: "(func $rt_str_cmp (param i64 i64) (result i32))",
  },
  {
    name: "rt_string_eq",
    sig: "(func $rt_string_eq (param i64 i64) (result i64))",
  },
  {
    name: "rt_string_length",
    sig: "(func $rt_string_length (param i64) (result i64))",
  },
  {
    name: "rt_string_from_int",
    sig: "(func $rt_string_from_int (param i64) (result i64))",
  },
  {
    name: "rt_string_from_float",
    sig: "(func $rt_string_from_float (param i64) (result i64))",
  },
  // Fast array ops
  {
    name: "rt_array_get_fast",
    sig: "(func $rt_array_get_fast (param i64 i64) (result i64))",
  },
  {
    name: "rt_array_set_fast",
    sig: "(func $rt_array_set_fast (param i64 i64 i64) (result i64))",
  },
  {
    name: "rt_array_length",
    sig: "(func $rt_array_length (param i64) (result i64))",
  },
  { name: "len", sig: "(func $len (param i64) (result i64))" },
  // Print ops
  { name: "rt_print_int", sig: "(func $rt_print_int (param i64))" },
  { name: "rt_print_float", sig: "(func $rt_print_float (param f64))" },
  { name: "rt_print_string", sig: "(func $rt_print_string (param i64))" },
  // Nullish / Truthy
  {
    name: "rt_is_nullish",
    sig: "(func $rt_is_nullish (param i64) (result i32))",
  },
  {
    name: "rt_is_truthy",
    sig: "(func $rt_is_truthy (param i64) (result i32))",
  },
  { name: "rt_box_null", sig: "(func $rt_box_null (result i64))" },
  // Exception Handling
  {
    name: "tejx_get_exception",
    sig: "(func $tejx_get_exception (result i64))",
  },
  { name: "tejx_push_handler", sig: "(func $tejx_push_handler (param i64))" },
  { name: "tejx_pop_handler", sig: "(func $tejx_pop_handler)" },
  { name: "tejx_throw", sig: "(func $tejx_throw (param i64))" },
  // Comparison / typeof
  { name: "rt_eq", sig: "(func $rt_eq (param i64 i64) (result i64))" },
  { name: "rt_ne", sig: "(func $rt_ne (param i64 i64) (result i64))" },
  { name: "rt_typeof", sig: "(func $rt_typeof (param i64) (result i64))" },
  // Math (legacy rt_ prefix)
  { name: "rt_min", sig: "(func $f_min (param i64 i64) (result i64))" },
  { name: "rt_max", sig: "(func $f_max (param i64 i64) (result i64))" },
  { name: "rt_abs", sig: "(func $f_abs (param i64) (result i64))" },
  { name: "rt_round", sig: "(func $f_round (param i64) (result i64))" },
  { name: "rt_floor", sig: "(func $f_floor (param i64) (result i64))" },
  { name: "rt_ceil", sig: "(func $f_ceil (param i64) (result i64))" },
  { name: "rt_pow", sig: "(func $f_pow (param i64 i64) (result i64))" },
  { name: "rt_sqrt", sig: "(func $f_sqrt (param i64) (result i64))" },
  { name: "rt_sin", sig: "(func $f_sin (param i64) (result i64))" },
  { name: "rt_cos", sig: "(func $f_cos (param i64) (result i64))" },
  // Globals
  {
    name: "rt_get_global",
    sig: "(func $rt_get_global (param i64) (result i64))",
  },
  {
    name: "rt_set_global",
    sig: "(func $rt_set_global (param i64 i64) (result i64))",
  },
  // Error
  { name: "rt_div_zero_error", sig: "(func $rt_div_zero_error)" },
  // Collections - Stack
  {
    name: "rt_Stack_constructor",
    sig: "(func $rt_Stack_constructor (param i64) (result i64))",
  },
  {
    name: "rt_Stack_push",
    sig: "(func $rt_Stack_push (param i64 i64) (result i64))",
  },
  {
    name: "rt_Stack_pop",
    sig: "(func $rt_Stack_pop (param i64) (result i64))",
  },
  {
    name: "rt_Stack_peek",
    sig: "(func $rt_Stack_peek (param i64) (result i64))",
  },
  {
    name: "rt_Stack_size",
    sig: "(func $rt_Stack_size (param i64) (result i64))",
  },
  {
    name: "rt_Stack_isEmpty",
    sig: "(func $rt_Stack_isEmpty (param i64) (result i64))",
  },
  // Collections - Queue
  {
    name: "rt_Queue_constructor",
    sig: "(func $rt_Queue_constructor (param i64) (result i64))",
  },
  {
    name: "rt_Queue_enqueue",
    sig: "(func $rt_Queue_enqueue (param i64 i64) (result i64))",
  },
  {
    name: "rt_Queue_dequeue",
    sig: "(func $rt_Queue_dequeue (param i64) (result i64))",
  },
  {
    name: "rt_Queue_size",
    sig: "(func $rt_Queue_size (param i64) (result i64))",
  },
  {
    name: "rt_Queue_isEmpty",
    sig: "(func $rt_Queue_isEmpty (param i64) (result i64))",
  },
  // Collections - MinHeap / PriorityQueue
  {
    name: "rt_MinHeap_constructor",
    sig: "(func $rt_MinHeap_constructor (param i64) (result i64))",
  },
  {
    name: "rt_MinHeap_insert",
    sig: "(func $rt_MinHeap_insert (param i64 i64) (result i64))",
  },
  {
    name: "rt_MinHeap_extractMin",
    sig: "(func $rt_MinHeap_extractMin (param i64) (result i64))",
  },
  {
    name: "rt_MinHeap_size",
    sig: "(func $rt_MinHeap_size (param i64) (result i64))",
  },
  {
    name: "rt_MinHeap_isEmpty",
    sig: "(func $rt_MinHeap_isEmpty (param i64) (result i64))",
  },
  {
    name: "rt_PriorityQueue_constructor",
    sig: "(func $rt_PriorityQueue_constructor (param i64) (result i64))",
  },
  {
    name: "rt_PriorityQueue_insert",
    sig: "(func $rt_PriorityQueue_insert (param i64 i64) (result i64))",
  },
  {
    name: "rt_PriorityQueue_extractMin",
    sig: "(func $rt_PriorityQueue_extractMin (param i64) (result i64))",
  },
  {
    name: "rt_PriorityQueue_size",
    sig: "(func $rt_PriorityQueue_size (param i64) (result i64))",
  },
  {
    name: "rt_PriorityQueue_isEmpty",
    sig: "(func $rt_PriorityQueue_isEmpty (param i64) (result i64))",
  },
  // Collections - Set
  {
    name: "rt_Set_constructor",
    sig: "(func $rt_Set_constructor (param i64) (result i64))",
  },
  {
    name: "rt_Set_add",
    sig: "(func $rt_Set_add (param i64 i64) (result i64))",
  },
  {
    name: "rt_Set_has",
    sig: "(func $rt_Set_has (param i64 i64) (result i64))",
  },
  {
    name: "rt_Set_delete",
    sig: "(func $rt_Set_delete (param i64 i64) (result i64))",
  },
  {
    name: "rt_Set_values",
    sig: "(func $rt_Set_values (param i64) (result i64))",
  },
  { name: "rt_Set_size", sig: "(func $rt_Set_size (param i64) (result i64))" },
  {
    name: "rt_Set_isEmpty",
    sig: "(func $rt_Set_isEmpty (param i64) (result i64))",
  },
  // Collections - OrderedMap
  {
    name: "rt_OrderedMap_constructor",
    sig: "(func $rt_OrderedMap_constructor (param i64) (result i64))",
  },
  {
    name: "rt_OrderedMap_put",
    sig: "(func $rt_OrderedMap_put (param i64 i64 i64) (result i64))",
  },
  {
    name: "rt_OrderedMap_at",
    sig: "(func $rt_OrderedMap_at (param i64 i64) (result i64))",
  },
  {
    name: "rt_OrderedMap_has",
    sig: "(func $rt_OrderedMap_has (param i64 i64) (result i64))",
  },
  {
    name: "rt_OrderedMap_size",
    sig: "(func $rt_OrderedMap_size (param i64) (result i64))",
  },
  {
    name: "rt_OrderedMap_isEmpty",
    sig: "(func $rt_OrderedMap_isEmpty (param i64) (result i64))",
  },
  // Collections - OrderedSet
  {
    name: "rt_OrderedSet_constructor",
    sig: "(func $rt_OrderedSet_constructor (param i64) (result i64))",
  },
  {
    name: "rt_OrderedSet_add",
    sig: "(func $rt_OrderedSet_add (param i64 i64) (result i64))",
  },
  {
    name: "rt_OrderedSet_has",
    sig: "(func $rt_OrderedSet_has (param i64 i64) (result i64))",
  },
  {
    name: "rt_OrderedSet_size",
    sig: "(func $rt_OrderedSet_size (param i64) (result i64))",
  },
  {
    name: "rt_OrderedSet_isEmpty",
    sig: "(func $rt_OrderedSet_isEmpty (param i64) (result i64))",
  },
  // Collections - BloomFilter
  {
    name: "rt_BloomFilter_constructor",
    sig: "(func $rt_BloomFilter_constructor (param i64 i64 i64) (result i64))",
  },
  {
    name: "rt_BloomFilter_add",
    sig: "(func $rt_BloomFilter_add (param i64 i64) (result i64))",
  },
  {
    name: "rt_BloomFilter_contains",
    sig: "(func $rt_BloomFilter_contains (param i64 i64) (result i64))",
  },
  // Collections - Trie
  {
    name: "rt_Trie_constructor",
    sig: "(func $rt_Trie_constructor (param i64) (result i64))",
  },
  {
    name: "rt_Trie_addPath",
    sig: "(func $rt_Trie_addPath (param i64 i64 i64) (result i64))",
  },
  {
    name: "rt_Trie_find",
    sig: "(func $rt_Trie_find (param i64 i64) (result i64))",
  },
  // std:math (new-style imports)
  {
    name: "std_math_sqrt",
    sig: "(func $std_math_sqrt (param i64) (result i64))",
  },
  {
    name: "std_math_sin",
    sig: "(func $std_math_sin (param i64) (result i64))",
  },
  {
    name: "std_math_cos",
    sig: "(func $std_math_cos (param i64) (result i64))",
  },
  {
    name: "std_math_pow",
    sig: "(func $std_math_pow (param i64 i64) (result i64))",
  },
  {
    name: "std_math_abs",
    sig: "(func $std_math_abs (param i64) (result i64))",
  },
  {
    name: "std_math_ceil",
    sig: "(func $std_math_ceil (param i64) (result i64))",
  },
  {
    name: "std_math_floor",
    sig: "(func $std_math_floor (param i64) (result i64))",
  },
  {
    name: "std_math_round",
    sig: "(func $std_math_round (param i64) (result i64))",
  },
  { name: "std_math_random", sig: "(func $std_math_random (result i64))" },
  {
    name: "std_math_min",
    sig: "(func $std_math_min (param i64 i64) (result i64))",
  },
  {
    name: "std_math_max",
    sig: "(func $std_math_max (param i64 i64) (result i64))",
  },
];

// ────────────────────────────────────────────
// Runtime Factory
// ────────────────────────────────────────────

export function createRuntime(
  userMemory: WebAssembly.Memory,
  onOutput: (str: string) => void,
  metadata?: Record<string, Record<string, number>>,
) {
  const heap = new Map<number, any>();
  const globals = new Map<number, bigint>();
  let nextId = 200_000_000; // Start high to avoid collisions with raw i32 values

  // ── Helpers ──

  function heapAlloc(val: any): number {
    const id = nextId++;
    heap.set(id, val);
    return id;
  }

  function getStringFromMemory(ptr: number): string {
    const mem = new Uint8Array(userMemory.buffer);
    let end = ptr;
    while (end < mem.length && mem[end] !== 0) end++;
    return new TextDecoder().decode(mem.subarray(ptr, end));
  }

  function stringify(id: number): string {
    if (id === 0) return "null";
    const val = heap.get(id);
    if (val !== undefined) {
      if (typeof val === "string") return val;
      if (typeof val === "number")
        return val % 1 === 0 ? val.toFixed(0) : String(val);
      if (typeof val === "boolean") return val ? "true" : "false";
      if (val === null) return "null";
      if (Array.isArray(val))
        return "[" + val.map((v) => stringify(Number(v))).join(", ") + "]";
      if (val instanceof Map) {
        const parts: string[] = [];
        for (const [k, v] of val.entries()) {
          if (k === "toString" || k === "constructor") continue;
          parts.push(`${k}: ${stringify(Number(v))}`);
        }
        return "{ " + parts.join(", ") + " }";
      }
    }
    // Fall back: could be a raw integer
    if (id > -1_000_000_000 && id < 1_000_000_000) return String(id);
    // Or a reinterpreted float
    const buf = new ArrayBuffer(8);
    new BigInt64Array(buf)[0] = BigInt(id);
    const d = new Float64Array(buf)[0];
    if (isFinite(d) && Math.abs(d) > 1e-300 && Math.abs(d) < 1e300) {
      return d % 1 === 0 ? d.toFixed(0) : String(d);
    }
    return String(id);
  }

  function concatStrings(a: bigint, b: bigint): bigint {
    const sa = stringify(Number(a));
    const sb = stringify(Number(b));
    return BigInt(heapAlloc(sa + sb));
  }

  function unboxNum(id: bigint): number {
    const val = heap.get(Number(id));
    if (val !== undefined) return Number(val);
    return Number(id);
  }

  function mathUnary(fn: (x: number) => number) {
    return (a: bigint): bigint => BigInt(heapAlloc(fn(unboxNum(a))));
  }

  function mathBinary(fn: (a: number, b: number) => number) {
    return (a: bigint, b: bigint): bigint =>
      BigInt(heapAlloc(fn(unboxNum(a), unboxNum(b))));
  }

  // ── Core env object ──

  const env: Record<string, any> = {
    memory: userMemory,

    // ── Boxing ──
    rt_box_int: (val: bigint): bigint => BigInt(heapAlloc(Number(val))),
    rt_box_string: (ptr: bigint): bigint => {
      const s = getStringFromMemory(Number(ptr));
      // Check for existing string to deduplicate
      for (const [id, v] of heap.entries()) {
        if (typeof v === "string" && v === s) return BigInt(id);
      }
      return BigInt(heapAlloc(s));
    },
    rt_box_boolean: (val: bigint): bigint =>
      BigInt(heapAlloc(Number(val) !== 0)),
    rt_box_number: (val: number): bigint => BigInt(heapAlloc(val)),

    // ── Unboxing / Conversion ──
    rt_to_number: (id: bigint): number => {
      const val = heap.get(Number(id));
      if (typeof val === "number") return val;
      if (typeof val === "boolean") return val ? 1.0 : 0.0;
      return Number(id);
    },
    rt_to_boolean: (id: bigint): bigint => {
      const val = heap.get(Number(id));
      if (typeof val === "boolean") return BigInt(val ? 1 : 0);
      if (typeof val === "number") return BigInt(val !== 0 ? 1 : 0);
      return BigInt(Number(id) !== 0 ? 1 : 0);
    },
    rt_to_string: (id: bigint): bigint => {
      const s = stringify(Number(id));
      return BigInt(heapAlloc(s));
    },

    // ── String ops ──
    rt_str_concat: concatStrings,
    rt_string_concat: concatStrings,
    rt_concat: concatStrings,
    rt_string_eq: (a: bigint, b: bigint): bigint =>
      BigInt(heapAlloc(stringify(Number(a)) === stringify(Number(b)))),
    rt_string_length: (id: bigint): bigint =>
      BigInt(heapAlloc(stringify(Number(id)).length)),
    rt_string_from_int: (val: bigint): bigint =>
      BigInt(heapAlloc(String(Number(val)))),
    rt_string_from_float: (val: bigint): bigint => {
      const buf = new ArrayBuffer(8);
      new BigInt64Array(buf)[0] = val;
      const d = new Float64Array(buf)[0];
      return BigInt(heapAlloc(String(d)));
    },
    rt_str_len: (id: bigint): bigint => {
      const s = stringify(Number(id));
      return BigInt(s.length);
    },
    rt_str_eq: (id1: bigint, id2: bigint): bigint => {
      return stringify(Number(id1)) === stringify(Number(id2)) ? 1n : 0n;
    },
    rt_str_cmp: (id1: bigint, id2: bigint): bigint => {
      const s1 = stringify(Number(id1));
      const s2 = stringify(Number(id2));
      if (s1 < s2) return -1n;
      if (s1 > s2) return 1n;
      return 0n;
    },

    // ── Object / Map ──
    m_new: (): bigint => BigInt(heapAlloc(new Map<string, number>())),
    m_set: (id: bigint, keyId: bigint, val: bigint): bigint => {
      const obj = heap.get(Number(id));
      if (obj instanceof Map) obj.set(stringify(Number(keyId)), Number(val));
      return val;
    },
    m_get: (id: bigint, keyId: bigint): bigint => {
      const obj = heap.get(Number(id));
      if (obj instanceof Map)
        return BigInt(obj.get(stringify(Number(keyId))) || 0);
      return 0n;
    },
    m_delete: (id: bigint, keyId: bigint): bigint => {
      const obj = heap.get(Number(id));
      if (obj instanceof Map)
        return obj.delete(stringify(Number(keyId))) ? 1n : 0n;
      return 0n;
    },
    rt_Map_new: (): bigint => BigInt(heapAlloc(new Map<string, number>())),
    rt_Map_set: (id: bigint, keyId: bigint, val: bigint): bigint => {
      const obj = heap.get(Number(id));
      if (obj instanceof Map) obj.set(stringify(Number(keyId)), Number(val));
      return id;
    },
    rt_Map_get: (id: bigint, keyId: bigint): bigint => {
      const obj = heap.get(Number(id));
      if (obj instanceof Map)
        return BigInt(obj.get(stringify(Number(keyId))) || 0);
      return 0n;
    },
    rt_Map_has: (id: bigint, keyId: bigint): bigint => {
      const obj = heap.get(Number(id));
      if (obj instanceof Map)
        return obj.has(stringify(Number(keyId))) ? 1n : 0n;
      return 0n;
    },
    rt_Map_delete: (id: bigint, keyId: bigint): bigint => {
      const obj = heap.get(Number(id));
      if (obj instanceof Map)
        return obj.delete(stringify(Number(keyId))) ? 1n : 0n;
      return 0n;
    },
    rt_Map_size: (id: bigint): bigint => {
      const obj = heap.get(Number(id));
      if (obj instanceof Map) return BigInt(obj.size);
      return 0n;
    },

    // ── Array ──
    a_new: (): bigint => BigInt(heapAlloc([])),
    Array_push: (id: bigint, val: bigint): bigint => {
      const arr = heap.get(Number(id));
      if (Array.isArray(arr)) arr.push(Number(val));
      return id;
    },
    a_get: (id: bigint, index: bigint): bigint => {
      const arr = heap.get(Number(id));
      if (Array.isArray(arr)) return BigInt(arr[Number(index)] || 0);
      return 0n;
    },
    rt_array_get_fast: (id: bigint, index: bigint): bigint => {
      const arr = heap.get(Number(id));
      if (Array.isArray(arr)) return BigInt(arr[Number(index)] || 0);
      return 0n;
    },
    a_set: (id: bigint, index: bigint, val: bigint): bigint => {
      const arr = heap.get(Number(id));
      if (Array.isArray(arr)) arr[Number(index)] = Number(val);
      return val;
    },
    rt_array_set_fast: (id: bigint, index: bigint, val: bigint): bigint => {
      const arr = heap.get(Number(id));
      if (Array.isArray(arr)) arr[Number(index)] = Number(val);
      return val;
    },
    rt_array_length: (id: bigint): bigint => {
      const arr = heap.get(Number(id));
      if (Array.isArray(arr)) return BigInt(heapAlloc(arr.length));
      return 0n;
    },
    a_len: (id: bigint): number => {
      const arr = heap.get(Number(id));
      if (Array.isArray(arr)) return arr.length;
      return 0;
    },
    a_pop: (id: bigint): bigint => {
      const arr = heap.get(Number(id));
      if (Array.isArray(arr)) {
        const val = arr.pop();
        if (val === undefined) return 0n;
        return BigInt(val);
      }
      return 0n;
    },
    len: (id: bigint): bigint => {
      const val = heap.get(Number(id));
      if (Array.isArray(val)) return BigInt(heapAlloc(val.length));
      if (typeof val === "string") return BigInt(heapAlloc(val.length));
      return 0n;
    },

    // ── Print ──
    print_raw: (id: bigint): void => {
      onOutput(stringify(Number(id)));
    },
    print_space: (): void => {
      onOutput(" ");
    },
    print_newline: (): void => {
      onOutput("\n");
    },
    rt_print_int: (val: bigint): void => {
      onOutput(stringify(Number(val)));
    },
    rt_print_float: (val: number): void => {
      onOutput(String(val));
    },
    rt_print_string: (val: bigint): void => {
      onOutput(stringify(Number(val)));
    },

    // ── Nullish / Truthy ──
    rt_is_nullish: (val: bigint): number => {
      const v = heap.get(Number(val));
      return v === null || v === undefined ? 1 : 0;
    },
    rt_is_truthy: (val: bigint): number => {
      const v = heap.get(Number(val));
      return v ? 1 : 0;
    },
    rt_box_null: (): bigint => BigInt(heapAlloc(null)),

    // ── Exception Handling ──
    tejx_get_exception: (): bigint => 0n,
    tejx_push_handler: (): void => {},
    tejx_pop_handler: (): void => {},
    tejx_throw: (id: bigint): void => {
      throw new Error("Exception: " + stringify(Number(id)));
    },

    // ── Comparison / typeof ──
    rt_eq: (a: bigint, b: bigint): bigint =>
      BigInt(heapAlloc(Number(a) === Number(b))),
    rt_ne: (a: bigint, b: bigint): bigint =>
      BigInt(heapAlloc(Number(a) !== Number(b))),
    rt_typeof: (id: bigint): bigint => {
      const val = heap.get(Number(id));
      if (typeof val === "number") return BigInt(heapAlloc("number"));
      if (typeof val === "string") return BigInt(heapAlloc("string"));
      if (typeof val === "boolean") return BigInt(heapAlloc("boolean"));
      if (Array.isArray(val)) return BigInt(heapAlloc("array"));
      if (val instanceof Map) return BigInt(heapAlloc("object"));
      return BigInt(heapAlloc("int32"));
    },

    // ── Globals ──
    rt_get_global: (idx: bigint): bigint => globals.get(Number(idx)) || 0n,
    rt_set_global: (idx: bigint, val: bigint): bigint => {
      globals.set(Number(idx), val);
      return val;
    },

    // ── Error ──
    rt_div_zero_error: (): void => {
      throw new Error("Division by zero");
    },

    // ── Math (legacy rt_ prefix) ──
    rt_min: mathBinary(Math.min),
    rt_max: mathBinary(Math.max),
    rt_abs: mathUnary(Math.abs),
    rt_round: mathUnary(Math.round),
    rt_floor: mathUnary(Math.floor),
    rt_ceil: mathUnary(Math.ceil),
    rt_pow: mathBinary(Math.pow),
    rt_sqrt: mathUnary(Math.sqrt),
    rt_sin: mathUnary(Math.sin),
    rt_cos: mathUnary(Math.cos),

    // ── std:math (new-style imports) ──
    std_math_sqrt: mathUnary(Math.sqrt),
    std_math_sin: mathUnary(Math.sin),
    std_math_cos: mathUnary(Math.cos),
    std_math_pow: mathBinary(Math.pow),
    std_math_abs: mathUnary(Math.abs),
    std_math_ceil: mathUnary(Math.ceil),
    std_math_floor: mathUnary(Math.floor),
    std_math_round: mathUnary(Math.round),
    std_math_random: (): bigint => BigInt(heapAlloc(Math.random())),
    std_math_min: mathBinary(Math.min),
    std_math_max: mathBinary(Math.max),

    // ── Memory ──
    rt_free: (id: bigint): void => {
      heap.delete(Number(id));
    },

    // ── Collections - Stack ──
    rt_Stack_constructor: (thisId: bigint): bigint => {
      heap.set(Number(thisId), []);
      return thisId;
    },
    rt_Stack_push: (thisId: bigint, val: bigint): bigint => {
      const arr = heap.get(Number(thisId));
      if (Array.isArray(arr)) arr.push(Number(val));
      return thisId;
    },
    rt_Stack_pop: (thisId: bigint): bigint => {
      const arr = heap.get(Number(thisId));
      if (Array.isArray(arr)) return BigInt(arr.pop() || 0);
      return 0n;
    },
    rt_Stack_peek: (thisId: bigint): bigint => {
      const arr = heap.get(Number(thisId));
      if (Array.isArray(arr) && arr.length > 0)
        return BigInt(arr[arr.length - 1]);
      return 0n;
    },
    rt_Stack_size: (thisId: bigint): bigint => {
      const arr = heap.get(Number(thisId));
      return Array.isArray(arr) ? BigInt(arr.length) : 0n;
    },
    rt_Stack_isEmpty: (thisId: bigint): bigint => {
      const arr = heap.get(Number(thisId));
      return Array.isArray(arr) && arr.length === 0 ? 1n : 0n;
    },

    // ── Collections - Queue ──
    rt_Queue_constructor: (thisId: bigint): bigint => {
      heap.set(Number(thisId), []);
      return thisId;
    },
    rt_Queue_enqueue: (thisId: bigint, val: bigint): bigint =>
      env.rt_Stack_push(thisId, val),
    rt_Queue_dequeue: (thisId: bigint): bigint => {
      const arr = heap.get(Number(thisId));
      if (Array.isArray(arr) && arr.length > 0) return BigInt(arr.shift() || 0);
      return 0n;
    },
    rt_Queue_size: (thisId: bigint): bigint => env.rt_Stack_size(thisId),
    rt_Queue_isEmpty: (thisId: bigint): bigint => env.rt_Stack_isEmpty(thisId),

    // ── Collections - Set ──
    rt_Set_constructor: (thisId: bigint): bigint => {
      heap.set(Number(thisId), new Set<number>());
      return thisId;
    },
    rt_Set_add: (thisId: bigint, val: bigint): bigint => {
      const s = heap.get(Number(thisId));
      if (s instanceof Set) s.add(Number(val));
      return thisId;
    },
    rt_Set_has: (thisId: bigint, val: bigint): bigint => {
      const s = heap.get(Number(thisId));
      return s instanceof Set && s.has(Number(val)) ? 1n : 0n;
    },
    rt_Set_delete: (thisId: bigint, val: bigint): bigint => {
      const s = heap.get(Number(thisId));
      if (s instanceof Set) return s.delete(Number(val)) ? 1n : 0n;
      return 0n;
    },
    rt_Set_values: (thisId: bigint): bigint => {
      const s = heap.get(Number(thisId));
      if (s instanceof Set) return BigInt(heapAlloc(Array.from(s)));
      return 0n;
    },
    rt_Set_size: (thisId: bigint): bigint => {
      const s = heap.get(Number(thisId));
      return s instanceof Set ? BigInt(s.size) : 0n;
    },
    rt_Set_isEmpty: (thisId: bigint): bigint => {
      const s = heap.get(Number(thisId));
      return s instanceof Set && s.size === 0 ? 1n : 0n;
    },

    // ── Collections - OrderedMap (delegates to Map) ──
    rt_OrderedMap_constructor: (thisId: bigint): bigint => {
      heap.set(Number(thisId), new Map<string, number>());
      return thisId;
    },
    rt_OrderedMap_put: (thisId: bigint, key: bigint, val: bigint): bigint =>
      env.rt_Map_set(thisId, key, val),
    rt_OrderedMap_at: (thisId: bigint, key: bigint): bigint =>
      env.rt_Map_get(thisId, key),
    rt_OrderedMap_has: (thisId: bigint, key: bigint): bigint =>
      env.rt_Map_has(thisId, key),
    rt_OrderedMap_size: (thisId: bigint): bigint => env.rt_Map_size(thisId),
    rt_OrderedMap_isEmpty: (thisId: bigint): bigint => {
      const map = heap.get(Number(thisId));
      if (map instanceof Map) return map.size === 0 ? 1n : 0n;
      return 0n;
    },

    // ── Collections - OrderedSet (delegates to Set) ──
    rt_OrderedSet_constructor: (thisId: bigint): bigint =>
      env.rt_Set_constructor(thisId),
    rt_OrderedSet_add: (thisId: bigint, val: bigint): bigint =>
      env.rt_Set_add(thisId, val),
    rt_OrderedSet_has: (thisId: bigint, val: bigint): bigint =>
      env.rt_Set_has(thisId, val),
    rt_OrderedSet_size: (thisId: bigint): bigint => env.rt_Set_size(thisId),
    rt_OrderedSet_isEmpty: (thisId: bigint): bigint =>
      env.rt_Set_isEmpty(thisId),

    // ── Collections - MinHeap / MaxHeap / PriorityQueue ──
    rt_MinHeap_constructor: (thisId: bigint): bigint => {
      heap.set(Number(thisId), []);
      return thisId;
    },
    rt_MinHeap_insert: (thisId: bigint, val: bigint): bigint => {
      const arr = heap.get(Number(thisId));
      if (Array.isArray(arr)) {
        arr.push(Number(val));
        arr.sort((a: number, b: number) => a - b);
      }
      return thisId;
    },
    rt_MinHeap_extractMin: (thisId: bigint): bigint => {
      const arr = heap.get(Number(thisId));
      if (Array.isArray(arr) && arr.length > 0) return BigInt(arr.shift() || 0);
      return 0n;
    },
    rt_MinHeap_size: (thisId: bigint): bigint => env.rt_Stack_size(thisId),
    rt_MinHeap_isEmpty: (thisId: bigint): bigint =>
      env.rt_Stack_isEmpty(thisId),
    rt_PriorityQueue_constructor: (thisId: bigint): bigint =>
      env.rt_MinHeap_constructor(thisId),
    rt_PriorityQueue_insert: (thisId: bigint, val: bigint): bigint =>
      env.rt_MinHeap_insert(thisId, val),
    rt_PriorityQueue_extractMin: (thisId: bigint): bigint =>
      env.rt_MinHeap_extractMin(thisId),
    rt_PriorityQueue_size: (thisId: bigint): bigint =>
      env.rt_MinHeap_size(thisId),
    rt_PriorityQueue_isEmpty: (thisId: bigint): bigint =>
      env.rt_MinHeap_isEmpty(thisId),

    // ── Collections - BloomFilter (simplified via Set) ──
    rt_BloomFilter_constructor: (thisId: bigint): bigint =>
      env.rt_Set_constructor(thisId),
    rt_BloomFilter_add: (thisId: bigint, val: bigint): bigint =>
      env.rt_Set_add(thisId, val),
    rt_BloomFilter_contains: (thisId: bigint, val: bigint): bigint =>
      env.rt_Set_has(thisId, val),

    // ── Collections - Trie ──
    rt_Trie_constructor: (thisId: bigint): bigint => {
      heap.set(Number(thisId), {
        _trie: true,
        children: {} as Record<string, any>,
        isEnd: false,
        value: 0,
      });
      return thisId;
    },
    rt_Trie_addPath: (thisId: bigint, pathId: bigint, val: bigint): bigint => {
      let curr = heap.get(Number(thisId));
      const path = stringify(Number(pathId));
      for (const char of path) {
        if (!curr.children[char]) {
          curr.children[char] = { children: {}, isEnd: false, value: 0 };
        }
        curr = curr.children[char];
      }
      curr.isEnd = true;
      curr.value = Number(val);
      return thisId;
    },
    rt_Trie_find: (thisId: bigint, pathId: bigint): bigint => {
      let curr = heap.get(Number(thisId));
      const path = stringify(Number(pathId));
      for (const char of path) {
        if (!curr.children[char]) return 0n;
        curr = curr.children[char];
      }
      return curr.isEnd ? BigInt(curr.value) : 0n;
    },
  };

  // ── Dynamic StdLib Registration ──
  if (metadata) {
    for (const [modName, funcs] of Object.entries(metadata)) {
      for (const funcName of Object.keys(funcs)) {
        const watName = `std_${modName}_${funcName}`;
        if (env[watName]) continue; // Already registered
        env[watName] = (...args: bigint[]) => {
          if (modName === "math") {
            const mathFunc = (Math as any)[funcName];
            if (mathFunc) {
              const rawArgs = args.map((id) => unboxNum(id));
              return BigInt(heapAlloc(mathFunc(...rawArgs)));
            }
          }
          if (modName === "json") {
            if (funcName === "stringify") {
              const val = heap.get(Number(args[0]));
              return BigInt(heapAlloc(JSON.stringify(val)));
            }
            if (funcName === "parse") {
              const str = heap.get(Number(args[0]));
              try {
                return BigInt(heapAlloc(JSON.parse(str)));
              } catch {
                return 0n;
              }
            }
          }
          console.warn(
            `[Runtime] Unhandled stdlib call: ${modName}.${funcName}`,
          );
          return 0n;
        };
      }
    }
  }

  // ── Proxy: auto-stub any missing import to prevent crashes ──
  const envProxy = new Proxy(env, {
    get: (target, prop) => {
      if (prop in target) return target[prop as string];
      // Auto-stub missing functions
      return (..._args: any[]) => {
        console.warn(`[Runtime STUB] Missing: ${String(prop)}`);
        return 0n;
      };
    },
  });

  return { env: envProxy };
}
