/* @proprietary license */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { docsLinkShouldScroll } from '@/lib/docs-hash';
import { translate } from '@/lib/i18n/translations';
import {
  findMcpTwin,
  mcpExcludedOperationKeys,
  mcpTwinAnchor,
  mcpTwinHref,
  restDocsHrefFromMdxFile,
} from '@/lib/mcp-twins';

test('maps REST checkout create to lomi_checkout action=create', () => {
  const twin = findMcpTwin('POST', '/checkout-sessions');
  assert.ok(twin);
  assert.equal(twin.tool, 'lomi_checkout');
  assert.equal(twin.action, 'create');
  assert.equal(twin.operationKey, 'POST /checkout-sessions');
  assert.equal(mcpTwinAnchor(twin.tool, twin.action), 'lomi_checkout-create');
  assert.equal(
    mcpTwinHref(twin.tool, twin.action),
    '/build/mcp#lomi_checkout-create',
  );
});

test('does not twin MCP-excluded operations', () => {
  assert.equal(findMcpTwin('POST', '/charge/card'), undefined);
  assert.equal(findMcpTwin('POST', '/usage/events'), undefined);
  assert.ok(mcpExcludedOperationKeys().has('POST /charge/card'));
  assert.ok(mcpExcludedOperationKeys().has('POST /usage/events'));
});

test('renders bilingual twin labels', () => {
  assert.equal(translate('twins.mcp', 'en'), 'Same operation in MCP');
  assert.equal(translate('twins.mcp', 'fr'), 'Même opération en MCP');
  assert.equal(translate('twins.rest', 'en'), 'Same operation in the API');
  assert.equal(translate('twins.rest', 'fr'), 'Même opération dans l’API');
  assert.equal(translate('twins.action', 'en'), 'action');
  assert.equal(translate('twins.action', 'fr'), 'action');
});

test('hash twin links skip Next scroll-to-top', () => {
  assert.equal(docsLinkShouldScroll('/build/mcp#lomi_checkout-create'), false);
  assert.equal(
    docsLinkShouldScroll(
      '/api/checkout-sessions/CheckoutSessionsController_create',
    ),
    true,
  );
});

test('derives REST docs hrefs from hand-authored MDX paths', () => {
  assert.equal(
    restDocsHrefFromMdxFile(
      'content/docs/api/checkout-sessions/CheckoutSessionsController_create.mdx',
    ),
    '/api/checkout-sessions/CheckoutSessionsController_create',
  );
  assert.equal(
    restDocsHrefFromMdxFile('content/docs/api/checkout-sessions/index.mdx'),
    null,
  );
});
