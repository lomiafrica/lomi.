/** JSON value contract for untyped provider and database payloads. */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue;
}

export function isString<Value>(value: Value): value is Value & string {
  return typeof value === "string";
}

export function isJsonObject<Value>(value: Value): value is Value & JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readString(
  object: JsonObject,
  key: string,
): string | undefined {
  const value = object[key];
  return isString(value) ? value : undefined;
}

export function caughtMessage(error: Error | string | JsonValue): string {
  if (error instanceof Error) return error.message;
  if (isString(error)) return error;
  if (isJsonObject(error)) {
    return readString(error, "message") ?? "unexpected error";
  }
  return "unexpected error";
}
