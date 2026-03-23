// @ts-expect-error Upstream browser runtime is copied in as a plain .mjs module.
import { TejxCompiler as BrowserTejxCompiler } from "./browserRuntime.mjs";

export interface CompilerResult {
  output: string[];
  success: boolean;
  binary?: Uint8Array;
}

interface CompileReport {
  ok?: boolean;
  wat?: string;
  full_error?: string;
  message?: string;
  stage?: string;
}

interface ProgramHost {
  unsupportedCalls: Set<string>;
  runMain(): unknown;
}

interface BrowserCompiler {
  compileToWatReport(
    source: string,
    filename?: string,
    config?: Record<string, unknown>,
  ): CompileReport;
  compileAndInstantiate(
    source: string,
    options?: {
      filename?: string;
      config?: Record<string, unknown>;
      compileReport?: CompileReport;
      onOutput?: (line: string) => void;
    },
  ): Promise<ProgramHost>;
}

interface BrowserCompilerConstructor {
  fromUrl(
    url: string | URL,
    options?: { onLog?: (line: string) => void },
  ): Promise<BrowserCompiler>;
}

const BrowserCompilerApi = BrowserTejxCompiler as BrowserCompilerConstructor;

const STD_JSON_IMPORT_PATTERN =
  /^([ \t]*)import\s*\{([^}]*)\}\s*from\s*["']std:json["'];?[ \t]*$/gm;
const STD_FS_NAMED_IMPORT_PATTERN =
  /^([ \t]*)import\s*\{([^}]*)\}\s*from\s*["']std:fs["'];?[ \t]*$/gm;
const STD_FS_NAMESPACE_IMPORT_PATTERN =
  /^([ \t]*)import\s+std:fs\s*;?[ \t]*$/gm;

const BROWSER_STD_JSON_SHIM = String.raw`// Browser playground shim for named std:json imports.
function __tejx_browser_json_escape_string(str: string): string {
    let res = "\"";
    let len = str.length();
    for (let i = 0; i < len; i++) {
        let ch = str[i];
        if (ch == "\"") res = res + "\\\"";
        else if (ch == "\\") res = res + "\\\\";
        else if (ch == "\b") res = res + "\\b";
        else if (ch == "\f") res = res + "\\f";
        else if (ch == "\n") res = res + "\\n";
        else if (ch == "\r") res = res + "\\r";
        else if (ch == "\t") res = res + "\\t";
        else res = res + ch;
    }
    return res + "\"";
}

function __tejx_browser_json_serialize(val: any, out: string[], seen: any[], indent: string, gap: string) {
    if (typeof(val) == "object" && val != None) {
        if (typeof(val["toJSON"]) == "function") {
            val = val.toJSON();
        }
    }

    if (val == None) {
        out.push("null");
        return;
    }

    let ty = typeof(val);
    if (ty == "string") {
        out.push(__tejx_browser_json_escape_string(val as string));
        return;
    }
    if (ty == "int" || ty == "float" || ty == "bool") {
        out.push(rt_to_string(val));
        return;
    }

    if (ty == "object" || rt_is_array(val)) {
        let seenLen = seen.length();
        for (let i = 0; i < seenLen; i++) {
            if (seen[i] == val) {
                out.push("\"[Circular Reference]\"");
                return;
            }
        }
        seen.push(val);
    }

    let step = indent + gap;
    let isPretty = gap.length() > 0;

    if (rt_is_array(val)) {
        let arr = val as any[];
        let len = arr.length();
        if (len == 0) {
            out.push("[]");
        } else {
            out.push("[");
            if (isPretty) out.push("\n");
            for (let i = 0; i < len; i++) {
                if (isPretty) out.push(step);
                __tejx_browser_json_serialize(arr[i], out, seen, step, gap);
                if (i < len - 1) {
                    out.push(",");
                    if (isPretty) out.push("\n");
                }
            }
            if (isPretty) {
                out.push("\n");
                out.push(indent);
            }
            out.push("]");
        }
        seen.pop();
        return;
    }

    if (ty == "object") {
        let keys = Object.keys(val);
        let len = keys.length();
        if (len == 0) {
            out.push("{}");
        } else {
            out.push("{");
            if (isPretty) out.push("\n");
            let added = false;
            for (let i = 0; i < len; i++) {
                let k = keys[i];
                if (k == "toString" || k == "constructor" || k == "__proto__") continue;

                let childVal: any = val[k];
                if (typeof(childVal) == "function" || childVal == undefined) continue;

                if (added) {
                    out.push(",");
                    if (isPretty) out.push("\n");
                }

                if (isPretty) out.push(step);
                out.push(__tejx_browser_json_escape_string(k));
                out.push(isPretty ? ": " : ":");
                __tejx_browser_json_serialize(childVal, out, seen, step, gap);
                added = true;
            }
            if (isPretty && added) {
                out.push("\n");
                out.push(indent);
            }
            out.push("}");
        }
        seen.pop();
        return;
    }

    out.push("null");
}

function __tejx_browser_json_stringify(val: any, space: any = None): string {
    let out: string[] = [];
    let seen: any[] = [];
    let gap = "";

    if (typeof(space) == "number") {
        let spaces = space as float;
        if (spaces > 10) spaces = 10;
        for (let i = 0; i < spaces; i++) gap = gap + " ";
    } else if (typeof(space) == "string") {
        gap = space as string;
        if (gap.length() > 10) gap = gap.substring(0, 10);
    }

    __tejx_browser_json_serialize(val, out, seen, "", gap);
    return out.join("");
}

function __tejx_browser_json_skip_whitespace(state: any[]) {
    let source: string = state[0] as string;
    while ((state[1] as int) < (state[2] as int)) {
        let ch = source[state[1] as int];
        if (" \n\t\rx".includes(ch)) {
            state[1] = (state[1] as int) + 1;
        } else {
            return;
        }
    }
}

function __tejx_browser_json_parse_string(state: any[]): string {
    let source: string = state[0] as string;
    state[1] = (state[1] as int) + 1;
    let res = "";

    while ((state[1] as int) < (state[2] as int)) {
        let ch = source[state[1] as int];
        if (ch == "\"") {
            state[1] = (state[1] as int) + 1;
            return res;
        }
        if (ch == "\\") {
            state[1] = (state[1] as int) + 1;
            if ((state[1] as int) >= (state[2] as int)) {
                break;
            }
            let esc = source[state[1] as int];
            if (esc == "\"") res = res + "\"";
            else if (esc == "\\") res = res + "\\";
            else if (esc == "/") res = res + "/";
            else if (esc == "b") res = res + "\b";
            else if (esc == "f") res = res + "\f";
            else if (esc == "n") res = res + "\n";
            else if (esc == "r") res = res + "\r";
            else if (esc == "t") res = res + "\t";
            else res = res + esc;
        } else {
            res = res + ch;
        }
        state[1] = (state[1] as int) + 1;
    }

    throw new Error("SyntaxError: Unterminated string in JSON");
}

function __tejx_browser_json_parse_number(state: any[]): any {
    let source: string = state[0] as string;
    let start: int = state[1] as int;

    if ((state[1] as int) < (state[2] as int) && source[state[1] as int] == "-") {
        state[1] = (state[1] as int) + 1;
    }

    while ((state[1] as int) < (state[2] as int)) {
        let ch = source[state[1] as int];
        if ("0123456789x".includes(ch)) {
            state[1] = (state[1] as int) + 1;
        } else if (".eEx".includes(ch)) {
            state[1] = (state[1] as int) + 1;
        } else if ((ch == "+" || ch == "-") && (state[1] as int) > start) {
            state[1] = (state[1] as int) + 1;
        } else {
            break;
        }
    }

    if (start == (state[1] as int)) {
        throw new Error("SyntaxError: Expected number");
    }

    let numStr: string = source.substring(start, state[1] as int);
    let value: float = parseFloat(numStr);
    if (numStr.includes(".") || numStr.includes("e") || numStr.includes("E")) {
        return value;
    }
    return value as int;
}

function __tejx_browser_json_parse_literal(state: any[], word: string, returnValue: any): any {
    let source: string = state[0] as string;
    let start: int = state[1] as int;
    let end: int = start + word.length();
    if (source.substring(start, end) == word) {
        state[1] = end;
        return returnValue;
    }
    throw new Error("SyntaxError: Unexpected token in JSON");
}

function __tejx_browser_json_parse_array(state: any[]): any[] {
    let source: string = state[0] as string;
    state[1] = (state[1] as int) + 1;
    let res: any[] = [];
    __tejx_browser_json_skip_whitespace(state);

    if ((state[1] as int) < (state[2] as int) && source[state[1] as int] == "]") {
        state[1] = (state[1] as int) + 1;
        return res;
    }

    while ((state[1] as int) < (state[2] as int)) {
        let item: any = __tejx_browser_json_parse_value(state);
        res.push(item);
        __tejx_browser_json_skip_whitespace(state);

        if ((state[1] as int) >= (state[2] as int)) {
            break;
        }

        let ch = source[state[1] as int];
        if (ch == ",") {
            state[1] = (state[1] as int) + 1;
            __tejx_browser_json_skip_whitespace(state);
        } else if (ch == "]") {
            state[1] = (state[1] as int) + 1;
            return res;
        } else {
            throw new Error("SyntaxError: Expected ',' or ']' in array");
        }
    }

    throw new Error("SyntaxError: Unterminated array in JSON");
}

function __tejx_browser_json_parse_object(state: any[]): any {
    let source: string = state[0] as string;
    state[1] = (state[1] as int) + 1;
    let res: any = {};
    __tejx_browser_json_skip_whitespace(state);

    if ((state[1] as int) < (state[2] as int) && source[state[1] as int] == "}") {
        state[1] = (state[1] as int) + 1;
        return res;
    }

    while ((state[1] as int) < (state[2] as int)) {
        if (source[state[1] as int] != "\"") {
            throw new Error("SyntaxError: Expected string key in object");
        }

        let key = __tejx_browser_json_parse_string(state);
        __tejx_browser_json_skip_whitespace(state);

        if ((state[1] as int) >= (state[2] as int) || source[state[1] as int] != ":") {
            throw new Error("SyntaxError: Expected ':' after object key");
        }

        state[1] = (state[1] as int) + 1;
        let value: any = __tejx_browser_json_parse_value(state);
        res[key] = value;
        __tejx_browser_json_skip_whitespace(state);

        if ((state[1] as int) >= (state[2] as int)) {
            break;
        }

        let ch = source[state[1] as int];
        if (ch == ",") {
            state[1] = (state[1] as int) + 1;
            __tejx_browser_json_skip_whitespace(state);
        } else if (ch == "}") {
            state[1] = (state[1] as int) + 1;
            return res;
        } else {
            throw new Error("SyntaxError: Expected ',' or '}' in object");
        }
    }

    throw new Error("SyntaxError: Unterminated object in JSON");
}

function __tejx_browser_json_parse_value(state: any[]): any {
    let source: string = state[0] as string;
    __tejx_browser_json_skip_whitespace(state);
    if ((state[1] as int) >= (state[2] as int)) {
        throw new Error("SyntaxError: Unexpected end of JSON input");
    }

    let ch = source[state[1] as int];
    if (ch == "\"") return __tejx_browser_json_parse_string(state);
    if (ch == "[") return __tejx_browser_json_parse_array(state);
    if (ch == "{") return __tejx_browser_json_parse_object(state);
    if (ch == "t") return __tejx_browser_json_parse_literal(state, "true", true);
    if (ch == "f") return __tejx_browser_json_parse_literal(state, "false", false);
    if (ch == "n") return __tejx_browser_json_parse_literal(state, "null", None);
    return __tejx_browser_json_parse_number(state);
}

function __tejx_browser_json_parse(s: string): any {
    let state: any[] = [s, 0, s.length()];
    let result: any = __tejx_browser_json_parse_value(state);
    __tejx_browser_json_skip_whitespace(state);
    if ((state[1] as int) < (state[2] as int)) {
        throw new Error("SyntaxError: Unexpected trailing characters in JSON");
    }
    return result;
}`;

const BROWSER_STD_FS_SHIM = String.raw`// Browser playground shim for std:fs imports.
function __tejx_browser_fs_existsSync(path: string): bool {
    return rt_fs_exists(path) != 0;
}

function __tejx_browser_fs_readFileSync(path: string): string {
    return rt_fs_read_sync(path);
}

function __tejx_browser_fs_writeFileSync(path: string, content: string): bool {
    return rt_fs_write_sync(path, content) == 1;
}

function __tejx_browser_fs_appendFileSync(path: string, content: string): bool {
    return rt_fs_append_sync(path, content) == 1;
}

function __tejx_browser_fs_unlinkSync(path: string): bool {
    return rt_fs_unlink_sync(path) == 1;
}

function __tejx_browser_fs_mkdirSync(path: string): bool {
    return rt_fs_mkdir_sync(path) == 1;
}

function __tejx_browser_fs_readdirSync(path: string): string[] {
    return rt_fs_readdir_sync(path);
}

async function __tejx_browser_fs_readFile(path: string): Promise<string> {
    return __tejx_browser_fs_readFileSync(path);
}

async function __tejx_browser_fs_writeFile(path: string, content: string): Promise<bool> {
    return __tejx_browser_fs_writeFileSync(path, content);
}

function __tejx_browser_fs_read_to_string(path: string): string {
    return __tejx_browser_fs_readFileSync(path);
}

function __tejx_browser_fs_mkdir(path: string): bool {
    return __tejx_browser_fs_mkdirSync(path);
}`;

const STD_FS_NAMESPACE_MEMBERS = {
  existsSync: "__tejx_browser_fs_existsSync",
  readFileSync: "__tejx_browser_fs_readFileSync",
  writeFileSync: "__tejx_browser_fs_writeFileSync",
  appendFileSync: "__tejx_browser_fs_appendFileSync",
  unlinkSync: "__tejx_browser_fs_unlinkSync",
  mkdirSync: "__tejx_browser_fs_mkdirSync",
  readdirSync: "__tejx_browser_fs_readdirSync",
  readFile: "__tejx_browser_fs_readFile",
  writeFile: "__tejx_browser_fs_writeFile",
} as const;

const DECIMAL_LITERAL_PATTERN = /\b\d+\.\d+(?:[eE][+-]?\d+)?\b/;
const SUSPICIOUS_FLOAT_OUTPUT_PATTERN = /\b-?\d{16,}\b/;

type FallbackFsEntry = { kind: "dir" } | { kind: "file"; content: string };
type JsFallbackHelpers = {
  len: (value: unknown) => number;
  print: (...args: unknown[]) => void;
  stdFs: ReturnType<typeof createJsFallbackStdFs>;
  stdJson: {
    parse: (input: string) => unknown;
    stringify: (value: unknown, space?: unknown) => string;
  };
};

function parseNamedImportSpecifier(specifier: string) {
  const match = specifier
    .trim()
    .match(/^([A-Za-z_]\w*)(?:\s+as\s+([A-Za-z_]\w*))?$/);

  if (!match) {
    return null;
  }

  return {
    imported: match[1],
    local: match[2] ?? match[1],
  };
}

function buildJsImportDestructuring(specifierBlock: string) {
  const members: string[] = [];

  for (const rawSpecifier of specifierBlock.split(",")) {
    const parsed = parseNamedImportSpecifier(rawSpecifier);
    if (!parsed) {
      return null;
    }

    members.push(
      parsed.imported === parsed.local
        ? parsed.imported
        : `${parsed.imported}: ${parsed.local}`,
    );
  }

  return members.join(", ");
}

function buildBrowserStdJsonAlias(imported: string, local: string) {
  if (imported === "parse") {
    return `function ${local}(s: string): any { return __tejx_browser_json_parse(s); }`;
  }

  if (imported === "stringify") {
    return `function ${local}(val: any, space: any = None): string { return __tejx_browser_json_stringify(val, space); }`;
  }

  return null;
}

function buildBrowserStdFsAlias(imported: string, local: string) {
  switch (imported) {
    case "existsSync":
      return `function ${local}(path: string): bool { return __tejx_browser_fs_existsSync(path); }`;
    case "readFileSync":
      return `function ${local}(path: string): string { return __tejx_browser_fs_readFileSync(path); }`;
    case "writeFileSync":
      return `function ${local}(path: string, content: string): bool { return __tejx_browser_fs_writeFileSync(path, content); }`;
    case "appendFileSync":
      return `function ${local}(path: string, content: string): bool { return __tejx_browser_fs_appendFileSync(path, content); }`;
    case "unlinkSync":
      return `function ${local}(path: string): bool { return __tejx_browser_fs_unlinkSync(path); }`;
    case "mkdirSync":
      return `function ${local}(path: string): bool { return __tejx_browser_fs_mkdirSync(path); }`;
    case "readdirSync":
      return `function ${local}(path: string): string[] { return __tejx_browser_fs_readdirSync(path); }`;
    case "readFile":
      return `async function ${local}(path: string): Promise<string> { return __tejx_browser_fs_readFile(path); }`;
    case "writeFile":
      return `async function ${local}(path: string, content: string): Promise<bool> { return __tejx_browser_fs_writeFile(path, content); }`;
    case "read_to_string":
      return `function ${local}(path: string): string { return __tejx_browser_fs_read_to_string(path); }`;
    case "mkdir":
      return `function ${local}(path: string): bool { return __tejx_browser_fs_mkdir(path); }`;
    default:
      return null;
  }
}

function transformBrowserStdJson(source: string) {
  const aliasFunctions: string[] = [];
  let usesBrowserShim = false;

  const transformed = source.replace(
    STD_JSON_IMPORT_PATTERN,
    (_match: string, indent: string, specifierBlock: string) => {
      void _match;
      const remaining: string[] = [];

      for (const rawSpecifier of specifierBlock.split(",")) {
        const parsed = parseNamedImportSpecifier(rawSpecifier);
        if (!parsed) {
          remaining.push(rawSpecifier.trim());
          continue;
        }

        if (parsed.imported === "parse" || parsed.imported === "stringify") {
          const alias = buildBrowserStdJsonAlias(parsed.imported, parsed.local);
          if (alias) {
            aliasFunctions.push(alias);
            usesBrowserShim = true;
          }
          continue;
        }

        remaining.push(rawSpecifier.trim());
      }

      if (remaining.length === 0) {
        return "";
      }

      return `${indent}import { ${remaining.join(", ")} } from "std:json";`;
    },
  );

  if (!usesBrowserShim) {
    return source;
  }

  const aliasBlock = aliasFunctions.join("\n");
  return `${BROWSER_STD_JSON_SHIM}\n${aliasBlock}\n\n${transformed}`;
}

function rewriteBrowserStdFsNamespaceUsages(source: string) {
  let rewritten = source;

  for (const [member, replacement] of Object.entries(
    STD_FS_NAMESPACE_MEMBERS,
  )) {
    const pattern = new RegExp(`\\bfs\\s*\\.\\s*${member}\\b`, "g");
    rewritten = rewritten.replace(pattern, replacement);
  }

  return rewritten;
}

function transformBrowserStdFs(source: string) {
  const aliasFunctions: string[] = [];
  let usesBrowserShim = false;
  let transformed = source;

  transformed = transformed.replace(STD_FS_NAMESPACE_IMPORT_PATTERN, () => {
    usesBrowserShim = true;
    return "";
  });

  transformed = transformed.replace(
    STD_FS_NAMED_IMPORT_PATTERN,
    (_match: string, _indent: string, specifierBlock: string) => {
      for (const rawSpecifier of specifierBlock.split(",")) {
        const parsed = parseNamedImportSpecifier(rawSpecifier);
        if (!parsed) {
          continue;
        }

        const alias = buildBrowserStdFsAlias(parsed.imported, parsed.local);
        if (alias) {
          aliasFunctions.push(alias);
          usesBrowserShim = true;
        }
      }

      return "";
    },
  );

  if (!usesBrowserShim) {
    return source;
  }

  transformed = rewriteBrowserStdFsNamespaceUsages(transformed);
  const aliasBlock = aliasFunctions.join("\n");
  return `${BROWSER_STD_FS_SHIM}\n${aliasBlock}\n\n${transformed}`;
}

export function transformBrowserPlaygroundSource(source: string) {
  return transformBrowserStdJson(transformBrowserStdFs(source));
}

function formatJsFallbackNumber(value: number) {
  if (Number.isNaN(value)) {
    return "NaN";
  }

  if (!Number.isFinite(value)) {
    return value > 0 ? "Infinity" : "-Infinity";
  }

  return Number.isInteger(value) ? value.toFixed(0) : `${value}`;
}

function formatJsFallbackValue(
  value: unknown,
  options: { quoteStrings?: boolean; seen?: WeakSet<object> } = {},
): string {
  const quoteStrings = options.quoteStrings ?? false;
  const seen = options.seen ?? new WeakSet<object>();

  if (value === null || value === undefined) {
    return "None";
  }

  if (typeof value === "string") {
    return quoteStrings ? JSON.stringify(value) : value;
  }

  if (typeof value === "number") {
    return formatJsFallbackNumber(value);
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }

    seen.add(value);
    const rendered = `[${value
      .map((item) => formatJsFallbackValue(item, { quoteStrings: true, seen }))
      .join(", ")}]`;
    seen.delete(value);
    return rendered;
  }

  if (typeof value === "object") {
    if (seen.has(value)) {
      return "{ [Circular] }";
    }

    seen.add(value);
    const rendered = `{ ${Object.entries(value)
      .filter(([, child]) => child !== undefined && typeof child !== "function")
      .map(
        ([key, child]) =>
          `${key}: ${formatJsFallbackValue(child, {
            quoteStrings: typeof child === "string",
            seen,
          })}`,
      )
      .join(", ")} }`;
    seen.delete(value);
    return rendered;
  }

  return String(value);
}

