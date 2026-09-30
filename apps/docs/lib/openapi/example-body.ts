/* @proprietary license */

import {
  isJsonObject,
  readBoolean,
  readNumber,
  readString,
  type JsonObject,
  type JsonValue,
} from '@lomi./shared';

const SAMPLE_UUID = '123e4567-e89b-12d3-a456-426614174000';
const MAX_OPTIONAL = 6;

function componentsSchemas(document: JsonObject): JsonObject | null {
  const components = document.components;
  if (!isJsonObject(components)) return null;
  const schemas = components.schemas;
  return isJsonObject(schemas) ? schemas : null;
}

function resolveSchema(
  schema: JsonValue | undefined,
  schemas: JsonObject | null,
  depth: number,
): JsonObject | null {
  if (!isJsonObject(schema) || depth > 6) return null;
  const ref = readString(schema, '$ref');
  if (!ref || !schemas) return schema;
  const name = ref.split('/').pop();
  if (!name) return schema;
  const target = schemas[name];
  return isJsonObject(target) ? target : schema;
}

function usefulExample(schema: JsonObject): JsonValue | undefined {
  if (!('example' in schema)) return undefined;
  const example = schema.example;
  if (example === undefined || example === 'string' || example === '') {
    return undefined;
  }
  return example;
}

function stringSample(name: string, schema: JsonObject): string {
  const format = readString(schema, 'format');
  const key = name.toLowerCase();
  if (format === 'uuid' || key === 'id' || key.endsWith('_id')) {
    return SAMPLE_UUID;
  }
  if (format === 'email' || key.includes('email')) return 'merchant@example.com';
  if (
    format === 'uri' ||
    format === 'url' ||
    key === 'url' ||
    key.endsWith('_url')
  ) {
    return 'https://example.com/callback';
  }
  if (format === 'date-time' || key.endsWith('_at')) {
    return '2026-09-30T12:00:00Z';
  }
  if (key.includes('currency')) return 'XOF';
  if (key.includes('phone') || key.includes('whatsapp')) {
    return '+2250700000000';
  }
  if (key === 'country' || key.endsWith('_country')) return 'CI';
  if (key === 'city') return 'Abidjan';
  if (key === 'address' || key.endsWith('_address')) return '1 Avenue Chardy';
  if (key === 'postal_code' || key === 'zip') return '01 BP 1234';
  if (key === 'slug') return 'my-store';
  if (key === 'name' || key.endsWith('_name')) return 'Example';
  if (key.includes('description') || key === 'reason') return 'Example';
  return 'example';
}

function numberSample(name: string): number {
  const key = name.toLowerCase();
  if (key === 'amount' || key.endsWith('_amount') || key.includes('amount')) {
    return 10000;
  }
  return 1;
}

function sampleValue(
  name: string,
  schema: JsonValue | undefined,
  schemas: JsonObject | null,
  depth: number,
): JsonValue {
  const resolved = resolveSchema(schema, schemas, depth);
  if (!resolved) return 'example';
  const example = usefulExample(resolved);

  if (resolved.type === 'array') {
    if (example !== undefined) return example;
    return [sampleValue(name, resolved.items, schemas, depth + 1)];
  }

  if (resolved.type === 'object' || isJsonObject(resolved.properties)) {
    if (isJsonObject(example) || Array.isArray(example)) return example;
    return sampleObject(resolved, schemas, depth + 1);
  }

  if (example !== undefined) return example;

  const enumValues = resolved.enum;
  if (Array.isArray(enumValues) && enumValues.length > 0) {
    const key = name.toLowerCase();
    if (key === 'environment' || key.endsWith('_environment')) {
      const testValue = enumValues.find((value) => value === 'test');
      if (
        testValue === null ||
        typeof testValue === 'string' ||
        typeof testValue === 'number' ||
        typeof testValue === 'boolean'
      ) {
        return testValue;
      }
    }
    const first = enumValues[0];
    if (
      first === null ||
      typeof first === 'string' ||
      typeof first === 'number' ||
      typeof first === 'boolean'
    ) {
      return first;
    }
  }

  if (resolved.type === 'boolean') {
    const key = name.toLowerCase();
    if (
      key.startsWith('is_') ||
      key.endsWith('_enabled') ||
      key.endsWith('_active') ||
      key === 'enabled' ||
      key === 'active'
    ) {
      return true;
    }
    return readBoolean(resolved, 'default') ?? false;
  }
  if (resolved.type === 'number' || resolved.type === 'integer') {
    return readNumber(resolved, 'default') ?? numberSample(name);
  }
  return stringSample(name, resolved);
}

