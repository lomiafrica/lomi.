/**
 * Shared helpers for OpenAPI → MCP manifest generation.
 */
import {
  isJsonObject,
  isString,
  readObject,
  readString,
  type JsonObject,
  type JsonValue,
} from "@lomi./shared";
import type { ParameterObject } from "./openapi-types.js";
import { resolveEnglishSchemaDescription } from "./mcp-english-copy.js";

export interface OpenAPISpec {
  openapi?: string;
  info?: { title?: string; version?: string };
  paths?: JsonObject;
  components?: { schemas?: JsonObject };
}

export type ResolvedJsonSchema = JsonObject;

export function pathTemplateParamNames(template: string): string[] {
  const names: string[] = [];
  const re = /\{([^}]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(template)) !== null) {
    const name = match[1]?.trim();
    if (name) names.push(name);
  }
  return names;
}

function sortKeysStable(object: JsonObject): JsonObject {
  const sorted: JsonObject = {};
  for (const key of Object.keys(object).sort())
    sorted[key] = object[key] ?? null;
  return sorted;
}

function stringArray(value: JsonValue | undefined): string[] {
  return Array.isArray(value) ? value.filter(isString) : [];
}

export function canonicalizeInputSchema(
  schema: ResolvedJsonSchema,
): ResolvedJsonSchema {
  const out: JsonObject = { ...schema };
  if (Array.isArray(out["required"])) {
    out["required"] = stringArray(out["required"]).sort();
  }
  const properties = readObject(out, "properties");
  if (properties) {
    const next: JsonObject = {};
    for (const key of Object.keys(properties).sort()) {
      const value = properties[key];
      next[key] =
        value !== undefined &&
        isJsonObject(value) &&
        readObject(value, "properties")
          ? canonicalizeInputSchema(value)
          : (value ?? null);
    }
    out["properties"] = sortKeysStable(next);
  }
  return out;
}

export function ensurePathParamsInInputSchema(
  schema: ResolvedJsonSchema,
  pathTemplate: string,
): ResolvedJsonSchema {
  const names = pathTemplateParamNames(pathTemplate);
  if (names.length === 0) return canonicalizeInputSchema(schema);

  const properties = { ...(readObject(schema, "properties") ?? {}) };
  const required = new Set(stringArray(schema["required"]));
  for (const name of names) {
    if (!properties[name]) {
      properties[name] = {
        type: "string",
        description: `Path parameter "${name}" for \`${pathTemplate}\`.`,
      };
    }
    required.add(name);
  }
  return canonicalizeInputSchema({
    ...schema,
    type: "object",
    properties,
    required: [...required].sort(),
  });
}

function specRoot(spec: OpenAPISpec): JsonObject {
  const root: JsonObject = {};
  if (spec.openapi) root["openapi"] = spec.openapi;
  if (spec.info) {
    const info: JsonObject = {};
    if (spec.info.title) info["title"] = spec.info.title;
    if (spec.info.version) info["version"] = spec.info.version;
    root["info"] = info;
  }
  if (spec.paths) root["paths"] = spec.paths;
  if (spec.components?.schemas) {
    root["components"] = { schemas: spec.components.schemas };
  }
  return root;
}

