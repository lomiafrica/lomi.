#!/usr/bin/env node
/**
 * TypeScript SDK Generator
 */

import { execSync } from "child_process";
import { readFileSync, readdirSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generatedDir = join(__dirname, "../ts/src/generated");

console.log("🔨 Generating TypeScript SDK...");

console.log("📋 Generating OpenAPI schema types…");
execSync("node scripts/generate-schema-types.js", {
  cwd: join(__dirname, ".."),
  stdio: "inherit",
});

console.log("📋 Running typed SDK generator…");
execSync("node scripts/generate-types-sdk.js", {
  cwd: join(__dirname, ".."),
  stdio: "inherit",
});

console.log("🔧 Fixing ES module imports…");
function fixImports(dir) {
  if (!existsSync(dir)) return;

  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = join(dir, file.name);

    if (file.isDirectory()) {
      fixImports(filePath);
    } else if (file.name.endsWith(".ts")) {
      let content = readFileSync(filePath, "utf-8");
      const importRegex = /(from\s+['"])(\.\.?[^'"]+)(['"])/g;
      const modified = content.replace(
        importRegex,
        (match, prefix, path, suffix) => {
          if (!path.endsWith(".js") && !path.includes(".json")) {
            return `${prefix}${path}.js${suffix}`;
          }
          return match;
        },
      );

      if (modified !== content) {
        writeFileSync(filePath, modified, "utf-8");
      }
    }
  }
}

fixImports(generatedDir);

console.log("🔧 Running post-generation script…");
execSync("node ../scripts/post-generate-sdk.js", {
  cwd: join(__dirname, "../ts"),
  stdio: "inherit",
});

console.log("✅ TypeScript SDK generated successfully!");