function skipOptional(name: string, schema: JsonObject): boolean {
  if (
    name === 'confirmation_token' ||
    name === 'authorized_events' ||
    name === 'metadata'
  ) {
    return true;
  }
  if (readBoolean(schema, 'deprecated') === true) return true;
  return false;
}

function isScalarOptional(name: string, property: JsonObject): boolean {
  if (skipOptional(name, property)) return false;
  if (usefulExample(property) !== undefined) return true;
  if (Array.isArray(property.enum)) return true;
  const type = property.type;
  return (
    type === 'string' ||
    type === 'number' ||
    type === 'integer' ||
    type === 'boolean'
  );
}

function sampleObject(
  schema: JsonObject,
  schemas: JsonObject | null,
  depth: number,
): JsonObject {
  const properties = isJsonObject(schema.properties) ? schema.properties : null;
  if (!properties) return {};
  const requiredRaw = schema.required;
  const required = new Set<string>();
  if (Array.isArray(requiredRaw)) {
    for (const item of requiredRaw) {
      if (typeof item === 'string') required.add(item);
    }
  }

  const keys: string[] = [];
  if (required.size > 0) {
    for (const key of required) {
      if (key in properties) keys.push(key);
    }
  }
  const extraRoom = required.size === 0 ? MAX_OPTIONAL : required.size === 1 ? 3 : 0;
  if (extraRoom > 0) {
    for (const [key, property] of Object.entries(properties)) {
      if (keys.length >= required.size + extraRoom) break;
      if (keys.includes(key) || !isJsonObject(property)) continue;
      if (!isScalarOptional(key, property)) continue;
      if (
        required.size > 0 &&
        usefulExample(property) === undefined &&
        !Array.isArray(property.enum) &&
        !readString(property, 'format')
      ) {
        continue;
      }
      keys.push(key);
    }
  }

  const out: JsonObject = {};
  for (const key of keys) {
    out[key] = sampleValue(key, properties[key], schemas, depth);
  }
  return out;
}

function exampleFromMedia(media: JsonObject): JsonValue | null {
  if ('example' in media && media.example !== undefined) return media.example;
  const examples = media.examples;
  if (!isJsonObject(examples)) return null;
  for (const entry of Object.values(examples)) {
    if (!isJsonObject(entry) || !('value' in entry)) continue;
    return entry.value ?? null;
  }
  return null;
}

/** Request body for the sandbox editor. Uses the operation example, else that operation's own schema. */
export function exampleBodyForOperation(
  document: JsonObject,
  operation: JsonObject,
): string | null {
  const requestBody = operation.requestBody;
  if (!isJsonObject(requestBody)) return null;
  const content = requestBody.content;
  if (!isJsonObject(content)) return null;
  const json = content['application/json'];
  if (!isJsonObject(json)) return null;

  const authored = exampleFromMedia(json);
  if (authored !== null && authored !== undefined) {
    try {
      return JSON.stringify(authored, null, 2);
    } catch {
      return null;
    }
  }

  const sampled = sampleValue('body', json.schema, componentsSchemas(document), 0);
  if (!isJsonObject(sampled) || Object.keys(sampled).length === 0) return null;
  try {
    return JSON.stringify(sampled, null, 2);
  } catch {
    return null;
  }
}