export function resolveRef(
  ref: string | undefined,
  spec: OpenAPISpec,
): ResolvedJsonSchema | null {
  if (!ref?.startsWith("#/")) return null;
  let current: JsonValue = specRoot(spec);
  for (const segment of ref.replace(/^#\//, "").split("/")) {
    if (!isJsonObject(current)) return null;
    const next: JsonValue | undefined = current[segment];
    if (next === undefined) return null;
    current = next;
  }
  return isJsonObject(current) ? current : null;
}

function parameterFromObject(object: JsonObject): ParameterObject | null {
  const name = readString(object, "name");
  const location = readString(object, "in");
  if (
    !name ||
    (location !== "query" &&
      location !== "path" &&
      location !== "header" &&
      location !== "cookie")
  ) {
    return null;
  }
  return {
    name,
    in: location,
    required: object["required"] === true,
    description: readString(object, "description"),
    schema: readObject(object, "schema"),
  };
}

function normalizeParam(
  value: JsonValue,
  spec: OpenAPISpec,
): ParameterObject | null {
  if (!isJsonObject(value)) return null;
  const ref = readString(value, "$ref");
  const object = ref ? resolveRef(ref, spec) : value;
  return object ? parameterFromObject(object) : null;
}

export function flattenOperationParameters(
  spec: OpenAPISpec,
  pathItem: JsonObject,
  operation: JsonObject,
): ParameterObject[] {
  const pathParameters = pathItem["parameters"];
  const operationParameters = operation["parameters"];
  const merged = [
    ...(Array.isArray(pathParameters) ? pathParameters : []),
    ...(Array.isArray(operationParameters) ? operationParameters : []),
  ];
  const output: ParameterObject[] = [];
  const seen = new Set<string>();
  for (const raw of merged) {
    const parameter = normalizeParam(raw, spec);
    if (
      !parameter ||
      (parameter.in !== "query" &&
        parameter.in !== "path" &&
        parameter.in !== "header")
    ) {
      continue;
    }
    const key = `${parameter.in}:${parameter.name}`;
    if (!seen.has(key)) {
      seen.add(key);
      output.push(parameter);
    }
  }
  return output;
}

function cloneSchema(value: JsonValue | undefined): JsonValue | undefined {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

export function inlineRefs(
  node: JsonValue,
  spec: OpenAPISpec,
  seenRefs = new Set<string>(),
  depth = 0,
): JsonValue {
  if (depth > 24 || node === null || !isJsonObject(node)) {
    return Array.isArray(node)
      ? node.map((item) => inlineRefs(item, spec, seenRefs, depth + 1))
      : node;
  }

  const ref = readString(node, "$ref");
  if (ref) {
    if (seenRefs.has(ref))
      return { type: "object", additionalProperties: true };
    seenRefs.add(ref);
    const resolved = resolveRef(ref, spec);
    if (!resolved) return { type: "object", additionalProperties: true };
    return inlineRefs(
      cloneSchema(resolved) ?? resolved,
      spec,
      seenRefs,
      depth + 1,
    );
  }

  const output: JsonObject = {};
  for (const [key, value] of Object.entries(node)) {
    output[key] = inlineRefs(value, spec, seenRefs, depth + 1);
  }
  return output;
}

function jsonSchemaFromParameter(
  parameter: ParameterObject,
  fieldName?: string,
): ResolvedJsonSchema {
  const schema = parameter.schema ?? { type: "string" };
  const cloned = cloneSchema(schema);
  const base = cloned !== undefined && isJsonObject(cloned) ? cloned : {};
  const name = fieldName ?? parameter.name;
  base["description"] = resolveEnglishSchemaDescription(
    name,
    parameter.description,
  );
  return base;
}

function mergeBodySchema(
  bodySchema: JsonValue | undefined,
): ResolvedJsonSchema | undefined {
  if (bodySchema === undefined || !isJsonObject(bodySchema)) return undefined;
  const bodyField: JsonObject = { ...bodySchema };
  bodyField["description"] =
    readString(bodySchema, "description") ??
    "JSON request body for this operation.";
  return {
    type: "object",
    properties: {
      body: bodyField,
    },
    required: ["body"],
  };
}

function mergeSchemas(
  first: ResolvedJsonSchema | undefined,
  second: ResolvedJsonSchema | undefined,
): ResolvedJsonSchema {
  const a = first ?? {};
  const b = second ?? {};
  const properties = {
    ...(readObject(a, "properties") ?? {}),
    ...(readObject(b, "properties") ?? {}),
  };
  const required = new Set([
    ...stringArray(a["required"]),
    ...stringArray(b["required"]),
  ]);
  const schema: JsonObject = { type: "object", properties };
  if (required.size > 0) schema["required"] = [...required].sort();
  if (
    a["additionalProperties"] === true ||
    b["additionalProperties"] === true
  ) {
    schema["additionalProperties"] = true;
  }
  return schema;
}

export interface BuildInputJsonSchemaArgs {
  spec: OpenAPISpec;
  operation: JsonObject;
  pathItem: JsonObject;
  pathTemplate: string;
  httpMethodLower: string;
  includeIdempotencyKey: boolean;
}

export function buildInputJsonSchema(
  args: BuildInputJsonSchemaArgs,
): ResolvedJsonSchema {
  const {
    spec,
    operation,
    pathItem,
    pathTemplate,
    httpMethodLower,
    includeIdempotencyKey,
  } = args;
  const properties: JsonObject = {};
  const required = new Set<string>();
  for (const parameter of flattenOperationParameters(
    spec,
    pathItem,
    operation,
  )) {
    const key =
      parameter.in === "header" ? `header_${parameter.name}` : parameter.name;
    properties[key] = jsonSchemaFromParameter(parameter, key);
    if (parameter.required) required.add(key);
  }

  let merged = mergeSchemas(
    { type: "object", properties },
    { type: "object", required: [...required].sort() },
  );
  const requestBody = readObject(operation, "requestBody");
  if (["post", "patch", "put"].includes(httpMethodLower) && requestBody) {
    const content = readObject(requestBody, "content");
    const json = content ? readObject(content, "application/json") : undefined;
    const rawSchema = json?.["schema"];
    if (rawSchema !== undefined && isJsonObject(rawSchema)) {
      const body = mergeBodySchema(inlineRefs(rawSchema, spec));
      if (body) merged = mergeSchemas(merged, body);
    }
  }

  if (includeIdempotencyKey) {
    const nextProperties = { ...(readObject(merged, "properties") ?? {}) };
    nextProperties["idempotency_key"] = {
      type: "string",
      description:
        "Optional Idempotency-Key header (recommended on writes for safe retries).",
    };
    merged = { ...merged, type: "object", properties: nextProperties };
    merged["required"] = stringArray(merged["required"]).sort();
  }

  return ensurePathParamsInInputSchema(merged, pathTemplate);
}
