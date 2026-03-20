const HANDLE_BASE = 1n << 62n;
const FLOAT64_BUFFER = new ArrayBuffer(8);
const FLOAT64_VIEW = new DataView(FLOAT64_BUFFER);

function isSafeIntegerLike(value) {
  return Number.isFinite(value) && Number.isInteger(value) && Math.abs(value) < Number.MAX_SAFE_INTEGER;
}

function floatFromBits(bits) {
  FLOAT64_VIEW.setBigUint64(0, BigInt.asUintN(64, bits), true);
  return FLOAT64_VIEW.getFloat64(0, true);
}

class HostMap {
  constructor() {
    this.entries = new Map();
  }
}

const SHARED_BROWSER_FS = new Map([
  ["/", { kind: "dir" }],
  [".", { kind: "dir" }],
]);

export class TejxProgramHost {
  constructor(options = {}) {
    this.memory = new WebAssembly.Memory({ initial: options.memoryPages ?? 32 });
    this.onOutput = options.onOutput ?? (() => {});
    this.onLog = options.onLog ?? (() => {});
    this.heap = new Map();
    this.stringHandles = new Map();
    this.nextHandle = HANDLE_BASE;
    this.instance = null;
    this.unsupportedCalls = new Set();
    this.fs = options.fs ?? SHARED_BROWSER_FS;
    this.asyncOps = 0;
  }

  async instantiate(wasmBytes) {
    const module = new WebAssembly.Module(wasmBytes);
    const imports = this.buildImports(module);
    const instance = new WebAssembly.Instance(module, imports);
    this.instance = instance;
    return { module, instance };
  }

  runMain() {
    if (!this.instance) {
      throw new Error("Program instance is not ready");
    }
    if (typeof this.instance.exports.main !== "function") {
      throw new Error("Compiled module does not export `main`");
    }
    return this.instance.exports.main();
  }

  buildImports(module) {
    const env = { memory: this.memory };
    for (const entry of WebAssembly.Module.imports(module)) {
      if (entry.module !== "env" || entry.name === "memory") {
        continue;
      }
      env[entry.name] = this.resolveImport(entry.name);
    }
    return { env };
  }

  resolveImport(name) {
    const handler = this.importHandlers()[name];
    if (handler) {
      return handler;
    }
    if (name.startsWith("rt_to_string_")) {
      return (...args) => this.rtToString(...args);
    }
    const collectionHandler = this.resolveCollectionImport(name);
    if (collectionHandler) {
      return collectionHandler;
    }
    return (..._args) => {
      this.unsupportedCalls.add(name);
      throw new Error(`Unsupported TejX runtime import: ${name}`);
    };
  }

  importHandlers() {
    if (this._importHandlers) {
      return this._importHandlers;
    }

    const wrap = (fn) => (...args) => fn.apply(this, args);
    this._importHandlers = {
      tejx_libc_puts: wrap(this.tejxLibcPuts),
      tejx_libc_write: wrap(this.tejxLibcWrite),
      tejx_inc_async_ops: wrap(this.tejxIncAsyncOps),
      tejx_dec_async_ops: wrap(this.tejxDecAsyncOps),
      rt_alloc: wrap(this.rtAlloc),
      rt_free: wrap(this.rtFree),
      rt_box_string: wrap(this.rtBoxString),
      rt_box_int: wrap(this.rtBoxInt),
      rt_box_boolean: wrap(this.rtBoxBoolean),
      rt_box_char: wrap(this.rtBoxChar),
      rt_box_number: wrap(this.rtBoxNumber),
      rt_box_number_internal: wrap(this.rtBoxNumber),
      rt_closure_from_ptr: wrap(this.rtClosureFromPtr),
      rt_print: wrap(this.rtPrint),
      rt_print_string_array: wrap(this.rtPrintStringArray),
      rt_panic: wrap(this.rtPanic),
      rt_throw: wrap(this.rtThrow),
      rt_not: wrap(this.rtNot),
      rt_cast: wrap(this.rtCast),
      rt_len: wrap(this.rtLen),
      rt_typeof: wrap(this.rtTypeof),
      rt_is_array: wrap(this.rtIsArray),
      rt_to_string: wrap(this.rtToString),
      rt_to_string_int: wrap(this.rtToStringInt),
      rt_to_string_float: wrap(this.rtToStringFloat),
      rt_to_string_boolean: wrap(this.rtToStringBoolean),
      rt_to_number: wrap(this.rtToNumber),
      rt_to_number_internal: wrap(this.rtToNumber),
      rt_str_equals: wrap(this.rtStrEquals),
      rt_op_equalequal: wrap(this.rtEqualEqual),
      rt_str_concat_v2: wrap(this.rtStringConcat),
      rt_String_concat: wrap(this.rtStringConcat),
      rt_String_toUpperCase: wrap(this.rtStringToUpperCase),
      rt_String_toLowerCase: wrap(this.rtStringToLowerCase),
      rt_String_trim: wrap(this.rtStringTrim),
      rt_String_trimStart: wrap(this.rtStringTrimStart),
      rt_String_trimEnd: wrap(this.rtStringTrimEnd),
      rt_String_substring: wrap(this.rtStringSubstring),
      rt_String_split: wrap(this.rtStringSplit),
      rt_String_startsWith: wrap(this.rtStringStartsWith),
      rt_String_endsWith: wrap(this.rtStringEndsWith),
      rt_String_includes: wrap(this.rtStringIncludes),
      rt_String_indexOf: wrap(this.rtStringIndexOf),
      rt_str_at: wrap(this.rtStrAt),
      rt_strlen: wrap(this.rtLen),
      rt_String_repeat: wrap(this.rtStringRepeat),
      rt_String_replace: wrap(this.rtStringReplace),
      rt_String_padStart: wrap(this.rtStringPadStart),
      rt_String_padEnd: wrap(this.rtStringPadEnd),
      rt_class_new: wrap(this.rtClassNew),
      rt_object_new: wrap(this.rtObjectNew),
      rt_get_property: wrap(this.rtGetProperty),
      rt_set_property: wrap(this.rtSetProperty),
      rt_load_member: wrap(this.rtLoadMember),
      rt_store_member: wrap(this.rtStoreMember),
      rt_call_member: wrap(this.rtCallMember),
      rt_load_index: wrap(this.rtLoadIndex),
      rt_store_index: wrap(this.rtStoreIndex),
      rt_array_new: wrap(this.rtArrayNew),
      rt_Array_constructor_v2: wrap(this.rtArrayConstructor),
      rt_array_concat: wrap(this.rtArrayConcat),
      rt_array_push: wrap(this.rtArrayPush),
      rt_array_pop: wrap(this.rtArrayPop),
      rt_array_shift: wrap(this.rtArrayShift),
      rt_array_unshift: wrap(this.rtArrayUnshift),
      rt_array_join: wrap(this.rtArrayJoin),
      rt_array_indexOf: wrap(this.rtArrayIndexOf),
      rt_array_slice: wrap(this.rtArraySlice),
      rt_array_reverse: wrap(this.rtArrayReverse),
      rt_array_fill: wrap(this.rtArrayFill),
      rt_array_sort: wrap(this.rtArraySort),
      rt_array_get_fast: wrap(this.rtArrayGetFast),
      rt_array_set_fast: wrap(this.rtArraySetFast),
      rt_promise_new: wrap(this.rtPromiseNew),
      rt_promise_resolve: wrap(this.rtPromiseResolve),
      rt_promise_reject: wrap(this.rtPromiseReject),
      rt_promise_then: wrap(this.rtPromiseThen),
      rt_map_new: wrap(this.rtMapNew),
      rt_map_set: wrap(this.rtMapSet),
      rt_map_get: wrap(this.rtMapGet),
      rt_map_has: wrap(this.rtMapHas),
      rt_map_delete: wrap(this.rtMapDelete),
      rt_map_keys: wrap(this.rtMapKeys),
      rt_map_values: wrap(this.rtMapValues),
      rt_map_size: wrap(this.rtMapSize),
      rt_Object_keys: wrap(this.rtObjectKeys),
      rt_Object_values: wrap(this.rtObjectValues),
      rt_Object_entries: wrap(this.rtObjectEntries),
      rt_Object_assign: wrap(this.rtObjectAssign),
      rt_object_merge: wrap(this.rtObjectMerge),
      rt_Object_freeze: wrap(this.rtObjectFreeze),
      std_math_abs: wrap(this.stdMathAbs),
      std_math_sin: wrap(this.stdMathSin),
      std_math_cos: wrap(this.stdMathCos),
      std_math_sqrt: wrap(this.stdMathSqrt),
      std_math_floor: wrap(this.stdMathFloor),
      std_math_ceil: wrap(this.stdMathCeil),
      std_math_round: wrap(this.stdMathRound),
      std_math_pow: wrap(this.stdMathPow),
      rt_math_random: wrap(this.rtMathRandom),
      rt_time_now: wrap(this.rtTimeNow),
      rt_time_now_ms: wrap(this.rtTimeNowMs),
      rt_delay: wrap(this.rtDelay),
      rt_args: wrap(this.rtArgs),
      rt_getenv: wrap(this.rtGetenv),
      rt_fs_read_sync: wrap(this.rtFsReadSync),
      rt_fs_write_sync: wrap(this.rtFsWriteSync),
      rt_fs_append_sync: wrap(this.rtFsAppendSync),
      rt_fs_exists: wrap(this.rtFsExists),
      rt_fs_unlink_sync: wrap(this.rtFsUnlinkSync),
      rt_fs_mkdir_sync: wrap(this.rtFsMkdirSync),
      rt_fs_readdir_sync: wrap(this.rtFsReaddirSync),
      rt_exit: wrap(this.rtExit),
      rt_sizeof: wrap(this.zero),
    };

    return this._importHandlers;
  }