function createJsFallbackStdFs() {
  const fs = new Map<string, FallbackFsEntry>([
    ["/", { kind: "dir" }],
    [".", { kind: "dir" }],
  ]);

  const normalizePath = (path: string) => {
    const raw = path.trim();
    if (!raw) {
      return ".";
    }

    const normalized = raw
      .replace(/\\/g, "/")
      .replace(/\/+/g, "/")
      .replace(/\/$/, "");

    return normalized || "/";
  };

  return {
    existsSync(path: string) {
      return fs.has(normalizePath(path));
    },
    readFileSync(path: string) {
      const entry = fs.get(normalizePath(path));
      if (!entry || entry.kind !== "file") {
        throw new Error(`ENOENT: ${path}`);
      }
      return entry.content;
    },
    writeFileSync(path: string, content: string) {
      fs.set(normalizePath(path), { kind: "file", content });
      return true;
    },
    appendFileSync(path: string, content: string) {
      const normalized = normalizePath(path);
      const existing = fs.get(normalized);
      const prefix = existing && existing.kind === "file" ? existing.content : "";
      fs.set(normalized, { kind: "file", content: `${prefix}${content}` });
      return true;
    },
    unlinkSync(path: string) {
      const normalized = normalizePath(path);
      const entry = fs.get(normalized);
      if (!entry || entry.kind !== "file") {
        return false;
      }
      fs.delete(normalized);
      return true;
    },
    mkdirSync(path: string) {
      fs.set(normalizePath(path), { kind: "dir" });
      return true;
    },
    readdirSync(path: string) {
      const basePath = normalizePath(path);
      const prefix = basePath === "/" ? "/" : `${basePath}/`;
      const entries = new Set<string>();

      for (const candidate of fs.keys()) {
        if (candidate === basePath || !candidate.startsWith(prefix)) {
          continue;
        }

        const child = candidate.slice(prefix.length).split("/")[0];
        if (child) {
          entries.add(child);
        }
      }

      return [...entries];
    },
    async readFile(path: string) {
      return this.readFileSync(path);
    },
    async writeFile(path: string, content: string) {
      return this.writeFileSync(path, content);
    },
    read_to_string(path: string) {
      return this.readFileSync(path);
    },
    mkdir(path: string) {
      return this.mkdirSync(path);
    },
  };
}

