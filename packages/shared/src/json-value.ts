/** JSON primitives (no bigint/undefined). */
export type JsonPrimitive = string | number | boolean | null;

/** JSON-shaped input from clients that may omit object properties. */
export type JsonInput =
  | JsonPrimitive
  | JsonInputObject
  | JsonInput[]
  | undefined;

/** JSON input object before omitted properties are normalized. */
export type JsonInputObject = { [key: string]: JsonInput };

/** Recursive JSON value. Object values are JsonValue, never unknown. */
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

/** JSON object with JsonValue entries (safe dictionary for anti-slop). */
export type JsonObject = { [key: string]: JsonValue };

/** Structured error payload with optional message fields. */
export type ErrorLike = {
  message?: string;
  error?: string;
  code?: string;
};

/** Values accepted by getErrorMessage after catch-site coercion. */
export type ErrorInput = Error | string | ErrorLike;

/** True when value is a string. */
export function isString<Value>(value: Value): value is Value & string {
  return typeof value === "string";
}

/** True when value is a finite number. */
export function isNumber<Value>(value: Value): value is Value & number {
  return typeof value === "number" && Number.isFinite(value);
}

/** True when value is a boolean. */
export function isBoolean<Value>(value: Value): value is Value & boolean {
  return typeof value === "boolean";
}

/** Named callable contract for `isFunction` (avoids exposing `unknown`). */
export type Callable = (...args: never[]) => void;

/** True when value is a function (narrows union members that are callables). */
export function isFunction<T>(value: T): value is Extract<T, Callable> {
  return typeof value === "function";
}

/** True when value is a bigint. */
export function isBigint<Value>(value: Value): value is Value & bigint {
  return typeof value === "bigint";
}

/** True when value is a symbol. */
export function isSymbol<Value>(value: Value): value is Value & symbol {
  return typeof value === "symbol";
}

/** True when value is undefined. */
export function isUndefined<Value>(
  value: Value,
): value is Value & undefined {
  return typeof value === "undefined";
}

/** True when value is null. */
export function isNull(value: JsonValue): value is null {
  return value === null;
}

/** True when value is a plain JSON object (not an array). */
export function isJsonObject<Value>(
  value: Value,
): value is Value & JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** True when value is a JSON array. */
export function isJsonArray<Value>(
  value: Value,
): value is Value & JsonValue[] {
  return Array.isArray(value);
}

function isPlainObject<Value>(value: Value): value is Value & JsonObject {
  return isJsonObject(value);
}

/**
 * Recursively validate a JSON value; throws on non-JSON shapes.
 * Accepts unknown at boundaries (Supabase Json, fetch JSON, etc.).
 * Top-level undefined is rejected; nested undefined object entries are skipped.
 */
// oxlint-disable-next-line anti-slop/no-unknown-parameters -- I/O boundary: Supabase Json, fetch JSON, JSON.parse
export function validateJsonValue(value: unknown): JsonValue {
  if (value === undefined) {
    throw new TypeError("Top-level JSON value cannot be undefined");
  }
  if (value === null) return null;
  if (isString(value)) return value;
  if (isNumber(value)) return value;
  if (isBoolean(value)) return value;
  if (isBigint(value) || isSymbol(value) || isFunction(value)) {
    throw new TypeError("Value is not JSON-serializable");
  }
  if (Array.isArray(value)) {
    return value.map((item) => validateJsonValue(item));
  }
  if (isPlainObject(value)) {
    const out: JsonObject = {};
    for (const key of Object.keys(value)) {
      const entry = value[key];
      if (entry === undefined) continue;
      out[key] = validateJsonValue(entry);
    }
    return out;
  }
  throw new TypeError("Value is not JSON-serializable");
}

/** Assert and narrow unknown input to JsonValue (throws on invalid shapes). */
// oxlint-disable-next-line anti-slop/no-unknown-parameters -- I/O boundary alias of validateJsonValue
export function asJsonValue(value: unknown): JsonValue {
  return validateJsonValue(value);
}

