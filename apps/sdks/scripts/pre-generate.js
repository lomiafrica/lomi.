#!/usr/bin/env node
/**
 * Pre-generation validation and setup script
 *
 * This script copies the API types from the API module and validates them for SDK generation
 */

import { readFileSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Source: API types file generated from database types
const sourceTypesPath = join(__dirname, "../../api/src/utils/types/api.ts");
// Source: API config for resource definitions
const sourceConfigPath = join(__dirname, "../../api/src/api-config.ts");

// Target: Local copies for SDK generation
const targetTypesPath = join(__dirname, "../api-types.ts");
const targetConfigPath = join(__dirname, "../api-config.ts");

try {
  console.log("📋 Copying API types from API module...");

  // Copy api.ts types
  copyFileSync(sourceTypesPath, targetTypesPath);
  console.log("✅ API types copied successfully");

  // Copy api-config.ts for resource definitions
  copyFileSync(sourceConfigPath, targetConfigPath);
  console.log("✅ API config copied successfully");

  // Read and validate the types file
  console.log("📋 Validating API types...");
  const typesContent = readFileSync(targetTypesPath, "utf-8");

  // Basic validation
  if (!typesContent.includes("export type Database")) {
    throw new Error('Missing "Database" type in API types');
  }

  if (!typesContent.includes("Tables:")) {
    throw new Error('Missing "Tables:" section in API types');
  }

  if (!typesContent.includes("Functions:")) {
    throw new Error('Missing "Functions:" section in API types');
  }

  if (!typesContent.includes("Enums:")) {
    throw new Error('Missing "Enums:" section in API types');
  }

  // Count exposed items
  const tableMatches = typesContent.match(/^\s{6}\w+:\s*\{/gm) || [];
  const functionMatches =
    typesContent.match(/^\s{6}\w+:\s*\{[\s\S]*?Args:/gm) || [];

  console.log(`✅ API types validated`);
  console.log(`   📊 Tables found: ~${tableMatches.length}`);
  console.log(`   📊 Functions found: ~${functionMatches.length}`);
} catch (error) {
  console.error("❌ Error in pre-generation:", error.message);
  process.exit(1);
}
