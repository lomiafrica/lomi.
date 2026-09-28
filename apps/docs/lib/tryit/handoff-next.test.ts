/* @proprietary license */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DOCS_HANDOFF_FALLBACK, safeDocsHandoffNext } from './handoff-next';

test('keeps a same-origin docs path', () => {
  assert.equal(safeDocsHandoffNext('/api'), '/api');
  assert.equal(
    safeDocsHandoffNext('/api/checkout-sessions/Create'),
    '/api/checkout-sessions/Create',
  );
});

test('rejects open redirects and falls back to /api', () => {
  assert.equal(safeDocsHandoffNext(null), DOCS_HANDOFF_FALLBACK);
  assert.equal(safeDocsHandoffNext('//evil.example'), DOCS_HANDOFF_FALLBACK);
  assert.equal(
    safeDocsHandoffNext('https://evil.example'),
    DOCS_HANDOFF_FALLBACK,
  );
  assert.equal(safeDocsHandoffNext('/docs/api'), '/docs/api');
});
