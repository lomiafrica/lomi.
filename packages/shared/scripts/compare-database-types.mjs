#!/usr/bin/env node
/**
 * Compare committed prod types vs live test-project types (generated in memory).
 * Usage: node packages/shared/scripts/compare-database-types.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROD_PROJECT_ID = "mdswvokxrnfggrujsfjd";
// Replaces retired izulmkzzxokexxvyetar (gone 2026-09-09).
// As of 2026-09-14 this project has no loaded schema; compare will fail
// loudly until the canonical migrations are applied there.
const TEST_PROJECT_ID = "aznvppizdjrncqhnknrc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prodPath = path.join(__dirname, "../src/database.ts");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function generateTestTypes() {
  return execFileSync(
    "supabase",
    ["gen", "types", "typescript", "--project-id", TEST_PROJECT_ID],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
}

function normalize(s) {
  return s.replace(/\s+/g, " ").trim();
}

function publicBlock(source) {
  const start = source.indexOf("  public: {");
  if (start === -1) return "";
  let depth = 0;
  let i = start + "  public: {".length - 1;
  for (; i < source.length; i++) {
    const c = source[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return "";
}

function extractPublicSection(source, section) {
  const block = publicBlock(source);
  const anchor = `\n    ${section}: {`;
  const start = block.indexOf(anchor);
  if (start === -1) return new Map();

  let i = start + anchor.length;
  let depth = 1;
  const bodyStart = i;
  for (; i < block.length; i++) {
    const c = block[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const body = block.slice(bodyStart, i);
  const blocks = new Map();
  const re = /\n      ([a-z_][a-z0-9_]*): \{/gi;
  const names = [];
  let m;
  while ((m = re.exec(body)) !== null) {
    names.push({ name: m[1], index: m.index });
  }
  for (let n = 0; n < names.length; n++) {
    const { name, index } = names[n];
    const blockEnd = n + 1 < names.length ? names[n + 1].index : body.length;
    blocks.set(name, body.slice(index, blockEnd).trim());
  }
  return blocks;
}

function diffSection(label, prodMap, testMap) {
  const onlyProd = [...prodMap.keys()].filter((k) => !testMap.has(k)).sort();
  const onlyTest = [...testMap.keys()].filter((k) => !prodMap.has(k)).sort();
  const changed = [...prodMap.keys()]
    .filter(
      (k) =>
        testMap.has(k) && normalize(prodMap.get(k)) !== normalize(testMap.get(k)),
    )
    .sort();
  return { label, onlyProd, onlyTest, changed, prodMap, testMap };
}

function printSection(r) {
  console.log(`## ${r.label}`);
  console.log(`- only in PROD: ${r.onlyProd.length}`);
  if (r.onlyProd.length) console.log(`  ${r.onlyProd.join(", ")}`);
  console.log(`- only in TEST: ${r.onlyTest.length}`);
  if (r.onlyTest.length) console.log(`  ${r.onlyTest.join(", ")}`);
  console.log(`- changed: ${r.changed.length}`);
  if (r.changed.length) console.log(`  ${r.changed.join(", ")}`);
  console.log("");
}

const prod = read(prodPath);
const test = generateTestTypes();

const fnDiff = diffSection(
  "Functions (public)",
  extractPublicSection(prod, "Functions"),
  extractPublicSection(test, "Functions"),
);
const tableDiff = diffSection(
  "Tables (public)",
  extractPublicSection(prod, "Tables"),
  extractPublicSection(test, "Tables"),
);
const enumDiff = diffSection(
  "Enums (public)",
  extractPublicSection(prod, "Enums"),
  extractPublicSection(test, "Enums"),
);

console.log("# packages/shared/src/database.ts (PROD) vs live test project types\n");
console.log(`PROD project: ${PROD_PROJECT_ID}`);
console.log(`TEST project: ${TEST_PROJECT_ID}\n`);
console.log(
  `Functions parsed — prod: ${fnDiff.prodMap.size}, test: ${fnDiff.testMap.size}\n`,
);

printSection(fnDiff);
printSection(tableDiff);
printSection(enumDiff);

console.log("## Interpretation");
console.log(
  "- **only in PROD** → object exists on prod but not test (prod migration ahead, or test reset missing something)",
);
console.log(
  "- **only in TEST** → staged migration fixes applied on test only (expected until prod deploy)",
);
console.log(
  "- **changed** → both have it but signature/Row differs — compare against intended SQL migration\n",
);

const migrationRpcs = [
  "fetch_transactions",
  "create_beneficiary_payout",
  "create_payout_record",
  "finalize_cancel_at_period_end_subscriptions",
  "prepare_checkout_gim_payment",
  "is_whatsapp_transactional_available",
  "expire_pending_transactions_with_custom_status",
  "create_organization",
  "get_beneficiary_payout_api",
  "update_customer_subscription",
  "cancel_customer_subscription",
  "get_organization_api_interactions",
  "update_platform_channel_balance",
  "process_scheduled_invoices",
  "get_platform_setting",
];

console.log("## Migration-sensitive RPCs\n");
for (const fn of migrationRpcs) {
  const inProd = fnDiff.prodMap.has(fn);
  const inTest = fnDiff.testMap.has(fn);
  if (!inProd && !inTest) {
    console.log(`- ${fn}: not in PostgREST types (internal/service_role RPC)`);
    continue;
  }
  if (!inProd) console.log(`- ${fn}: **only TEST**`);
  else if (!inTest) console.log(`- ${fn}: **only PROD**`);
  else {
    const same =
      normalize(fnDiff.prodMap.get(fn)) === normalize(fnDiff.testMap.get(fn));
    console.log(`- ${fn}: ${same ? "identical" : "**DIFFERS**"}`);
  }
}

if (fnDiff.changed.length) {
  console.log("\n## Changed functions (snippets)\n");
  for (const fn of fnDiff.changed) {
    console.log(`### ${fn}`);
    console.log("PROD:", fnDiff.prodMap.get(fn).slice(0, 600));
    console.log("TEST:", fnDiff.testMap.get(fn).slice(0, 600));
    console.log("");
  }
}

if (
  tableDiff.onlyProd.length ||
  tableDiff.onlyTest.length ||
  tableDiff.changed.length
) {
  console.log("## Changed / unique tables\n");
  if (tableDiff.onlyProd.length)
    console.log("Only PROD:", tableDiff.onlyProd.join(", "));
  if (tableDiff.onlyTest.length)
    console.log("Only TEST:", tableDiff.onlyTest.join(", "));
  if (tableDiff.changed.length) {
    for (const t of tableDiff.changed) {
      console.log(`\n### table ${t}`);
      console.log("PROD:", tableDiff.prodMap.get(t).slice(0, 400));
      console.log("TEST:", tableDiff.testMap.get(t).slice(0, 400));
    }
  }
}

if (enumDiff.changed.length) {
  console.log("\n## Changed enums\n");
  for (const e of enumDiff.changed) {
    console.log(`### ${e}`);
    console.log("PROD:", enumDiff.prodMap.get(e));
    console.log("TEST:", enumDiff.testMap.get(e));
  }
}
