#!/usr/bin/env node

/**
 * Generate Postman Collection from OpenAPI Spec
 *
 * This automatically stays in sync with your database schema because
 * it generates from the OpenAPI spec which is auto-generated from your database.
 *
 * Usage:
 *   node generate-postman.js
 *
 * Whenever you change your database schema:
 * 1. Run: npm run generate:spec (in apps/api)
 * 2. Run: node generate-postman.js (in apps/sdks/scripts)
 * 3. ✅ Postman collection is updated!
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPEC_PATH = path.join(__dirname, "../spec.yaml");
const OUTPUT_PATH = path.join(__dirname, "../postman-collection.json");
const isObjectRecord = (value) =>
  value !== null && Object(value) === value && !Array.isArray(value);

console.log("📋 Generating Postman Collection from OpenAPI spec...\n");

// Read OpenAPI spec
const spec = yaml.load(fs.readFileSync(SPEC_PATH, "utf8"));

// Create Postman collection
const collection = {
  info: {
    name: spec.info.title,
    description: spec.info.description,
    version: spec.info.version,
    schema:
      "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  auth: {
    type: "apikey",
    apikey: [
      { key: "key", value: "X-API-KEY", type: "string" },
      { key: "value", value: "{{API_KEY}}", type: "string" },
      { key: "in", value: "header", type: "string" },
    ],
  },
  variable: [
    {
      key: "baseUrl",
      value: spec.servers[0].url,
      type: "string",
    },
    {
      key: "API_KEY",
      value: "",
      type: "string",
    },
  ],
  item: [],
};

// Group endpoints by tags
const folders = {};

for (const [path, methods] of Object.entries(spec.paths)) {
  for (const [method, operation] of Object.entries(methods)) {
    if (!isObjectRecord(operation)) continue;

    const tag = operation.tags?.[0] || "Other";

    if (!folders[tag]) {
      folders[tag] = {
        name: tag,
        item: [],
      };
    }

    // Create request
    const request = {
      name: operation.summary || `${method.toUpperCase()} ${path}`,
      request: {
        method: method.toUpperCase(),
        header: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
        url: {
          raw: `{{baseUrl}}${path}`,
          host: ["{{baseUrl}}"],
          path: path.split("/").filter(Boolean),
          ...(operation.parameters && {
            query: operation.parameters
              .filter((p) => p.in === "query")
              .map((p) => ({
                key: p.name,
                value: p.schema?.example || p.example || "",
                description: p.description,
                disabled: !p.required,
              })),
          }),
        },
        description: operation.description,
      },
    };

    // Add path variables
    if (operation.parameters) {
      const pathParams = operation.parameters.filter((p) => p.in === "path");
      if (pathParams.length > 0) {
        request.request.url.variable = pathParams.map((p) => ({
          key: p.name,
          value: p.schema?.example || p.example || `{{${p.name}}}`,
          description: p.description,
        }));
      }
    }

    // Add request body if present
    if (operation.requestBody) {
      const content = operation.requestBody.content?.["application/json"];
      if (content) {
        // Get example from the spec
        const example =
          content.examples?.default?.value ||
          generateExampleFromSchema(content.schema, spec);

        request.request.body = {
          mode: "raw",
          raw: JSON.stringify(example, null, 2),
          options: {
            raw: {
              language: "json",
            },
          },
        };
      }
    }

    folders[tag].item.push(request);
  }
}

// Add folders to collection
collection.item = Object.values(folders);

// Write collection
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(collection, null, 2));

console.log("✅ Postman collection generated successfully!");
console.log(`📄 Output: ${OUTPUT_PATH}`);
console.log(`📊 Folders: ${Object.keys(folders).length}`);
console.log(
  `🛣️  Requests: ${Object.values(folders).reduce((sum, f) => sum + f.item.length, 0)}\n`,
);
console.log("💡 Import this file into Postman to start testing your API!");

/**
 * Generate example from OpenAPI schema
 */
function generateExampleFromSchema(schema, spec) {
  if (!schema) return {};

  // If schema has a $ref, resolve it
  if (schema.$ref) {
    const refPath = schema.$ref.split("/").slice(1); // Remove '#'
    let resolved = spec;
    for (const part of refPath) {
      resolved = resolved[part];
    }
    return generateExampleFromSchema(resolved, spec);
  }

  if (schema.type === "object") {
    const example = {};
    for (const [key, prop] of Object.entries(schema.properties || {})) {
      if (prop.readOnly) continue; // Skip read-only fields
      example[key] = generateValueFromProperty(prop, spec);
    }
    return example;
  }

  return {};
}

/**
 * Generate example value from property
 */
function generateValueFromProperty(prop, spec) {
  if (prop.example !== undefined) return prop.example;
  if (prop.default !== undefined) return prop.default;
  if (prop.enum) return prop.enum[0];

  if (prop.$ref) {
    const refPath = prop.$ref.split("/").slice(1);
    let resolved = spec;
    for (const part of refPath) {
      resolved = resolved[part];
    }
    return generateValueFromProperty(resolved, spec);
  }

  switch (prop.type) {
    case "string":
      if (prop.format === "email") return "user@example.com";
      if (prop.format === "uuid") return "123e4567-e89b-12d3-a456-426614174000";
      if (prop.format === "date-time") return new Date().toISOString();
      if (prop.format === "uri") return "https://example.com";
      return "string";
    case "number":
    case "integer":
      return 0;
    case "boolean":
      return true;
    case "array":
      return [];
    case "object":
      return {};
    default:
      return null;
  }
}