  resolveCollectionImport(name) {
    const make = (fn) => (...args) => fn.apply(this, args);

    if (/^Stack(?:_.+)?_constructor$/.test(name)) {
      return make(this.stackConstructor);
    }
    if (name === "Stack_push") {
      return make(this.stackPush);
    }
    if (name === "Stack_pop") {
      return make(this.stackPop);
    }
    if (name === "Stack_peek") {
      return make(this.stackPeek);
    }
    if (name === "Stack_size") {
      return make(this.stackSize);
    }
    if (name === "Stack_isEmpty") {
      return make(this.stackIsEmpty);
    }
    if (name === "Stack_clear") {
      return make(this.stackClear);
    }

    if (/^Queue(?:_.+)?_constructor$/.test(name)) {
      return make(this.queueConstructor);
    }
    if (name === "Queue_enqueue") {
      return make(this.queueEnqueue);
    }
    if (name === "Queue_dequeue") {
      return make(this.queueDequeue);
    }
    if (name === "Queue_peek") {
      return make(this.queuePeek);
    }
    if (name === "Queue_size") {
      return make(this.queueSize);
    }
    if (name === "Queue_isEmpty") {
      return make(this.queueIsEmpty);
    }
    if (name === "Queue_clear") {
      return make(this.queueClear);
    }

    if (/^Map(?:_.+)?_constructor$/.test(name)) {
      return make(this.mapConstructor);
    }
    if (name === "Map_set" || name === "Map_put") {
      return make(this.mapMethodSet);
    }
    if (name === "Map_get" || name === "Map_at") {
      return make(this.mapMethodGet);
    }
    if (name === "Map_has") {
      return make(this.mapMethodHas);
    }
    if (name === "Map_delete") {
      return make(this.mapMethodDelete);
    }
    if (name === "Map_keys") {
      return make(this.mapMethodKeys);
    }
    if (name === "Map_values") {
      return make(this.mapMethodValues);
    }
    if (name === "Map_size") {
      return make(this.mapMethodSize);
    }
    if (name === "Map_clear") {
      return make(this.mapMethodClear);
    }

    if (/^Set(?:_.+)?_constructor$/.test(name)) {
      return make(this.setConstructor);
    }
    if (name === "Set_add") {
      return make(this.setAdd);
    }
    if (name === "Set_has") {
      return make(this.setHas);
    }
    if (name === "Set_delete") {
      return make(this.setDelete);
    }
    if (name === "Set_values") {
      return make(this.setValues);
    }
    if (name === "Set_size") {
      return make(this.setSize);
    }
    if (name === "Set_clear") {
      return make(this.setClear);
    }

    return null;
  }

  zero() {
    return 0n;
  }

  identity(value) {
    return value;
  }

  isHandle(value) {
    return typeof value === "bigint" && value >= HANDLE_BASE && this.heap.has(value);
  }

  isTaggedValue(value) {
    return Boolean(value) && typeof value === "object" && typeof value.__tejxType === "string";
  }

  allocateTaggedValue(type, value) {
    return this.allocateHandle({ __tejxType: type, value });
  }