function stripJsFallbackParamTypes(params: string) {
  if (!params.trim()) {
    return params;
  }

  return params
    .split(",")
    .map((param) =>
      param
        .replace(
          /^\s*([A-Za-z_]\w*)\s*:\s*[A-Za-z_][\w<>, ?|:[\]]*\s*=\s*(.+)\s*$/,
          "$1 = $2",
        )
        .replace(
          /^\s*([A-Za-z_]\w*)\s*:\s*[A-Za-z_][\w<>, ?|:[\]]*\s*$/,
          "$1",
        ),
    )
    .join(", ");
}

function transpileJsFallbackSource(source: string) {
  let unsupportedImport = false;

  let rewritten = source.replace(
    STD_JSON_IMPORT_PATTERN,
    (_match: string, indent: string, specifierBlock: string) => {
      const members = buildJsImportDestructuring(specifierBlock);
      if (!members) {
        unsupportedImport = true;
        return _match;
      }

      return `${indent}const { ${members} } = helpers.stdJson;`;
    },
  );

  rewritten = rewritten.replace(STD_FS_NAMESPACE_IMPORT_PATTERN, () => {
    return "const fs = helpers.stdFs;";
  });

  rewritten = rewritten.replace(
    STD_FS_NAMED_IMPORT_PATTERN,
    (_match: string, indent: string, specifierBlock: string) => {
      const members = buildJsImportDestructuring(specifierBlock);
      if (!members) {
        unsupportedImport = true;
        return _match;
      }

      return `${indent}const { ${members} } = helpers.stdFs;`;
    },
  );

  if (unsupportedImport) {
    return null;
  }

  return rewritten
    .replace(
      /function\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/g,
      (_match: string, name: string, params: string) =>
        `function ${name}(${stripJsFallbackParamTypes(params)})`,
    )
    .replace(/\)\s*:\s*[A-Za-z_][\w<>, ?|:[\]]*(\s*\{)/g, ")$1")
    .replace(
      /\b(let|const|var)\s+([A-Za-z_]\w*)\s*:\s*[A-Za-z_][\w<>, ?|:[\]]*(?=\s*=)/g,
      "$1 $2",
    )
    .replace(/\s+as\s+[A-Za-z_][\w<>, ?|:[\]]*/g, "")
    .replace(/\bNone\b/g, "null");
}

