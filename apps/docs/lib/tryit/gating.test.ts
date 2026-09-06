/* @proprietary license */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  canAttachTestKey,
  canSendSandbox,
  isDocsApiOperationPath,
  parseTryitOrgId,
  selectTryitOrganizationId,
} from './gating';

test('gates Try-it to hand-authored API operation pages', () => {
  assert.equal(
    isDocsApiOperationPath(
      '/api/checkout-sessions/CheckoutSessionsController_create',
    ),
    true,
  );
  assert.equal(isDocsApiOperationPath('/api/checkout-sessions'), false);
  assert.equal(isDocsApiOperationPath('/api'), false);
  assert.equal(isDocsApiOperationPath('/openapi/checkout-sessions'), false);
  assert.equal(isDocsApiOperationPath('/build/mcp'), false);
});

test('requires an explicit organization when more than one is available', () => {
  assert.equal(
    canAttachTestKey({
      signedIn: true,
      organizations: [{ id: 'org_a' }, { id: 'org_b' }],
      selectedOrganizationId: null,
    }),
    false,
  );
  assert.equal(
    canAttachTestKey({
      signedIn: true,
      organizations: [{ id: 'org_a' }, { id: 'org_b' }],
      selectedOrganizationId: 'org_b',
    }),
    true,
  );
  assert.equal(
    canAttachTestKey({
      signedIn: true,
      organizations: [{ id: 'org_a' }],
      selectedOrganizationId: null,
    }),
    true,
  );
});

test('rejects unsigned sessions and accounts without test keys', () => {
  assert.equal(
    canAttachTestKey({
      signedIn: false,
      organizations: [{ id: 'org_a' }],
      selectedOrganizationId: 'org_a',
    }),
    false,
  );
  assert.equal(
    canAttachTestKey({
      signedIn: true,
      organizations: [],
      selectedOrganizationId: null,
    }),
    false,
  );
});

test('selects the cookie org when it belongs to the session', () => {
  assert.equal(parseTryitOrgId('not-a-uuid'), null);
  assert.equal(
    selectTryitOrganizationId(
      [
        { id: '11111111-1111-4111-8111-111111111111' },
        { id: '22222222-2222-4222-8222-222222222222' },
      ],
      '22222222-2222-4222-8222-222222222222',
    ),
    '22222222-2222-4222-8222-222222222222',
  );
  assert.equal(
    selectTryitOrganizationId(
      [{ id: '11111111-1111-4111-8111-111111111111' }],
      null,
    ),
    '11111111-1111-4111-8111-111111111111',
  );
  assert.equal(
    selectTryitOrganizationId(
      [
        { id: '11111111-1111-4111-8111-111111111111' },
        { id: '22222222-2222-4222-8222-222222222222' },
      ],
      null,
    ),
    null,
  );
});

test('canSendSandbox requires an attachable session and a test key', () => {
  assert.equal(
    canSendSandbox({
      signedIn: true,
      organizations: [{ id: 'org_a' }],
      selectedOrganizationId: 'org_a',
      hasTestApiKey: true,
    }),
    true,
  );
  assert.equal(
    canSendSandbox({
      signedIn: true,
      organizations: [{ id: 'org_a' }],
      selectedOrganizationId: 'org_a',
      hasTestApiKey: false,
    }),
    false,
  );
  assert.equal(
    canSendSandbox({
      signedIn: true,
      organizations: [{ id: 'org_a' }, { id: 'org_b' }],
      selectedOrganizationId: null,
      hasTestApiKey: true,
    }),
    false,
  );
});