  visibleEntries(value) {
    return Object.entries(value ?? {}).filter(([key]) => !key.startsWith("__"));
  }

  allocateHandle(value) {
    if (typeof value === "string") {
      const existing = this.stringHandles.get(value);
      if (existing) {
        return existing;
      }
    }

    const handle = this.nextHandle;
    this.nextHandle += 1n;
    this.heap.set(handle, value);
    if (typeof value === "string") {
      this.stringHandles.set(value, handle);
    }
    return handle;
  }

  wrapValue(value) {
    if (value === null || value === undefined) {
      return 0n;
    }
    if (typeof value === "bigint") {
      return value;
    }
    if (typeof value === "boolean") {
      return value ? 1n : 0n;
    }
    if (typeof value === "number") {
      if (isSafeIntegerLike(value)) {
        return BigInt(value);
      }
      return this.allocateHandle(value);
    }
    return this.allocateHandle(value);
  }

  unwrapValue(value) {
    if (this.isHandle(value)) {
      return this.heap.get(value);
    }
    return value;
  }

  numericValue(value) {
    const raw = this.unwrapValue(value);
    if (this.isTaggedValue(raw)) {
      if (raw.__tejxType === "int") {
        return Number(raw.value);
      }
      if (raw.__tejxType === "float") {
        return raw.value;
      }
      if (raw.__tejxType === "bool") {
        return raw.value ? 1 : 0;
      }
      if (raw.__tejxType === "char") {
        return raw.value.codePointAt(0) ?? 0;
      }
    }
    if (typeof raw === "bigint") {
      return Number(raw);
    }
    if (typeof raw === "number") {
      return raw;
    }
    if (typeof raw === "boolean") {
      return raw ? 1 : 0;
    }
    if (typeof raw === "string") {
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }

  truthy(value) {
    const raw = this.unwrapValue(value);
    if (this.isTaggedValue(raw)) {
      if (raw.__tejxType === "bool") {
        return raw.value;
      }
      if (raw.__tejxType === "int") {
        return raw.value !== 0n;
      }
      if (raw.__tejxType === "float") {
        return raw.value !== 0;
      }
      if (raw.__tejxType === "char") {
        return raw.value.length > 0;
      }
    }
    if (typeof raw === "bigint") {
      return raw !== 0n;
    }
    if (typeof raw === "number") {
      return raw !== 0;
    }
    return Boolean(raw);
  }

  readCString(ptr) {
    const bytes = new Uint8Array(this.memory.buffer);
    let end = Number(ptr);
    while (end < bytes.length && bytes[end] !== 0) {
      end += 1;
    }
    return new TextDecoder().decode(bytes.subarray(Number(ptr), end));
  }

  stringValue(value) {
    const raw = this.unwrapValue(value);
    if (this.isTaggedValue(raw)) {
      if (raw.__tejxType === "char") {
        return raw.value;
      }
      if (raw.__tejxType === "bool") {
        return raw.value ? "true" : "false";
      }
      if (raw.__tejxType === "int") {
        return raw.value.toString();
      }
      if (raw.__tejxType === "float") {
        return `${raw.value}`;
      }
    }
    if (typeof raw === "string") {
      return raw;
    }
    if (typeof raw === "bigint") {
      if (raw === 0n) {
        return "None";
      }
      return raw.toString();
    }
    if (typeof raw === "number") {
      return `${raw}`;
    }
    if (typeof raw === "boolean") {
      return raw ? "true" : "false";
    }
    if (raw instanceof HostMap) {
      return `Map(${raw.entries.size})`;
    }
    if (Array.isArray(raw)) {
      return `[${raw.map((item) => this.stringValue(item)).join(", ")}]`;
    }
    if (raw && typeof raw === "object") {
      const entries = this.visibleEntries(raw)
        .map(([key, item]) => `${key}: ${this.stringValue(item)}`);
      return raw.__className ? `${raw.__className} { ${entries.join(", ")} }` : `{ ${entries.join(", ")} }`;
    }
    return String(raw ?? "");
  }

  typeName(value) {
    if (this.isHandle(value)) {
      const raw = this.heap.get(value);
      if (this.isTaggedValue(raw)) {
        return raw.__tejxType;
      }
      if (typeof raw === "string") {
        return "string";
      }
      if (typeof raw === "number") {
        return Number.isInteger(raw) ? "int" : "float";
      }
      if (typeof raw === "function") {
        return "function";
      }
      if (Array.isArray(raw)) {
        return "array";
      }
      if (raw && typeof raw === "object") {
        return "object";
      }
    }
    if (typeof value === "bigint") {
      if (value === 0n) {
        return "None";
      }
      return "int";
    }
    return "None";
  }

  mapKey(value) {
    const raw = this.unwrapValue(value);
    if (this.isTaggedValue(raw)) {
      if (raw.__tejxType === "int") {
        return `int:${raw.value.toString()}`;
      }
      if (raw.__tejxType === "float") {
        return `float:${raw.value}`;
      }
      if (raw.__tejxType === "bool") {
        return `bool:${raw.value ? "1" : "0"}`;
      }
      if (raw.__tejxType === "char") {
        return `char:${raw.value}`;
      }
    }
    if (typeof raw === "string") {
      return `string:${raw}`;
    }
    if (this.isHandle(value)) {
      return `handle:${value.toString()}`;
    }
    if (typeof raw === "bigint") {
      return raw === 0n ? "none" : `int:${raw.toString()}`;
    }
    return `value:${String(raw)}`;
  }

  valuesEqual(left, right) {
    const leftRaw = this.unwrapValue(left);
    const rightRaw = this.unwrapValue(right);

    const leftStringLike =
      typeof leftRaw === "string" || (this.isTaggedValue(leftRaw) && leftRaw.__tejxType === "char");
    const rightStringLike =
      typeof rightRaw === "string" || (this.isTaggedValue(rightRaw) && rightRaw.__tejxType === "char");
    if (leftStringLike && rightStringLike) {
      return this.stringValue(left) === this.stringValue(right);
    }

    const leftNumeric = this.typeName(left);
    const rightNumeric = this.typeName(right);
    if (
      ["int", "float", "bool", "char"].includes(leftNumeric) &&
      ["int", "float", "bool", "char"].includes(rightNumeric)
    ) {
      return this.numericValue(left) === this.numericValue(right);
    }

    return leftRaw === rightRaw;
  }

  decodeArgs(value) {
    const raw = this.unwrapValue(value);
    if (Array.isArray(raw)) {
      return raw;
    }
    if (raw === null || raw === undefined) {
      return [];
    }
    return [value];
  }

  tejxLibcPuts(value) {
    this.onOutput(this.stringValue(value));
    return 0n;
  }

  tejxLibcWrite(_fd, value) {
    this.onOutput(this.stringValue(value));
    return 0n;
  }

  tejxIncAsyncOps() {
    this.asyncOps += 1;
    return 0n;
  }

  tejxDecAsyncOps() {
    this.asyncOps = Math.max(0, this.asyncOps - 1);
    return 0n;
  }

  rtAlloc(_size) {
    return 0n;
  }

  rtFree(_ptr) {
    return 0n;
  }

  rtBoxString(ptr) {
    return this.wrapValue(this.readCString(ptr));
  }

  rtBoxInt(value) {
    const raw = this.unwrapValue(value);
    if (this.isTaggedValue(raw) && raw.__tejxType === "int") {
      return value;
    }
    if (typeof raw === "bigint") {
      return this.allocateTaggedValue("int", raw);
    }
    return this.allocateTaggedValue("int", BigInt(Math.trunc(this.numericValue(value))));
  }

  rtBoxBoolean(value) {
    return this.allocateTaggedValue("bool", this.truthy(value));
  }

  rtBoxChar(value) {
    const codePoint = this.numericValue(value);
    return this.allocateTaggedValue("char", String.fromCodePoint(codePoint || 0));
  }

  rtBoxNumber(bits) {
    return this.allocateTaggedValue("float", floatFromBits(bits));
  }

  rtClosureFromPtr(value) {
    return value;
  }

  rtPrint(value) {
    this.onOutput(this.stringValue(value));
    return 0n;
  }

  rtPrintStringArray(args) {
    const array = this.unwrapValue(args);
    const output = Array.isArray(array) ? array.map((item) => this.stringValue(item)).join(" ") : "";
    this.onOutput(output);
    return 0n;
  }

  rtPanic(value) {
    throw new Error(this.stringValue(value));
  }

  rtThrow(value) {
    throw new Error(this.stringValue(value));
  }

  rtNot(value) {
    return this.truthy(value) ? 0n : 1n;
  }

  rtCast(value, typeValue) {
    const descriptor = typeof typeValue === "bigint" || this.isHandle(typeValue)
      ? this.stringValue(typeValue)
      : "";
    if (!descriptor || descriptor === "None") {
      return value;
    }

    const [srcType, dstType] = descriptor.split("->");
    if (!dstType) {
      return value;
    }

    if (dstType === "Any") {
      if (srcType === "Bool") {
        return this.rtBoxBoolean(value);
      }
      if (srcType === "Int" || srcType === "Int32" || srcType === "Int64") {
        return this.rtBoxInt(value);
      }
      if (srcType === "Float" || srcType === "Float32" || srcType === "Float64") {
        const raw = this.unwrapValue(value);
        if (this.isTaggedValue(raw) && raw.__tejxType === "float") {
          return value;
        }
        return this.allocateTaggedValue("float", this.numericValue(value));
      }
      if (srcType === "Char") {
        const raw = this.unwrapValue(value);
        if (this.isTaggedValue(raw) && raw.__tejxType === "char") {
          return value;
        }
        return this.allocateTaggedValue("char", this.stringValue(value).charAt(0));
      }
      return value;
    }

    if (dstType === "Int" || dstType === "Int32" || dstType === "Int64") {
      return BigInt(Math.trunc(this.numericValue(value)));
    }

    if (dstType === "Float" || dstType === "Float32" || dstType === "Float64") {
      return this.allocateTaggedValue("float", this.numericValue(value));
    }

    if (dstType === "Bool") {
      return this.truthy(value) ? 1n : 0n;
    }

    if (dstType === "String") {
      return this.typeName(value) === "string" ? value : this.rtToString(value);
    }

    return value;
  }

  rtLen(value) {
    const raw = this.unwrapValue(value);
    if (typeof raw === "string" || Array.isArray(raw)) {
      return BigInt(raw.length);
    }
    if (raw instanceof HostMap) {
      return BigInt(raw.entries.size);
    }
    if (raw && typeof raw === "object") {
      return BigInt(this.visibleEntries(raw).length);
    }
    return 0n;
  }

  rtTypeof(value) {
    return this.wrapValue(this.typeName(value));
  }

  rtIsArray(value) {
    return Array.isArray(this.unwrapValue(value)) ? 1n : 0n;
  }

  rtToString(value) {
    return this.wrapValue(this.stringValue(value));
  }

  rtToStringInt(value) {
    const raw = this.unwrapValue(value);
    if (this.isTaggedValue(raw) && raw.__tejxType === "int") {
      return this.wrapValue(raw.value.toString());
    }
    if (typeof raw === "bigint") {
      return this.wrapValue(raw.toString());
    }
    return this.wrapValue(BigInt(Math.trunc(this.numericValue(value))).toString());
  }

  rtToStringFloat(value) {
    const raw = this.unwrapValue(value);
    if (this.isTaggedValue(raw) && raw.__tejxType === "float") {
      return this.wrapValue(`${raw.value}`);
    }
    return this.wrapValue(`${this.numericValue(value)}`);
  }

  rtToStringBoolean(value) {
    return this.wrapValue(this.truthy(value) ? "true" : "false");
  }

  rtToNumber(value) {
    const num = this.numericValue(value);
    return this.wrapValue(num);
  }

  rtStrEquals(left, right) {
    return this.stringValue(left) === this.stringValue(right) ? 1n : 0n;
  }

  rtEqualEqual(left, right) {
    return this.valuesEqual(left, right) ? 1n : 0n;
  }

  rtStringConcat(left, right) {
    return this.wrapValue(this.stringValue(left) + this.stringValue(right));
  }

  rtStringToUpperCase(value) {
    return this.wrapValue(this.stringValue(value).toUpperCase());
  }

  rtStringToLowerCase(value) {
    return this.wrapValue(this.stringValue(value).toLowerCase());
  }

  rtStringTrim(value) {
    return this.wrapValue(this.stringValue(value).trim());
  }

  rtStringTrimStart(value) {
    return this.wrapValue(this.stringValue(value).trimStart());
  }

  rtStringTrimEnd(value) {
    return this.wrapValue(this.stringValue(value).trimEnd());
  }

  rtStringSubstring(value, start, end) {
    return this.wrapValue(this.stringValue(value).substring(this.numericValue(start), this.numericValue(end)));
  }

  rtStringSplit(value, separator) {
    const parts = this.stringValue(value).split(this.stringValue(separator)).map((item) => this.wrapValue(item));
    return this.wrapValue(parts);
  }

  rtStringStartsWith(value, prefix) {
    return this.stringValue(value).startsWith(this.stringValue(prefix)) ? 1n : 0n;
  }

  rtStringEndsWith(value, suffix) {
    return this.stringValue(value).endsWith(this.stringValue(suffix)) ? 1n : 0n;
  }

  rtStringIncludes(value, needle) {
    return this.stringValue(value).includes(this.stringValue(needle)) ? 1n : 0n;
  }

  rtStringIndexOf(value, needle) {
    return BigInt(this.stringValue(value).indexOf(this.stringValue(needle)));
  }

  rtStrAt(value, index) {
    const source = this.stringValue(value);
    return this.wrapValue(source[this.numericValue(index)] ?? "");
  }

  rtStringRepeat(value, count) {
    return this.wrapValue(this.stringValue(value).repeat(Math.max(0, this.numericValue(count))));
  }

  rtStringReplace(value, search, replacement) {
    return this.wrapValue(
      this.stringValue(value).replaceAll(this.stringValue(search), this.stringValue(replacement)),
    );
  }

  rtStringPadStart(value, length, pad) {
    return this.wrapValue(this.stringValue(value).padStart(this.numericValue(length), this.stringValue(pad) || " "));
  }

  rtStringPadEnd(value, length, pad) {
    return this.wrapValue(this.stringValue(value).padEnd(this.numericValue(length), this.stringValue(pad) || " "));
  }

  rtClassNew(namePtr) {
    return this.wrapValue({ __className: this.readCString(namePtr) });
  }

  rtObjectNew() {
    return this.wrapValue({});
  }

  rtGetProperty(objValue, keyValue) {
    const obj = this.unwrapValue(objValue);
    const key = this.stringValue(keyValue);
    if (!obj || typeof obj !== "object") {
      return 0n;
    }
    return obj[key] ?? 0n;
  }

  rtSetProperty(objValue, keyValue, value) {
    const obj = this.unwrapValue(objValue);
    const key = this.stringValue(keyValue);
    if (obj && typeof obj === "object") {
      obj[key] = value;
    }
    return 0n;
  }

  rtLoadMember(objValue, memberValue) {
    const obj = this.unwrapValue(objValue);
    const member = this.stringValue(memberValue);
    if (obj === null || obj === undefined) {
      return 0n;
    }

    if (Array.isArray(obj)) {
      if (member === "length") {
        return BigInt(obj.length);
      }
      return this.wrapValue(obj[member]);
    }

    if (typeof obj === "string") {
      if (member === "length") {
        return BigInt(obj.length);
      }
      return 0n;
    }

    return this.wrapValue(obj[member]);
  }

  rtStoreMember(objValue, memberValue, value) {
    const obj = this.unwrapValue(objValue);
    const member = this.stringValue(memberValue);
    if (obj && typeof obj === "object") {
      obj[member] = value;
    }
    return value;
  }

  rtCallMember(objValue, memberValue, argsValue) {
    const obj = this.unwrapValue(objValue);
    const member = this.stringValue(memberValue);
    const args = this.decodeArgs(argsValue).map((item) => this.unwrapValue(item));
    if (!obj || typeof obj[member] !== "function") {
      throw new Error(`Member ${member} is not callable`);
    }
    return this.wrapValue(obj[member](...args));
  }

  rtLoadIndex(objValue, indexValue) {
    const obj = this.unwrapValue(objValue);
    const index = this.numericValue(indexValue);
    if (Array.isArray(obj)) {
      return obj[index] ?? 0n;
    }
    if (typeof obj === "string") {
      return this.wrapValue(obj[index] ?? "");
    }
    return 0n;
  }

  rtStoreIndex(objValue, indexValue, value) {
    const obj = this.unwrapValue(objValue);
    const index = this.numericValue(indexValue);
    if (Array.isArray(obj)) {
      obj[index] = value;
    }
    return value;
  }

  rtArrayNew() {
    const size = Math.max(0, this.numericValue(arguments[0] ?? 0n));
    return this.wrapValue(Array.from({ length: size }, () => 0n));
  }

  rtArrayConstructor(_thisValue, sizeOrArray) {
    const raw = this.unwrapValue(sizeOrArray);
    if (Array.isArray(raw)) {
      return this.wrapValue([...raw]);
    }
    const size = Math.max(0, this.numericValue(sizeOrArray));
    return this.wrapValue(Array.from({ length: size }, () => 0n));
  }

  rtArrayPush(arrayValue, value) {
    const array = this.unwrapValue(arrayValue);
    array.push(value);
    return arrayValue;
  }

  rtArrayConcat(leftValue, rightValue) {
    const left = this.unwrapValue(leftValue);
    const right = this.unwrapValue(rightValue);
    if (!Array.isArray(left) && !Array.isArray(right)) {
      return this.wrapValue([]);
    }
    if (!Array.isArray(left)) {
      return this.wrapValue([...right]);
    }
    if (!Array.isArray(right)) {
      return this.wrapValue([...left]);
    }
    return this.wrapValue([...left, ...right]);
  }

  rtArrayPop(arrayValue) {
    const array = this.unwrapValue(arrayValue);
    return array.length ? array.pop() : 0n;
  }

  rtArrayShift(arrayValue) {
    const array = this.unwrapValue(arrayValue);
    if (!Array.isArray(array)) {
      return 0n;
    }
    return array.length ? array.shift() : 0n;
  }

  rtArrayUnshift(arrayValue, value) {
    const array = this.unwrapValue(arrayValue);
    array.unshift(value);
    return arrayValue;
  }

  rtArrayJoin(arrayValue, separatorValue) {
    const array = this.unwrapValue(arrayValue);
    const separator = this.stringValue(separatorValue);
    if (!Array.isArray(array)) {
      return this.wrapValue("");
    }
    return this.wrapValue(array.map((item) => this.stringValue(item)).join(separator));
  }

  rtArrayIndexOf(arrayValue, needle) {
    const array = this.unwrapValue(arrayValue);
    if (!Array.isArray(array)) {
      return -1n;
    }
    const index = array.findIndex((item) => this.valuesEqual(item, needle));
    return BigInt(index);
  }

  rtArraySlice(arrayValue, startValue, endValue) {
    const array = this.unwrapValue(arrayValue);
    if (!Array.isArray(array)) {
      return this.wrapValue([]);
    }
    const start = Math.trunc(this.numericValue(startValue));
    const end = Math.trunc(this.numericValue(endValue));
    return this.wrapValue(array.slice(start, end));
  }

  rtArrayReverse(arrayValue) {
    const array = this.unwrapValue(arrayValue);
    if (Array.isArray(array)) {
      array.reverse();
    }
    return arrayValue;
  }

  rtArrayFill(arrayValue, value) {
    const array = this.unwrapValue(arrayValue);
    if (Array.isArray(array)) {
      array.fill(value);
    }
    return arrayValue;
  }

  rtArraySort(arrayValue) {
    const array = this.unwrapValue(arrayValue);
    array.sort((left, right) => {
      const l = this.unwrapValue(left);
      const r = this.unwrapValue(right);
      if (typeof l === "bigint" && typeof r === "bigint") {
        return l < r ? -1 : l > r ? 1 : 0;
      }
      const ls = this.stringValue(left);
      const rs = this.stringValue(right);
      return ls.localeCompare(rs);
    });
    return arrayValue;
  }

  rtArrayGetFast(arrayValue, indexValue) {
    const array = this.unwrapValue(arrayValue);
    if (!Array.isArray(array)) {
      return 0n;
    }
    const index = Math.trunc(this.numericValue(indexValue));
    return array[index] ?? 0n;
  }

  rtArraySetFast(arrayValue, indexValue, value) {
    const array = this.unwrapValue(arrayValue);
    if (Array.isArray(array)) {
      const index = Math.trunc(this.numericValue(indexValue));
      array[index] = value;
    }
    return value;
  }

  createPromiseRecord() {
    return {
      __kind: "Promise",
      state: "pending",
      value: 0n,
      error: 0n,
      handlers: [],
    };
  }

  getPromiseRecord(value) {
    const raw = this.unwrapValue(value);
    if (raw && typeof raw === "object" && raw.__kind === "Promise") {
      return raw;
    }
    return null;
  }

  settlePromise(promise, state, value) {
    if (!promise || promise.state !== "pending") {
      return;
    }

    promise.state = state;
    if (state === "fulfilled") {
      promise.value = value;
    } else {
      promise.error = value;
    }

    for (const handler of promise.handlers) {
      if (state === "fulfilled") {
        this.rtPromiseResolve(handler.next, value);
      } else {
        this.rtPromiseReject(handler.next, value);
      }
    }
    promise.handlers = [];
  }

  rtPromiseNew() {
    return this.wrapValue(this.createPromiseRecord());
  }

  rtPromiseResolve(promiseValue, value) {
    const promise = this.getPromiseRecord(promiseValue);
    if (!promise) {
      return value;
    }
    this.settlePromise(promise, "fulfilled", value);
    return value;
  }

  rtPromiseReject(promiseValue, errorValue) {
    const promise = this.getPromiseRecord(promiseValue);
    if (!promise) {
      return errorValue;
    }
    this.settlePromise(promise, "rejected", errorValue);
    return errorValue;
  }

  rtPromiseThen(promiseValue, _onResolve, _onReject) {
    const nextPromise = this.rtPromiseNew();
    const promise = this.getPromiseRecord(promiseValue);
    if (!promise) {
      return nextPromise;
    }

    if (promise.state === "fulfilled") {
      this.rtPromiseResolve(nextPromise, promise.value);
      return nextPromise;
    }
    if (promise.state === "rejected") {
      this.rtPromiseReject(nextPromise, promise.error);
      return nextPromise;
    }

    promise.handlers.push({ next: nextPromise });
    return nextPromise;
  }

  rtMapNew() {
    return this.wrapValue(new HostMap());
  }

  rtMapSet(mapValue, key, value) {
    const map = this.unwrapValue(mapValue);
    map.entries.set(this.mapKey(key), { key, value });
    return value;
  }

  rtMapGet(mapValue, key) {
    const map = this.unwrapValue(mapValue);
    return map.entries.get(this.mapKey(key))?.value ?? 0n;
  }

  rtMapHas(mapValue, key) {
    const map = this.unwrapValue(mapValue);
    return map.entries.has(this.mapKey(key)) ? 1n : 0n;
  }

  rtMapDelete(mapValue, key) {
    const map = this.unwrapValue(mapValue);
    return map.entries.delete(this.mapKey(key)) ? 1n : 0n;
  }

  rtMapKeys(mapValue) {
    const map = this.unwrapValue(mapValue);
    return this.wrapValue(Array.from(map.entries.values(), (entry) => entry.key));
  }

  rtMapValues(mapValue) {
    const map = this.unwrapValue(mapValue);
    return this.wrapValue(Array.from(map.entries.values(), (entry) => entry.value));
  }

  rtMapSize(mapValue) {
    const map = this.unwrapValue(mapValue);
    return BigInt(map.entries.size);
  }

  ensureCollectionObject(self, kind) {
    const obj = this.unwrapValue(self);
    if (!obj || typeof obj !== "object") {
      throw new Error(`Invalid ${kind} instance`);
    }
    if (!obj.__kind) {
      obj.__kind = kind;
    }
    return obj;
  }

  stackConstructor(self) {
    const obj = this.ensureCollectionObject(self, "Stack");
    obj.items = [];
    return self;
  }

  stackPush(self, value) {
    const obj = this.ensureCollectionObject(self, "Stack");
    obj.items.push(value);
    return BigInt(obj.items.length);
  }

  stackPop(self) {
    const obj = this.ensureCollectionObject(self, "Stack");
    return obj.items.length ? obj.items.pop() : 0n;
  }

  stackPeek(self) {
    const obj = this.ensureCollectionObject(self, "Stack");
    return obj.items.length ? obj.items[obj.items.length - 1] : 0n;
  }

  stackSize(self) {
    const obj = this.ensureCollectionObject(self, "Stack");
    return BigInt(obj.items.length);
  }

  stackIsEmpty(self) {
    const obj = this.ensureCollectionObject(self, "Stack");
    return obj.items.length === 0 ? 1n : 0n;
  }

  stackClear(self) {
    const obj = this.ensureCollectionObject(self, "Stack");
    obj.items = [];
    return 0n;
  }

  queueConstructor(self) {
    const obj = this.ensureCollectionObject(self, "Queue");
    obj.items = [];
    return self;
  }

  queueEnqueue(self, value) {
    const obj = this.ensureCollectionObject(self, "Queue");
    obj.items.push(value);
    return BigInt(obj.items.length);
  }

  queueDequeue(self) {
    const obj = this.ensureCollectionObject(self, "Queue");
    return obj.items.length ? obj.items.shift() : 0n;
  }

  queuePeek(self) {
    const obj = this.ensureCollectionObject(self, "Queue");
    return obj.items.length ? obj.items[0] : 0n;
  }

  queueSize(self) {
    const obj = this.ensureCollectionObject(self, "Queue");
    return BigInt(obj.items.length);
  }

  queueIsEmpty(self) {
    const obj = this.ensureCollectionObject(self, "Queue");
    return obj.items.length === 0 ? 1n : 0n;
  }

  queueClear(self) {
    const obj = this.ensureCollectionObject(self, "Queue");
    obj.items = [];
    return 0n;
  }

  mapConstructor(self) {
    const obj = this.ensureCollectionObject(self, "Map");
    obj.map = new HostMap();
    return self;
  }

  mapMethodSet(self, key, value) {
    const obj = this.ensureCollectionObject(self, "Map");
    obj.map.entries.set(this.mapKey(key), { key, value });
    return value;
  }

  mapMethodGet(self, key) {
    const obj = this.ensureCollectionObject(self, "Map");
    return obj.map.entries.get(this.mapKey(key))?.value ?? 0n;
  }

  mapMethodHas(self, key) {
    const obj = this.ensureCollectionObject(self, "Map");
    return obj.map.entries.has(this.mapKey(key)) ? 1n : 0n;
  }

  mapMethodDelete(self, key) {
    const obj = this.ensureCollectionObject(self, "Map");
    return obj.map.entries.delete(this.mapKey(key)) ? 1n : 0n;
  }

  mapMethodKeys(self) {
    const obj = this.ensureCollectionObject(self, "Map");
    return this.wrapValue(Array.from(obj.map.entries.values(), (entry) => entry.key));
  }

  mapMethodValues(self) {
    const obj = this.ensureCollectionObject(self, "Map");
    return this.wrapValue(Array.from(obj.map.entries.values(), (entry) => entry.value));
  }

  mapMethodSize(self) {
    const obj = this.ensureCollectionObject(self, "Map");
    return BigInt(obj.map.entries.size);
  }

  mapMethodClear(self) {
    const obj = this.ensureCollectionObject(self, "Map");
    obj.map = new HostMap();
    return 0n;
  }

  setConstructor(self) {
    const obj = this.ensureCollectionObject(self, "Set");
    obj.set = new Map();
    return self;
  }

  setAdd(self, value) {
    const obj = this.ensureCollectionObject(self, "Set");
    obj.set.set(this.mapKey(value), value);
    return value;
  }

  setHas(self, value) {
    const obj = this.ensureCollectionObject(self, "Set");
    return obj.set.has(this.mapKey(value)) ? 1n : 0n;
  }

  setDelete(self, value) {
    const obj = this.ensureCollectionObject(self, "Set");
    return obj.set.delete(this.mapKey(value)) ? 1n : 0n;
  }

  setValues(self) {
    const obj = this.ensureCollectionObject(self, "Set");
    return this.wrapValue(Array.from(obj.set.values()));
  }

  setSize(self) {
    const obj = this.ensureCollectionObject(self, "Set");
    return BigInt(obj.set.size);
  }

  setClear(self) {
    const obj = this.ensureCollectionObject(self, "Set");
    obj.set = new Map();
    return 0n;
  }

  rtObjectKeys(objValue) {
    const obj = this.unwrapValue(objValue);
    return this.wrapValue(this.visibleEntries(obj).map(([key]) => this.wrapValue(key)));
  }

  rtObjectValues(objValue) {
    const obj = this.unwrapValue(objValue);
    return this.wrapValue(this.visibleEntries(obj).map(([, value]) => value));
  }

  rtObjectEntries(objValue) {
    const obj = this.unwrapValue(objValue);
    return this.wrapValue(
      this.visibleEntries(obj).map(([key, value]) => this.wrapValue([this.wrapValue(key), value])),
    );
  }

  rtObjectAssign(targetValue, sourceValue) {
    const target = this.unwrapValue(targetValue);
    const source = this.unwrapValue(sourceValue);
    Object.assign(target, source);
    return targetValue;
  }

  rtObjectMerge(targetValue, sourceValue) {
    return this.rtObjectAssign(targetValue, sourceValue);
  }

  rtObjectFreeze(objValue) {
    const obj = this.unwrapValue(objValue);
    Object.freeze(obj);
    return objValue;
  }

  stdMathAbs(value) {
    return this.wrapValue(Math.abs(this.numericValue(value)));
  }

  stdMathSin(value) {
    return this.wrapValue(Math.sin(this.numericValue(value)));
  }

  stdMathCos(value) {
    return this.wrapValue(Math.cos(this.numericValue(value)));
  }

  stdMathSqrt(value) {
    return this.wrapValue(Math.sqrt(this.numericValue(value)));
  }

  stdMathFloor(value) {
    return this.wrapValue(Math.floor(this.numericValue(value)));
  }

  stdMathCeil(value) {
    return this.wrapValue(Math.ceil(this.numericValue(value)));
  }

  stdMathRound(value) {
    return this.wrapValue(Math.round(this.numericValue(value)));
  }

  stdMathPow(base, exponent) {
    return this.wrapValue(Math.pow(this.numericValue(base), this.numericValue(exponent)));
  }

  rtMathRandom() {
    return this.wrapValue(Math.random());
  }

  rtTimeNow() {
    return BigInt(Date.now());
  }

  rtTimeNowMs() {
    return BigInt(Date.now());
  }

  rtDelay(msValue) {
    const promiseValue = this.rtPromiseNew();
    const delay = Math.max(0, this.numericValue(msValue));
    setTimeout(() => {
      this.rtPromiseResolve(promiseValue, 0n);
    }, delay);
    return promiseValue;
  }

  rtArgs() {
    return this.wrapValue([]);
  }

  rtGetenv(_name) {
    return 0n;
  }

  fsPath(value) {
    const raw = this.stringValue(value).trim();
    if (!raw) {
      return ".";
    }
    const normalized = raw
      .replace(/\\/g, "/")
      .replace(/\/+/g, "/")
      .replace(/\/$/, "");
    return normalized || "/";
  }

  rtFsReadSync(pathValue) {
    const path = this.fsPath(pathValue);
    const entry = this.fs.get(path);
    if (!entry || entry.kind !== "file") {
      throw new Error(`ENOENT: ${path}`);
    }
    return this.wrapValue(entry.content);
  }

  rtFsWriteSync(pathValue, contentValue) {
    const path = this.fsPath(pathValue);
    this.fs.set(path, { kind: "file", content: this.stringValue(contentValue) });
    return 1n;
  }

  rtFsAppendSync(pathValue, contentValue) {
    const path = this.fsPath(pathValue);
    const existing = this.fs.get(path);
    const prefix = existing && existing.kind === "file" ? existing.content : "";
    this.fs.set(path, { kind: "file", content: prefix + this.stringValue(contentValue) });
    return 1n;
  }

  rtFsExists(pathValue) {
    return this.fs.has(this.fsPath(pathValue)) ? 1n : 0n;
  }

  rtFsUnlinkSync(pathValue) {
    const path = this.fsPath(pathValue);
    const entry = this.fs.get(path);
    if (!entry || entry.kind !== "file") {
      return 0n;
    }
    this.fs.delete(path);
    return 1n;
  }

  rtFsMkdirSync(pathValue) {
    const path = this.fsPath(pathValue);
    this.fs.set(path, { kind: "dir" });
    return 1n;
  }

  rtFsReaddirSync(pathValue) {
    const basePath = this.fsPath(pathValue);
    const prefix = basePath === "/" ? "/" : `${basePath}/`;
    const entries = [];
    const seen = new Set();

    for (const candidate of this.fs.keys()) {
      if (candidate === basePath || !candidate.startsWith(prefix)) {
        continue;
      }
      const rest = candidate.slice(prefix.length);
      if (!rest) {
        continue;
      }
      const child = rest.split("/")[0];
      if (child && !seen.has(child)) {
        seen.add(child);
        entries.push(this.wrapValue(child));
      }
    }

    return this.wrapValue(entries);
  }

  rtExit(code) {
    throw new Error(`Program exited with code ${this.numericValue(code)}`);
  }
}

export class TejxCompiler {
  constructor(instance) {
    this.instance = instance;
    this.memory = instance.exports.memory;
    this.decoder = new TextDecoder();
    this.encoder = new TextEncoder();
  }

