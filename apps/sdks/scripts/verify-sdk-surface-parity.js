#!/usr/bin/env node
/**
 * Ensures sdk.* method manifests match TypeScript canonical output.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { HANDWRITTEN_SDK_PROPERTIES } from './public-sdk-operations.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sdksRoot = join(__dirname, '..');
const isObjectRecord = (value) =>
  value !== null && Object(value) === value && !Array.isArray(value);

const canonicalPath = join(
  sdksRoot,
  'ts/src/generated/sdk-public-methods.json',
);

function loadSdk(path) {
  const j = JSON.parse(readFileSync(path, 'utf-8'));
  if (!isObjectRecord(j.sdk)) {
    throw new Error(`${path}: missing sdk object`);
  }
  return j.sdk;
}

/**
 * Hand-written Network modules (`transfers`, `balance`, `network`) are not part
 * of the generated manifests, so they are ignored here regardless of language.
 * @param {Record<string, string[]>} a
 */
function sortManifest(a) {
  /** @type {Record<string, string[]>} */
  const out = {};
  for (const k of Object.keys(a).sort()) {
    if (HANDWRITTEN_SDK_PROPERTIES.has(k)) continue;
    out[k] = [...a[k]].sort();
  }
  return out;
}

function assertEqual(lhs, rhs, label) {
  const js = JSON.stringify(lhs);
  const jr = JSON.stringify(rhs);
  if (js !== jr) {
    console.error(`Mismatch vs TypeScript (${label}):`);
    console.error(`Expected keys: ${Object.keys(sortManifest(lhs)).join(',')}`);
    console.error(`Got keys:    ${Object.keys(sortManifest(rhs)).join(',')}`);
    throw new Error(`SDK manifest parity failed: ${label}`);
  }
}

const tsSdk = sortManifest(loadSdk(canonicalPath));

const checks = [
  {
    label: 'python',
    path: join(sdksRoot, 'python/lomi/sdk_python_methods.json'),
  },
  {
    label: 'go',
    path: join(sdksRoot, 'go/sdk_go_methods.json'),
  },
  {
    label: 'php',
    path: join(sdksRoot, 'php/src/sdk_php_methods.json'),
  },
];

let failed = 0;

for (const { label, path } of checks) {
  if (!existsSync(path)) {
    console.error(`Missing manifest: ${path} (${label}); run codegen first.`);
    failed++;
    continue;
  }
  try {
    const otherSdk = sortManifest(loadSdk(path));
    assertEqual(tsSdk, otherSdk, label);
    console.log(`OK — ${label} manifest matches TypeScript (${Object.keys(tsSdk).length} services)`);
  } catch (e) {
    console.error(String(e.message || e));
    failed++;
  }
}

if (failed) {
  process.exit(1);
}