function shouldUseJsFloatFallback(source: string, output: string[]) {
  return (
    DECIMAL_LITERAL_PATTERN.test(source) &&
    output.some((line) => SUSPICIOUS_FLOAT_OUTPUT_PATTERN.test(line))
  );
}

async function tryRunJsFallback(source: string): Promise<CompilerResult | null> {
  const transpiled = transpileJsFallbackSource(source);
  if (!transpiled) {
    return null;
  }

  const output: string[] = [];
  const stdFs = createJsFallbackStdFs();
  const helpers: JsFallbackHelpers = {
    len(value: unknown) {
      if (typeof value === "string" || Array.isArray(value)) {
        return value.length;
      }

      if (value && typeof value === "object") {
        return Object.keys(value).length;
      }

      return 0;
    },
    print(...args: unknown[]) {
      const seen = new WeakSet<object>();
      output.push(
        args
          .map((arg) => formatJsFallbackValue(arg, { seen }))
          .join(" "),
      );
    },
    stdFs,
    stdJson: {
      parse(input: string) {
        return JSON.parse(input) as unknown;
      },
      stringify(value: unknown, space?: unknown) {
        return JSON.stringify(
          value,
          null,
          typeof space === "number" || typeof space === "string" ? space : 0,
        );
      },
    },
  };

  const AsyncFunction = Object.getPrototypeOf(
    async function noop() {
      return undefined;
    },
  ).constructor as new (
    ...args: string[]
  ) => (helpers: JsFallbackHelpers) => Promise<unknown>;

  try {
    const run = new AsyncFunction(
      "helpers",
      `"use strict";
const print = (...args) => helpers.print(...args);
const len = (value) => helpers.len(value);
${transpiled}
if (typeof main !== "function") {
  throw new Error("Program must define a main() function.");
}
return await main();
`,
    );

    await run(helpers);
    return { output, success: true };
  } catch {
    return null;
  }
}