  static async fromBytes(bytes, options = {}) {
    let memory = null;
    const decoder = new TextDecoder();
    const compilerLog = (ptr, len) => {
      if (!memory) {
        return;
      }
      const bytes = new Uint8Array(memory.buffer, ptr, len);
      options.onLog?.(decoder.decode(bytes));
    };
    const { instance } = await WebAssembly.instantiate(bytes, {
      env: {
        tejx_compiler_log: compilerLog,
        compiler_log: compilerLog,
      },
    });
    memory = instance.exports.memory;
    return new TejxCompiler(instance);
  }

  static async fromUrl(url, options = {}) {
    const response = await fetch(url, { cache: "no-cache" });
    const bytes = await response.arrayBuffer();
    return TejxCompiler.fromBytes(bytes, options);
  }

  allocCString(text) {
    const bytes = this.encoder.encode(`${text}\0`);
    const ptr = this.instance.exports.tejx_alloc(bytes.length);
    new Uint8Array(this.memory.buffer, ptr, bytes.length).set(bytes);
    return { ptr, size: bytes.length };
  }

  readCString(ptr) {
    const memory = new Uint8Array(this.memory.buffer);
    let end = ptr;
    while (memory[end] !== 0) {
      end += 1;
    }
    return this.decoder.decode(memory.subarray(ptr, end));
  }

