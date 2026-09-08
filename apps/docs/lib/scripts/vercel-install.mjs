#!/usr/bin/env node

/**
 * Vercel docs install entry. Vercel may run install from the repo root or
 * from apps/docs; this file locates the shared installer from its own path.
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const root = path.resolve(docsDir, '../..');
const installer = path.join(
  root,
  'tooling/scripts/install-app-with-packages.mjs',
);

const result = spawnSync(process.execPath, [installer, 'apps/docs'], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
