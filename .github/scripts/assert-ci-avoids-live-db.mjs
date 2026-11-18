#!/usr/bin/env node
/**
 * Fail if a workflow can open the live database.
 * The backup workflow is the only allowlisted reader of SUPABASE_DB_URL.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const FORBIDDEN = [
  'secrets.SUPABASE_DB_URL',
  'secrets.LOMI_LIVE_KEY',
  'secrets.SUPABASE_SERVICE_ROLE_KEY',
  'secrets.SUPABASE_SECRET_KEY',
  'secrets.DB_SECRET_KEY',
  'secrets.SUPABASE_URL',
  'secrets.SUPABASE_ANON_KEY',
  'secrets.SUPABASE_PUBLISHABLE_KEY',
];

const DB_URL = 'secrets.SUPABASE_DB_URL';

function parseArgs(argv) {
  const roots = [];
  const allowDbUrl = new Set();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--allow-db-url') {
      const next = argv[i + 1];
      if (!next) throw new Error('--allow-db-url needs a workflow path');
      allowDbUrl.add(next);
      i += 1;
      continue;
    }
    roots.push(arg);
  }
  if (roots.length === 0) roots.push('.github/workflows');
  return { roots, allowDbUrl };
}

function workflowsIn(dir, found) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) workflowsIn(path, found);
    else if (name.endsWith('.yml') || name.endsWith('.yaml')) found.push(path);
  }
}

function matchesAllow(file, allowDbUrl) {
  const normalized = file.split('\\').join('/');
  for (const allowed of allowDbUrl) {
    if (normalized === allowed || normalized.endsWith(`/${allowed}`)) return true;
  }
  return false;
}

const { roots, allowDbUrl } = parseArgs(process.argv.slice(2));
const files = [];
for (const root of roots) workflowsIn(root, files);

const failures = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const backup = matchesAllow(file, allowDbUrl);
  for (const token of FORBIDDEN) {
    if (!text.includes(token)) continue;
    if (backup && token === DB_URL) continue;
    failures.push(`${file} uses ${token}`);
  }
}

if (failures.length > 0) {
  console.error(
    'CI must not open the live database. Only the backup workflow may use secrets.SUPABASE_DB_URL.',
  );
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

console.log(`Live database guard ok (${files.length} workflows).`);
