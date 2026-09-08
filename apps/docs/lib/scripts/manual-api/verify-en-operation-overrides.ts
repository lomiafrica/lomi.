/* @proprietary license */
/**
 * Ensures every public merchant operation in openapi.json has EN copy overrides.
 * Run: pnpm exec tsx lib/scripts/manual-api/verify-en-operation-overrides.ts (from apps/docs)
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isPublicRestApiOperation } from '@/lib/scripts/manual-api/constants';
import {
  collectPublicOperations,
  isEnOperationId,
} from '@/lib/scripts/manual-api/render-operation-mdx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const openApiPath = join(__dirname, '..', '..', '..', 'openapi.json');

const raw = readFileSync(openApiPath, 'utf-8');
// SAFETY: Boundary value matches the asserted domain type at this call site.
const spec = JSON.parse(raw) as Parameters<typeof collectPublicOperations>[0];

const merchant = collectPublicOperations(spec).filter((o) =>
  isPublicRestApiOperation(o.method, o.path),
);

const missing = merchant.filter((o) => !isEnOperationId(o.operationId));

if (missing.length > 0) {
  console.error(
    'verify-en-operation-overrides: missing EN_OPERATION_COPY for:',
  );
  for (const m of missing.sort((a, b) =>
    a.operationId.localeCompare(b.operationId),
  )) {
    console.error(
      `  - ${m.operationId}  (${m.method.toUpperCase()} ${m.path})`,
    );
  }
  process.exit(1);
}

console.log(
  `verify-en-operation-overrides: ok (${merchant.length} merchant operations)`,
);
