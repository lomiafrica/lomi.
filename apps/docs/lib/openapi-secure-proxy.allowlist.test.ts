/* @proprietary license */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createSecureOpenApiProxyHandlers,
  getSandboxAllowedOrigins,
  isOriginAllowedForProxy,
  resolveProxyRedirectTarget,
} from './openapi-secure-proxy';

test('defaults to sandbox production origin', () => {
  const origins = getSandboxAllowedOrigins();
  assert.ok(origins.includes('https://sandbox.api.lomi.africa'));
});

test('allows extra origins from LOMI_DOCS_SANDBOX_ALLOWED_ORIGINS', () => {
  process.env.LOMI_DOCS_SANDBOX_ALLOWED_ORIGINS =
    'http://127.0.0.1:3333,http://localhost:9999';
  try {
    const origins = getSandboxAllowedOrigins();
    assert.ok(origins.includes('http://127.0.0.1:3333'));
    assert.ok(origins.includes('http://localhost:9999'));
  } finally {
    delete process.env.LOMI_DOCS_SANDBOX_ALLOWED_ORIGINS;
  }
});

test('rejects wrong host and non-http(s) URLs', () => {
  const list = ['https://sandbox.api.lomi.africa'];
  assert.equal(
    isOriginAllowedForProxy('https://sandbox.api.lomi.africa/foo', list),
    true,
  );
  assert.equal(
    isOriginAllowedForProxy('https://api.lomi.africa/accounts', list),
    false,
  );
  assert.equal(isOriginAllowedForProxy('file:///etc/passwd', list), false);
  assert.equal(
    isOriginAllowedForProxy(
      'https://user:pass@sandbox.api.lomi.africa/foo',
      list,
    ),
    false,
  );
});

test('refuses redirects that leave the allowlist', () => {
  const list = ['https://sandbox.api.lomi.africa'];
  const base = 'https://sandbox.api.lomi.africa/health';
  assert.equal(resolveProxyRedirectTarget(200, null, base, list), 'none');
  assert.equal(
    resolveProxyRedirectTarget(302, 'https://evil.example/x', base, list),
    'refuse',
  );
  assert.equal(
    resolveProxyRedirectTarget(302, 'http://169.254.169.254/', base, list),
    'refuse',
  );
  assert.equal(
    resolveProxyRedirectTarget(302, '/ready', base, list),
    'https://sandbox.api.lomi.africa/ready',
  );
});

test('proxy does not follow a redirect off the sandbox origin', async () => {
  const calls: string[] = [];
  const fetchImpl: typeof fetch = async (input) => {
    const url = input instanceof Request ? input.url : String(input);
    calls.push(url);
    return new Response(null, {
      status: 302,
      headers: { Location: 'http://169.254.169.254/latest/meta-data' },
    });
  };
  const handlers = createSecureOpenApiProxyHandlers({
    getInjectionContext: async () => ({
      shouldInjectTestKey: false,
      activeOrganizationId: null,
    }),
    resolveTestKey: async () => null,
    fetchImpl,
  });
  const target = encodeURIComponent('https://sandbox.api.lomi.africa/health');
  const response = await handlers.GET(
    new Request(`https://docs.lomi.africa/api/proxy?url=${target}`),
  );
  assert.equal(response.status, 400);
  assert.deepEqual(calls, ['https://sandbox.api.lomi.africa/health']);
});