  withCString(value, callback) {
    const { ptr, size } = this.allocCString(value);
    try {
      return callback(ptr);
    } finally {
      this.instance.exports.tejx_free(ptr, size);
    }
  }

  compileToWatReport(source, filename = "main.tx", config = {}) {
    return this.withCString(source, (sourcePtr) =>
      this.withCString(filename, (filenamePtr) =>
        this.withCString(JSON.stringify(config), (configPtr) => {
          if (typeof this.instance.exports.compile_to_wat_json_raw === "function") {
            const resultPtr = this.instance.exports.compile_to_wat_json_raw(
              sourcePtr,
              filenamePtr,
              configPtr,
            );
            try {
              return JSON.parse(this.readCString(resultPtr));
            } finally {
              if (typeof this.instance.exports.tejx_cstring_free === "function") {
                this.instance.exports.tejx_cstring_free(resultPtr);
              }
            }
          }

          const resultPtr = this.instance.exports.compile_to_wat_raw(
            sourcePtr,
            filenamePtr,
            configPtr,
          );
          const payload = this.readCString(resultPtr);

          if (payload.startsWith("ERROR:")) {
            const rawError = payload.slice("ERROR:".length);
            try {
              return JSON.parse(rawError);
            } catch {
              return {
                ok: false,
                message: rawError,
                full_error: rawError,
                stage: "compile",
              };
            }
          }

          return {
            ok: true,
            wat: payload,
          };
        }),
      ),
    );
  }