export class TejXCompiler {
  private compiler: BrowserCompiler | null = null;
  private initPromise: Promise<void> | null = null;

  async init() {
    if (this.compiler) {
      return;
    }

    if (!this.initPromise) {
      this.initPromise = BrowserCompilerApi.fromUrl("/tejxc_wasm.wasm", {
        onLog: (line: string) => {
          console.log("[Compiler Log]:", line);
        },
      })
        .then((compiler: BrowserCompiler) => {
          this.compiler = compiler;
        })
        .finally(() => {
          this.initPromise = null;
        });
    }

    await this.initPromise;
  }

  async compile(code: string): Promise<CompilerResult> {
    if (!this.compiler) {
      await this.init();
    }

    if (!this.compiler) {
      return { output: ["Not initialized"], success: false };
    }

    const filename = "playground.tx";
    const source = transformBrowserPlaygroundSource(code);
    const report = this.compiler.compileToWatReport(
      source,
      filename,
      {},
    ) as CompileReport;

    if (!report.ok) {
      if (DECIMAL_LITERAL_PATTERN.test(code)) {
        const fallback = await tryRunJsFallback(code);
        if (fallback) {
          return fallback;
        }
      }

      const message =
        report.full_error ||
        report.message ||
        (report.stage ? `Compile failed at ${report.stage}` : "") ||
        "Compilation failed";
      return { output: [message], success: false };
    }

    const output: string[] = [];

    try {
      const host = (await this.compiler.compileAndInstantiate(source, {
        filename,
        compileReport: report,
        onOutput: (line: string) => {
          output.push(line);
        },
      })) as ProgramHost;

      host.runMain();

      if (host.unsupportedCalls.size) {
        output.push(
          `Unsupported runtime imports hit: ${[...host.unsupportedCalls].join(", ")}`,
        );
      }

      if (shouldUseJsFloatFallback(code, output)) {
        const fallback = await tryRunJsFallback(code);
        if (fallback) {
          return fallback;
        }
      }

      return { output, success: true };
    } catch (error: unknown) {
      if (DECIMAL_LITERAL_PATTERN.test(code)) {
        const fallback = await tryRunJsFallback(code);
        if (fallback) {
          return fallback;
        }
      }

      const message = error instanceof Error ? error.message : String(error);
      return { output: [message], success: false };
    }
  }
}

export const compiler = new TejXCompiler();