/** Normalize an object from a typed SDK by removing omitted properties. */
export function normalizeJsonObject(value: JsonInputObject): JsonObject {
  const normalized = validateJsonValue(value);
  if (!isJsonObject(normalized)) {
    throw new TypeError("Expected a JSON object");
  }
  return normalized;
}

/**
 * Parse a JSON text into JsonValue.
 * JSON.parse is the language I/O boundary; validateJsonValue rejects non-JSON.
 */
export function parseJson(text: string): JsonValue {
  return validateJsonValue(JSON.parse(text));
}

/** Parse JSON text and require an object at the language boundary. */
export function parseJsonObject(text: string): JsonObject {
  const value = parseJson(text);
  if (!isJsonObject(value)) {
    throw new TypeError("Expected a JSON object");
  }
  return value;
}

/** Read a string field from a JsonObject, or undefined if missing/wrong type. */
export function readString(
  object: JsonObject,
  key: string,
): string | undefined {
  const value = object[key];
  if (value === undefined) return undefined;
  return isString(value) ? value : undefined;
}

/** Read a number field from a JsonObject, or undefined if missing/wrong type. */
export function readNumber(
  object: JsonObject,
  key: string,
): number | undefined {
  const value = object[key];
  if (value === undefined) return undefined;
  return isNumber(value) ? value : undefined;
}

/** Read a boolean field from a JsonObject, or undefined if missing/wrong type. */
export function readBoolean(
  object: JsonObject,
  key: string,
): boolean | undefined {
  const value = object[key];
  if (value === undefined) return undefined;
  return isBoolean(value) ? value : undefined;
}

/** Read a nested object field, or undefined if missing/wrong type. */
export function readObject(
  object: JsonObject,
  key: string,
): JsonObject | undefined {
  const value = object[key];
  if (value === undefined) return undefined;
  return isJsonObject(value) ? value : undefined;
}

/** Read an array field, or undefined if missing/wrong type. */
export function readArray(
  object: JsonObject,
  key: string,
): JsonValue[] | undefined {
  const value = object[key];
  if (value === undefined) return undefined;
  return isJsonArray(value) ? value : undefined;
}

/**
 * Coerce a catch-clause / thrown value into ErrorInput for getErrorMessage.
 * Call only at catch boundaries (after a SAFETY assertion from the catch variable).
 */
export function coerceCaughtError<Value>(error: Value): ErrorInput {
  if (error instanceof Error) return error;
  if (isString(error)) return error;
  if (isJsonObject(error)) {
    const message = readString(error, "message");
    const nested = readString(error, "error");
    const code = readString(error, "code");
    const like: ErrorLike = {};
    if (message !== undefined) like.message = message;
    if (nested !== undefined) like.error = nested;
    if (code !== undefined) like.code = code;
    return like;
  }
  return { message: "An unexpected error occurred" };
}

/** Extract a safe message from a normalized catch value. */
export function errorMessage(
  error: ErrorInput,
  fallback = "An unexpected error occurred",
): string {
  if (error instanceof Error) return error.message;
  if (isString(error)) return error;
  return error.message ?? error.error ?? fallback;
}

/** Optional string helper used at untyped payload boundaries. */
export function safeString(value: JsonValue | undefined): string {
  if (value === undefined || value === null) return "";
  if (isString(value)) return value;
  if (isNumber(value) || isBoolean(value)) return String(value);
  return "";
}

type ProcessEnvBag = {
  process?: { env?: Record<string, string | undefined> };
};

function readProcessEnv(name: string): string | undefined {
  // SAFETY: Node/bundler `process.env` lives on globalThis; optional chaining is the host boundary.
  const host = globalThis as ProcessEnvBag;
  return host.process?.env?.[name];
}

/** Read env var or throw. Prefer this over ad-hoc typeof on process.env. */
export function readEnv(name: string): string {
  const value = readProcessEnv(name);
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Read optional env var. */
export function readEnvOptional(name: string): string | undefined {
  const value = readProcessEnv(name);
  if (value === undefined || value === "") return undefined;
  return value;
}