  compileToProgramWasm(source, filename = "main.tx", config = {}) {
    return this.withCString(source, (sourcePtr) =>
      this.withCString(filename, (filenamePtr) =>
        this.withCString(JSON.stringify(config), (configPtr) => {
          const outLenSize = 4;
          const outLenPtr = this.instance.exports.tejx_alloc(outLenSize);
          try {
            new DataView(this.memory.buffer).setUint32(outLenPtr, 0, true);
            const wasmPtr = this.instance.exports.compile_to_wasm_raw(
              sourcePtr,
              filenamePtr,
              configPtr,
              outLenPtr,
            );
            const length = new DataView(this.memory.buffer).getUint32(
              outLenPtr,
              true,
            );
            if (!wasmPtr || !length) {
              const report = this.compileToWatReport(source, filename, config);
              const message = report.ok
                ? "Compiler produced no wasm bytes"
                : report.full_error || report.message || "Compilation failed";
              throw new Error(message);
            }

            try {
              return new Uint8Array(this.memory.buffer.slice(wasmPtr, wasmPtr + length));
            } finally {
              this.instance.exports.tejx_free(wasmPtr, length);
            }
          } finally {
            this.instance.exports.tejx_free(outLenPtr, outLenSize);
          }
        }),
      ),
    );
  }

  async compileAndInstantiate(source, options = {}) {
    const filename = options.filename ?? "main.tx";
    const config = options.config ?? {};
    const wasmBytes = this.compileToProgramWasm(source, filename, config);
    const host = new TejxProgramHost(options);
    await host.instantiate(wasmBytes);
    return host;
  }
}
