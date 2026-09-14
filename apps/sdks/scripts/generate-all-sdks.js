#!/usr/bin/env node
/**
 * Master SDK Generator
 *
 * This script:
 * 1. Copies API types from apps/api to apps/sdks
 * 2. Generates SDKs for all supported languages (TypeScript, Python, Go, PHP)
 *
 * Run: npm run generate:all
 */

import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
  step: (msg) => console.log(`\n🔨 ${msg}`),
};

function exec(command, options = {}) {
  try {
    execSync(command, {
      stdio: "inherit",
      ...options,
    });
    return true;
  } catch (error) {
    log.error(`Failed to execute: ${command}`);
    return false;
  }
}

const SDKS = [
  {
    name: "TypeScript",
    dir: "ts",
    command: "node scripts/typescript-generate.js",
  },
  {
    name: "Python",
    dir: "python",
    command: "node scripts/python-generate.js",
  },
  {
    name: "Go",
    dir: "go",
    command: "node scripts/go-generate.js",
  },
  {
    name: "PHP",
    dir: "php",
    command: "node scripts/php-generate.js",
  },
];

async function generateAll() {
  console.log("🚀 lomi. Multi-Language SDK Generation\n");
  console.log("=".repeat(60));
  console.log(
    "📋 Public merchant SDKs use apps/docs/openapi.json + strict allowlist\n",
  );

  // Step 1: Pre-generation - Copy API types
  log.step("Running pre-generation setup...");
  const preGenSuccess = exec("node scripts/pre-generate.js", {
    cwd: path.join(__dirname, ".."),
  });

  if (!preGenSuccess) {
    log.error("Pre-generation failed. Cannot proceed with SDK generation.");
    return false;
  }
  log.success("Pre-generation completed successfully!");

  const results = {};
  let successCount = 0;
  let failureCount = 0;

  for (const sdk of SDKS) {
    log.step(`Generating ${sdk.name} SDK...`);

    const success = exec(sdk.command, {
      cwd: path.join(__dirname, ".."),
    });

    results[sdk.name] = success;
    if (success) {
      successCount++;
      log.success(`${sdk.name} SDK generated successfully!`);
    } else {
      failureCount++;
      log.error(`Failed to generate ${sdk.name} SDK`);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Generation Summary:\n");

  Object.entries(results).forEach(([name, success]) => {
    const status = success ? "✅" : "❌";
    console.log(
      `${status} ${name.padEnd(15)} ${success ? "SUCCESS" : "FAILED"}`,
    );
  });

  console.log(`\n✅ ${successCount} SDKs generated successfully`);
  if (failureCount > 0) {
    console.log(`❌ ${failureCount} SDKs failed to generate`);
    return false;
  }

  log.step("Verifying cross-language SDK surface parity…");
  const parityOk = exec("node scripts/verify-sdk-surface-parity.js", {
    cwd: path.join(__dirname, ".."),
  });
  if (!parityOk) {
    log.error("SDK manifest parity verification failed.");
    return false;
  }
  log.success("All language manifests match TypeScript canonical output.");

  console.log("\n💡 Next steps:");
  console.log(
    "   1. Review/commit generated SDK sources + manifests (sdk-public-methods.json, etc.)",
  );
  console.log(
    "   2. Run builds/tests locally (npm run build in ts/, go test, etc.)",
  );
  console.log("   3. Publish to package managers\n");

  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateAll()
    .then((success) => process.exit(success ? 0 : 1))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { generateAll };
