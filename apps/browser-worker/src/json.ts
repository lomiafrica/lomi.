export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

export type JsonObject = { [key: string]: Json };

function isString<Value>(value: Value): value is Value & string {
  return typeof value === "string";
}

function isNumber<Value>(value: Value): value is Value & number {
  return typeof value === "number";
}

function isBoolean<Value>(value: Value): value is Value & boolean {
  return typeof value === "boolean";
}

function isRecord<Value>(
  value: Value,
): value is Value & { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Decode JSON.parse or a Playwright result. Invalid shapes throw. */
// oxlint-disable-next-line anti-slop/no-unknown-parameters -- I/O boundary for JSON.parse and page.evaluate
export function asJson(value: unknown): Json {
  if (value === null || isString(value) || isNumber(value) || isBoolean(value))
    return value;
  if (Array.isArray(value)) return value.map((item) => asJson(item));
  if (!isRecord(value)) throw new Error("Value is not JSON");
  const out: JsonObject = {};
  for (const key of Object.keys(value)) {
    const entry = value[key];
    if (entry === undefined) continue;
    out[key] = asJson(entry);
  }
  return out;
}

export function isJsonObject(value: Json): value is JsonObject {
  return isRecord(value);
}

export function jsonString(value: Json | undefined): string | undefined {
  return isString(value) ? value : undefined;
}

export function jsonNumber(value: Json | undefined): number | undefined {
  return isNumber(value) && Number.isFinite(value) ? value : undefined;
}

export function jsonBoolean(value: Json | undefined): boolean | undefined {
  return isBoolean(value) ? value : undefined;
}
