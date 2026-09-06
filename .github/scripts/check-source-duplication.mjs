#!/usr/bin/env node
/**
 * Dependency-free source duplication gate.
 * Usage: node .github/scripts/check-source-duplication.mjs [--self-test]
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const POLICY_PATH = path.join(ROOT, ".github/duplication-policy.json");
const MIN_BLOCK_CHARS = 180;

const SKIP_DIR = new Set([
  "node_modules",
  "dist",
  ".next",
  ".turbo",
  "coverage",
  ".git",
  "build",
  "out",
  "vendor",
]);

const SKIP_PATH_PREFIXES = [
  "packages/ui/src/interior/",
  "apps/dashboard/supabase/migrations/",
  "apps/api/src/utils/types/",
  "apps/sdks/",
  "apps/docs/openapi.json",
  "apps/docs/agent-openapi.json",
  "apps/website/public/openapi",
];

const SENTINELS = [
  {
    name: "validateJsonValue",
    owner: "packages/shared/src/json-value.ts",
    pattern: /export function validateJsonValue\s*\(/,
  },
  {
    name: "resolveCustomerDisplayName",
    owner: "packages/shared/src/customer-display-name.ts",
    pattern: /export function resolveCustomerDisplayName\s*\(/,
  },
  {
    name: "readRequestHref",
    owner: "packages/shared/src/auth-recovery.ts",
    pattern: /export function readRequestHref\s*\(/,
  },
];

function loadPolicy() {
  return JSON.parse(fs.readFileSync(POLICY_PATH, "utf8"));
}

function shouldSkip(rel) {
  if (SKIP_PATH_PREFIXES.some((prefix) => rel.startsWith(prefix))) return true;
  if (/\.(test|spec)\.[cm]?[jt]sx?$/.test(rel)) return true;
  if (rel.includes("/__tests__/")) return true;
  if (rel.includes("/fixtures/")) return true;
  return false;
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full).replaceAll("\\", "/");
    if (entry.isDirectory()) {
      if (shouldSkip(`${rel}/`)) continue;
      walk(full, files);
    } else if (/\.[cm]?[jt]sx?$/.test(entry.name) && !shouldSkip(rel)) {
      files.push(rel);
    }
  }
  return files;
}

function normalize(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function sha(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function isAllowlisted(policy, a, b) {
  return policy.allowances.some((item) => {
    const paths = item.paths || [];
    return paths.includes(a) && paths.includes(b);
  });
}

function checkSentinels(files) {
  const violations = [];
  for (const file of files) {
    const source = fs.readFileSync(path.join(ROOT, file), "utf8");
    for (const sentinel of SENTINELS) {
      if (file === sentinel.owner) continue;
      if (
        sentinel.pattern.test(source) &&
        !source.includes("@lomi./shared")
      ) {
        violations.push(
          `${sentinel.name} implementation found in ${file} (owner: ${sentinel.owner})`,
        );
      }
    }
  }
  return violations;
}

function checkExactFiles(files, policy) {
  const byHash = new Map();
  for (const file of files) {
    const normalized = normalize(fs.readFileSync(path.join(ROOT, file), "utf8"));
    if (normalized.length < MIN_BLOCK_CHARS) continue;
    const digest = sha(normalized);
    if (!byHash.has(digest)) byHash.set(digest, []);
    byHash.get(digest).push(file);
  }
  const violations = [];
  for (const group of byHash.values()) {
    if (group.length < 2) continue;
    const apps = group.filter((file) => file.startsWith("apps/"));
    const packages = group.filter((file) => file.startsWith("packages/"));
    const crossApp = new Set(apps.map((file) => file.split("/")[1])).size > 1;
    const packageVsApp = packages.length > 0 && apps.length > 0;
    if (!crossApp && !packageVsApp) continue;
    const leftover = group.filter(
      (file, index) =>
        !group.slice(index + 1).some((other) => isAllowlisted(policy, file, other)),
    );
    if (leftover.length > 1) {
      violations.push(`exact file clones: ${group.join(" <-> ")}`);
    }
  }
  return violations;
}

function selfTest() {
  const tmp = path.join(ROOT, ".github/scripts/.dup-self-test");
  fs.mkdirSync(tmp, { recursive: true });
  const positive = path.join(tmp, "positive.ts");
  fs.writeFileSync(
    positive,
    "export function validateJsonValue(value: unknown) { return value; }\n",
  );
  const source = fs.readFileSync(positive, "utf8");
  const caught = SENTINELS[0].pattern.test(source);
  fs.rmSync(tmp, { recursive: true, force: true });
  if (!caught) {
    throw new Error("self-test failed: sentinel did not match positive control");
  }
  const owner = fs.readFileSync(
    path.join(ROOT, "packages/shared/src/json-value.ts"),
    "utf8",
  );
  if (!SENTINELS[0].pattern.test(owner)) {
    throw new Error("self-test failed: owner is missing validateJsonValue");
  }
  console.log("self-test ok");
}

function main() {
  if (process.argv.includes("--self-test")) {
    selfTest();
    return;
  }

  const policy = loadPolicy();
  const expired = policy.allowances.filter((item) => {
    if (item.permanent === true || item.boundary === "permanent") return false;
    if (!item.expires) return true;
    return Date.parse(item.expires) < Date.now();
  });
  if (expired.length) {
    console.error("Expired duplication allowances:");
    for (const item of expired) console.error(`- ${item.id}`);
    process.exit(1);
  }

  const files = [
    ...walk(path.join(ROOT, "apps")),
    ...walk(path.join(ROOT, "packages")),
  ];

  const violations = [
    ...checkSentinels(files),
    ...checkExactFiles(files, policy),
  ];

  if (violations.length) {
    console.error(`Source duplication gate failed (${violations.length}):`);
    for (const item of violations.slice(0, 80)) console.error(`- ${item}`);
    if (violations.length > 80) {
      console.error(`- … ${violations.length - 80} more`);
    }
    process.exit(1);
  }

  console.log(`Source duplication gate passed (${files.length} files).`);
}

main();
