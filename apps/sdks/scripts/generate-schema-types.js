#!/usr/bin/env node
/**
 * Emit openapi-typescript schema.d.ts from apps/docs/openapi.json
 */

import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import openapiTS, { astToString } from "openapi-typescript";
import { DEFAULT_OPENAPI_PATH } from "./public-sdk-operations.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, "../ts/src/generated/schema.d.ts");

async function main() {
  console.log("📋 Generating OpenAPI schema types (openapi-typescript)…");
  const spec = JSON.parse(readFileSync(DEFAULT_OPENAPI_PATH, "utf-8"));
  const ast = await openapiTS(spec);
  const types = astToString(ast);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(
    outputPath,
    `/**
 * OpenAPI schema types
 * AUTO-GENERATED — do not edit manually
 * Source: apps/docs/openapi.json
 */

${types}`,
    "utf-8",
  );
  console.log(`✅ Wrote ${outputPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
