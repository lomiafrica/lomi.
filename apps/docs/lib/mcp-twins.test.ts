/* @proprietary license */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { docsLinkShouldScroll } from '@/lib/docs-hash';
import { translate } from '@/lib/i18n/translations';
import { MCP_CATALOG_CATEGORIES } from '@/lib/mcp-catalog';
import {
  findMcpTwin,
  listMcpToolGroups,
  mcpCategoryForGroup,
  mcpExcludedOperationKeys,
  mcpTwinAnchor,
  mcpTwinHref,
  listRestDocsHrefs,
  restDocsHrefFromMdxFile,
} from '@/lib/mcp-twins';
import { REST_API_SIDEBAR_GROUPS } from '@/lib/scripts/manual-api/constants';

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
  assert.ok(mcpExcludedOperationKeys().has('POST /support-requests'));
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

test('derives catalog categories from REST path and auth mode', () => {
  const byTool = new Map(
    listMcpToolGroups().map((group) => [group.tool, group]),
  );
  const checkout = byTool.get('lomi_checkout');
  const customers = byTool.get('lomi_customers');
  const balance = byTool.get('lomi_balance');
  const organization = byTool.get('lomi_organization');
  const webhooks = byTool.get('lomi_webhooks');
  const provision = byTool.get('lomi_provision');
  const partners = byTool.get('lomi_partners');
  assert.ok(checkout);
  assert.ok(customers);
  assert.ok(balance);
  assert.ok(organization);
  assert.ok(webhooks);
  assert.ok(provision);
  assert.ok(partners);
  assert.equal(mcpCategoryForGroup(checkout), 'accept');
  assert.equal(mcpCategoryForGroup(customers), 'commerce');
  assert.equal(mcpCategoryForGroup(balance), 'money');
  assert.equal(mcpCategoryForGroup(organization), 'platform');
  assert.equal(mcpCategoryForGroup(webhooks), 'operations');
  assert.equal(mcpCategoryForGroup(provision), 'agents');
  assert.equal(mcpCategoryForGroup(partners), 'agents');

  for (const group of byTool.values()) {
    assert.ok(
      (MCP_CATALOG_CATEGORIES as readonly string[]).includes(
        mcpCategoryForGroup(group),
      ),
    );
  }

  const mappedSeparators = new Set([
    '---Accept payments---',
    '---Manage commerce---',
    '---Move money---',
    '---Platform---',
    '---Operations---',
  ]);
  for (const group of REST_API_SIDEBAR_GROUPS) {
    assert.ok(
      mappedSeparators.has(group.separator),
      `unmapped API sidebar group ${group.separator}`,
    );
  }
});

test('renders bilingual MCP catalog labels', () => {
  assert.equal(translate('mcpIndex.category.accept', 'en'), 'Accept payments');
  assert.equal(
    translate('mcpIndex.category.accept', 'fr'),
    'Encaisser des paiements',
  );
  assert.equal(translate('mcpIndex.empty', 'en'), 'No matching tools');
  assert.equal(translate('mcpIndex.empty', 'fr'), 'Aucun outil correspondant');
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
  assert.equal(
    listRestDocsHrefs().get('POST /checkout-sessions'),
    '/api/checkout-sessions/CheckoutSessionsController_create',
  );
});
