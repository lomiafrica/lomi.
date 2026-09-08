import http from 'node:http';
import { afterEach, describe, expect, it, beforeEach, vi } from 'vitest';

import manifestJson from '../src/generated/tools-manifest.json' with { type: 'json' };
import { createHttpApplication } from '../src/http.js';
import { parseManifest } from '../src/manifest-parse.js';
import { isString, validateJsonValue, type JsonObject } from "@lomi./shared";

const ORIGINAL_ENV = { ...process.env };

function listen(
  app: ReturnType<typeof createHttpApplication>,
): Promise<{ server: http.Server; port: number }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (!addr || isString(addr)) {
        reject(new Error('expected TCP AddressInfo'));
        return;
      }
      resolve({ server, port: addr.port });
    });
    server.on('error', reject);
  });
}

describe('createHttpApplication', () => {
  let server: http.Server | undefined;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.LOMI_MCP_ALLOWED_HOSTS = '127.0.0.1';
    delete process.env.LOMI_MCP_BEARER_TOKEN;
    delete process.env.LOMI_MCP_RATE_LIMIT_RPM;
    delete process.env.LOMI_API_URL_ALLOWLIST;
  });

  afterEach(async () => {
    if (server) {
      await new Promise<void>((resolve) => server!.close(() => resolve()));
      server = undefined;
    }
    process.env = { ...ORIGINAL_ENV };
  });

  it('GET /health returns 200 JSON', async () => {
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.service).toBe('lomi-mcp');
  });

  it('GET /ready returns 200 when env is valid', async () => {
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/ready`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ready).toBe(true);
  });

  it('GET /mcp without any credential returns 401 missing_credentials when gated', async () => {
    process.env.LOMI_MCP_BEARER_TOKEN = 'secret-gate';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp`);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error_code).toBe('missing_credentials');
    const wwwAuth = res.headers.get('www-authenticate');
    expect(wwwAuth).toMatch(/Bearer/);
    expect(wwwAuth).toMatch(/resource_metadata/);
  });

  it('GET /mcp with a non-credential bearer returns invalid_credentials', async () => {
    process.env.LOMI_MCP_BEARER_TOKEN = 'secret-gate';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp`, {
      headers: { Authorization: 'Bearer wrong' },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error_code).toBe('invalid_credentials');
  });

  it('GET /mcp with only x-lomi-api-key passes the transport gate when gated', async () => {
    process.env.LOMI_MCP_BEARER_TOKEN = 'secret-gate';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp`, {
      headers: { 'x-lomi-api-key': 'lomi_sk_test_1234567890abcd' },
    });
    // Gate passes (not 401); GET without a session id then yields 400.
    expect(res.status).not.toBe(401);
    expect(res.status).toBe(400);
  });

  it('GET /mcp with a lomi_ bearer passes the transport gate when gated', async () => {
    process.env.LOMI_MCP_BEARER_TOKEN = 'secret-gate';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp`, {
      headers: { Authorization: 'Bearer lomi_sk_test_1234567890abcd' },
    });
    expect(res.status).not.toBe(401);
    expect(res.status).toBe(400);
  });

  it('DELETE /mcp without session returns 400', async () => {
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp`, {
      method: 'DELETE',
    });
    expect(res.status).toBe(400);
  });

  it('GET /ready returns 503 in production without transport bearer', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.LOMI_MCP_BEARER_TOKEN;
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/ready`);
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ready).toBe(false);
  });

  it('GET /.well-known/oauth-protected-resource returns metadata', async () => {
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(
      `http://127.0.0.1:${ctx.port}/.well-known/oauth-protected-resource`,
    );
    expect(res.status).toBe(200);
    // SAFETY: OAuth metadata response is a JSON object for assertion fields.

    const body = (await res.json()) as JsonObject;
    expect(body.resource).toBeTruthy();
  });

  it('GET path-scoped /.well-known/oauth-protected-resource/mcp returns metadata', async () => {
    process.env.LOMI_MCP_RESOURCE_URL = 'https://mcp.lomi.africa/mcp';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(
      `http://127.0.0.1:${ctx.port}/.well-known/oauth-protected-resource/mcp`,
    );
    expect(res.status).toBe(200);
    // SAFETY: OAuth metadata response is a JSON object for assertion fields.

    const body = (await res.json()) as JsonObject;
    expect(body.resource).toBe('https://mcp.lomi.africa/mcp');
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    expect(res.headers.get('cache-control')).toMatch(/max-age=/);
  });

  it('POST /mcp without session credentials returns WWW-Authenticate challenge', async () => {
    delete process.env.LOMI_MCP_BEARER_TOKEN;
    delete process.env.LOMI_PROVISIONING_KEY;
    delete process.env.LOMI_SECRET_KEY;
    delete process.env.X_API_KEY;
    process.env.LOMI_MCP_RESOURCE_URL = 'https://mcp.lomi.africa/mcp';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'test', version: '0' },
        },
      }),
    });
    expect(res.status).toBe(401);
    const wwwAuth = res.headers.get('www-authenticate');
    expect(wwwAuth).toMatch(/Bearer/);
    expect(wwwAuth).toMatch(/resource_metadata/);
    expect(wwwAuth).toMatch(/oauth-protected-resource\/mcp/);
  });

  it('POST /mcp with a stale OAuth token returns invalid_token challenge', async () => {
    delete process.env.LOMI_MCP_BEARER_TOKEN;
    delete process.env.LOMI_PROVISIONING_KEY;
    delete process.env.LOMI_SECRET_KEY;
    delete process.env.X_API_KEY;
    delete process.env.INTERNAL_API_KEY;
    delete process.env.CRON_SECRET;
    process.env.LOMI_MCP_RESOURCE_URL = 'https://mcp.lomi.africa/mcp';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer lomi_oat_stale',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'test', version: '0' },
        },
      }),
    });
    expect(res.status).toBe(401);
    const wwwAuth = res.headers.get('www-authenticate');
    expect(wwwAuth).toMatch(/invalid_token/);
    expect(wwwAuth).toMatch(/resource_metadata/);
    const body = (await res.json()) as JsonObject;
    expect(body.error_code).toBe('invalid_oauth_token');
  });

  it('POST /mcp/guest initialize is not 401 when gated', async () => {
    process.env.LOMI_MCP_BEARER_TOKEN = 'secret-gate';
    delete process.env.LOMI_PROVISIONING_KEY;
    delete process.env.LOMI_SECRET_KEY;
    delete process.env.X_API_KEY;
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp/guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'guest-test', version: '0' },
        },
      }),
    });
    expect(res.status).not.toBe(401);
    expect(res.status).toBe(200);
  });

  it('GET /mcp/guest without a session is not 401 when gated', async () => {
    process.env.LOMI_MCP_BEARER_TOKEN = 'secret-gate';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp/guest`);
    expect(res.status).not.toBe(401);
    expect(res.status).toBe(400);
  });

  it('GET /mcp with lomi_oat_* bearer passes transport gate when gated', async () => {
    process.env.LOMI_MCP_BEARER_TOKEN = 'secret-gate';
    process.env.INTERNAL_API_KEY = 'test-internal-key';
    const realFetch = globalThis.fetch.bind(globalThis);
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
      async (input, init) => {
        const url = String(input);
        if (url.includes('/oauth/introspect/mcp')) {
          return new Response(
            JSON.stringify({
              active: true,
              grant_type: 'merchant',
              connection_key: 'lomi_sk_test_oauth_connection_key',
              access_level: 'read',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return realFetch(input, init);
      },
    );
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp`, {
      headers: { Authorization: 'Bearer lomi_oat_synth_test_token' },
    });
    fetchMock.mockRestore();
    expect(res.status).not.toBe(401);
    expect(res.status).toBe(400);
  });

  it('GET /mcp with unintrospectable lomi_oat_* is rejected when gated', async () => {
    process.env.LOMI_MCP_BEARER_TOKEN = 'secret-gate';
    delete process.env.INTERNAL_API_KEY;
    delete process.env.CRON_SECRET;
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    // Distinct token so a prior introspect cache entry cannot satisfy the gate.
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp`, {
      headers: { Authorization: 'Bearer lomi_oat_unconfigured_introspect_token' },
    });
    expect(res.status).toBe(401);
  });

  it('POST /mcp initialize with introspected lomi_oat_* opens a session', async () => {
    process.env.INTERNAL_API_KEY = 'test-internal-key';
    process.env.LOMI_MCP_RESOURCE_URL = 'https://mcp.lomi.africa/mcp';
    const realFetch = globalThis.fetch.bind(globalThis);
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
      async (input, init) => {
        const url = String(input);
        if (url.includes('/oauth/introspect/mcp')) {
          return new Response(
            JSON.stringify({
              active: true,
              grant_type: 'merchant',
              connection_key: 'lomi_sk_test_oauth_connection_key',
              access_level: 'read',
              scope: 'merchant.read',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return realFetch(input, init);
      },
    );

    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        Authorization: 'Bearer lomi_oat_test_session_token',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'test', version: '0' },
        },
      }),
    });
    fetchMock.mockRestore();
    expect(res.status).not.toBe(401);
  });

  it('rate limits MCP routes when LOMI_MCP_RATE_LIMIT_RPM is low', async () => {
    process.env.LOMI_MCP_RATE_LIMIT_RPM = '2';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const url = `http://127.0.0.1:${ctx.port}/mcp`;
    const r1 = await fetch(url);
    const r2 = await fetch(url);
    const r3 = await fetch(url);
    expect(r1.status).not.toBe(429);
    expect(r2.status).not.toBe(429);
    expect(r3.status).toBe(429);
  });

  it('GET /.well-known/mcp returns a public tools preview', async () => {
    process.env.LOMI_MCP_RESOURCE_URL = 'https://mcp.lomi.africa/mcp';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/.well-known/mcp`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as JsonObject;
    expect(body.mcp).toBe('https://mcp.lomi.africa/mcp');
    expect(body.mcp_guest).toBe('https://mcp.lomi.africa/mcp/guest');
    expect(Array.isArray(body.tools_preview)).toBe(true);
  });

  it('GET /server-card returns MCP server card metadata', async () => {
    process.env.LOMI_MCP_RESOURCE_URL = 'https://mcp.lomi.africa/mcp';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/server-card`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as JsonObject;
    expect(body.name).toBe('io.lomi/mcp');
    expect(body.title).toBe('lomi.');
  });

  it('GET / returns HTML with an H1 for browsers', async () => {
    process.env.LOMI_MCP_RESOURCE_URL = 'https://mcp.lomi.africa/mcp';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/`, {
      headers: { Accept: 'text/html' },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/text\/html/);
    const body = await res.text();
    expect(body).toContain('<h1>lomi. MCP</h1>');
    expect(body).toContain('https://mcp.lomi.africa/mcp');
  });

  it('GET / returns markdown when Accept is text/markdown', async () => {
    process.env.LOMI_MCP_RESOURCE_URL = 'https://mcp.lomi.africa/mcp';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/`, {
      headers: { Accept: 'text/markdown' },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/text\/markdown/);
    const body = await res.text();
    expect(body).toContain('# lomi. MCP');
    expect(body).toContain('https://docs.lomi.africa/build/mcp');
  });

  it('GET unknown path returns markdown 404 when Accept is text/markdown', async () => {
    process.env.LOMI_MCP_RESOURCE_URL = 'https://mcp.lomi.africa/mcp';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(`http://127.0.0.1:${ctx.port}/no-such-agent-path`, {
      headers: { Accept: 'text/markdown' },
    });
    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toMatch(/text\/markdown/);
    const body = await res.text();
    expect(body).toContain('# Not found');
    expect(body).toContain('https://docs.lomi.africa/build/mcp');
  });

  it('GET /.well-known/oauth-authorization-server points at the API issuer', async () => {
    process.env.LOMI_OAUTH_ISSUER = 'https://api.lomi.africa';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const res = await fetch(
      `http://127.0.0.1:${ctx.port}/.well-known/oauth-authorization-server`,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as JsonObject;
    expect(body.issuer).toBe('https://api.lomi.africa');
    expect(body.authorization_endpoint).toBe(
      'https://api.lomi.africa/oauth/authorize',
    );
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('guest session gains merchant tools once provisioning returns a test key', async () => {
    delete process.env.LOMI_MCP_BEARER_TOKEN;
    delete process.env.LOMI_PROVISIONING_KEY;
    delete process.env.LOMI_SECRET_KEY;
    delete process.env.X_API_KEY;
    const realFetch = globalThis.fetch.bind(globalThis);
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
      async (input, init) => {
        const url = String(input);
        if (url.includes('/provisioning/merchants/') && url.endsWith('/api-keys')) {
          return new Response(
            JSON.stringify({
              test_secret_key: 'lomi_sk_test_guest_upgrade_key',
              test_publishable_key: 'lomi_pk_test_guest_upgrade_key',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return realFetch(input, init);
      },
    );
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const base = `http://127.0.0.1:${ctx.port}/mcp/guest`;

    const initRes = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'x-lomi-provisioning-key': 'lomi_prov_guest_upgrade',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'guest-upgrade-test', version: '0' },
        },
      }),
    });
    expect(initRes.status).toBe(200);
    const sessionId = initRes.headers.get('mcp-session-id');
    expect(sessionId).toBeTruthy();
    await initRes.text();

    const rpc = async (body: JsonObject): Promise<JsonObject> => {
      const res = await fetch(base, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
          'mcp-session-id': sessionId!,
        },
        body: JSON.stringify(body),
      });
      expect(res.status).toBe(200);
      return parseSseJsonRpc(await res.text());
    };
    const toolNames = async (id: number): Promise<string[]> => {
      const result = await rpc({ jsonrpc: '2.0', method: 'tools/list', id });
      const tools = (result.result as JsonObject).tools as JsonObject[];
      return tools.map((t) => String(t.name));
    };

    const before = await toolNames(2);
    expect(before).toContain('lomi_provision');
    expect(before).toContain('lomi_search_tools');
    expect(before).toContain('lomi_support');
    expect(before).not.toContain('lomi_checkout');

    // Standalone SSE stream receives server notifications.
    const streamController = new AbortController();
    const stream = await fetch(base, {
      headers: {
        Accept: 'text/event-stream',
        'mcp-session-id': sessionId!,
      },
      signal: streamController.signal,
    });
    expect(stream.status).toBe(200);
    const notifications = collectSseUntil(
      stream,
      'notifications/tools/list_changed',
      5000,
    );

    const call = await rpc({
      jsonrpc: '2.0',
      method: 'tools/call',
      id: 3,
      params: {
        name: 'lomi_provision',
        arguments: {
          action: 'api_keys',
          merchantId: '6f1d2c3e-4b5a-4c6d-8e9f-0a1b2c3d4e5f',
        },
      },
    });
    const callResult = call.result as JsonObject;
    expect(callResult.isError, JSON.stringify(callResult.content)).not.toBe(true);

    const after = await toolNames(4);
    expect(after).toContain('lomi_checkout');
    expect(after).toContain('lomi_customers');
    expect(after.filter((n) => n === 'lomi_search_tools')).toHaveLength(1);

    let sawListChanged = false;
    try {
      sawListChanged = await notifications;
    } finally {
      streamController.abort();
      fetchMock.mockRestore();
      await fetch(base, {
        method: 'DELETE',
        headers: { 'mcp-session-id': sessionId! },
      }).catch(() => undefined);
    }
    expect(sawListChanged).toBe(true);
  });

  it('rejects resuming an authenticated session with a different API key', async () => {
    delete process.env.LOMI_MCP_BEARER_TOKEN;
    process.env.LOMI_SECRET_KEY = 'lomi_sk_test_session_bind_a';
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const base = `http://127.0.0.1:${ctx.port}/mcp`;
    const initRes = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'x-lomi-api-key': 'lomi_sk_test_session_bind_a',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'bind-test', version: '0' },
        },
      }),
    });
    expect(initRes.status).toBe(200);
    const sessionId = initRes.headers.get('mcp-session-id');
    expect(sessionId).toBeTruthy();
    await initRes.text();

    const mismatch = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'mcp-session-id': sessionId!,
        'x-lomi-api-key': 'lomi_sk_test_session_bind_b',
      },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'tools/list', id: 2 }),
    });
    expect(mismatch.status).toBe(401);
    const body = (await mismatch.json()) as JsonObject;
    expect(String((body.error as JsonObject)?.message ?? '')).toMatch(
      /credential mismatch/,
    );
  });

  it('guest lomi_support file posts /contact and list asks for a merchant key', async () => {
    delete process.env.LOMI_MCP_BEARER_TOKEN;
    delete process.env.LOMI_SECRET_KEY;
    delete process.env.X_API_KEY;
    process.env.LOMI_API_URL = 'https://api.lomi.africa';
    const realFetch = globalThis.fetch.bind(globalThis);
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
      async (input, init) => {
        const url = String(input);
        if (url.endsWith('/contact')) {
          return new Response(
            JSON.stringify({ success: true, reference: 'docs-guest1' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return realFetch(input, init);
      },
    );
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const base = `http://127.0.0.1:${ctx.port}/mcp/guest`;
    const initRes = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'support-guest', version: '0' },
        },
      }),
    });
    expect(initRes.status).toBe(200);
    const sessionId = initRes.headers.get('mcp-session-id');
    expect(sessionId).toBeTruthy();
    await initRes.text();

    const rpc = async (body: JsonObject): Promise<JsonObject> => {
      const res = await fetch(base, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
          'mcp-session-id': sessionId!,
        },
        body: JSON.stringify(body),
      });
      expect(res.status).toBe(200);
      return parseSseJsonRpc(await res.text());
    };

    const fileCall = await rpc({
      jsonrpc: '2.0',
      method: 'tools/call',
      id: 2,
      params: {
        name: 'lomi_support',
        arguments: {
          action: 'file',
          email: 'friend@example.com',
          message: 'Wave paid but the receipt never arrived.',
          topic: 'billing',
        },
      },
    });
    const fileResult = fileCall.result as JsonObject;
    expect(fileResult.isError).not.toBe(true);
    const fileText = JSON.stringify(fileResult.content);
    expect(fileText).toContain('docs-guest1');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/contact'),
      expect.objectContaining({ method: 'POST' }),
    );

    const listCall = await rpc({
      jsonrpc: '2.0',
      method: 'tools/call',
      id: 3,
      params: {
        name: 'lomi_support',
        arguments: { action: 'list' },
      },
    });
    const listResult = listCall.result as JsonObject;
    expect(listResult.isError).toBe(true);
    expect(JSON.stringify(listResult.content)).toMatch(/merchant key/i);

    fetchMock.mockRestore();
  });

  it('merchant lomi_support file posts /support-requests', async () => {
    delete process.env.LOMI_MCP_BEARER_TOKEN;
    process.env.LOMI_SECRET_KEY = 'lomi_sk_test_support_merchant';
    process.env.LOMI_API_URL = 'https://api.lomi.africa';
    const realFetch = globalThis.fetch.bind(globalThis);
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
      async (input, init) => {
        const url = String(input);
        if (url.endsWith('/support-requests') && init?.method === 'POST') {
          return new Response(
            JSON.stringify({
              id: 'sr_mcp',
              category: 'billing',
              status: 'open',
              message: 'Wave paid but the receipt never arrived.',
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return realFetch(input, init);
      },
    );
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const base = `http://127.0.0.1:${ctx.port}/mcp`;
    const initRes = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'x-lomi-api-key': 'lomi_sk_test_support_merchant',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'support-merchant', version: '0' },
        },
      }),
    });
    expect(initRes.status).toBe(200);
    const sessionId = initRes.headers.get('mcp-session-id');
    expect(sessionId).toBeTruthy();
    await initRes.text();

    const callRes = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'mcp-session-id': sessionId!,
        'x-lomi-api-key': 'lomi_sk_test_support_merchant',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        id: 2,
        params: {
          name: 'lomi_support',
          arguments: {
            action: 'file',
            category: 'billing',
            message: 'Wave paid but the receipt never arrived.',
          },
        },
      }),
    });
    expect(callRes.status).toBe(200);
    const call = parseSseJsonRpc(await callRes.text());
    const callResult = call.result as JsonObject;
    expect(callResult.isError, JSON.stringify(callResult.content)).not.toBe(
      true,
    );
    expect(JSON.stringify(callResult.content)).toContain('sr_mcp');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/support-requests'),
      expect.objectContaining({ method: 'POST' }),
    );
    fetchMock.mockRestore();
  });

  it('guest tools list has no lomi_organization', async () => {
    delete process.env.LOMI_MCP_BEARER_TOKEN;
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const base = `http://127.0.0.1:${ctx.port}/mcp/guest`;
    const initRes = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'guest-org', version: '0' },
        },
      }),
    });
    expect(initRes.status).toBe(200);
    const sessionId = initRes.headers.get('mcp-session-id');
    await initRes.text();
    const listRes = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'mcp-session-id': sessionId!,
      },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'tools/list', id: 2 }),
    });
    const listed = parseSseJsonRpc(await listRes.text());
    const names = ((listed.result as JsonObject).tools as JsonObject[]).map(
      (t) => String(t.name),
    );
    expect(names).not.toContain('lomi_organization');
    expect(names).toContain('lomi_provision');
  });

  it('lomi_organization create adopts lomi_sk_test_* on the session', async () => {
    delete process.env.LOMI_MCP_BEARER_TOKEN;
    process.env.LOMI_SECRET_KEY = 'lomi_sk_test_org_start';
    process.env.LOMI_API_URL = 'https://api.lomi.africa';
    const seenKeys: string[] = [];
    const realFetch = globalThis.fetch.bind(globalThis);
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
      async (input, init) => {
        const url = String(input);
        const rawHeaders = init?.headers;
        let auth = '';
        if (rawHeaders instanceof Headers) {
          auth =
            rawHeaders.get('X-API-KEY') ??
            rawHeaders.get('x-api-key') ??
            '';
        } else if (rawHeaders && typeof rawHeaders === 'object') {
          const rec = rawHeaders as Record<string, string>;
          auth = rec['X-API-KEY'] ?? rec['x-api-key'] ?? rec['X-Api-Key'] ?? '';
        }
        if (url.includes('/organizations') && init?.method === 'POST') {
          seenKeys.push(auth);
          return new Response(
            JSON.stringify({
              organization_id: 'org-mcp',
              store_handle: 'acme',
              api_key: 'lomi_sk_test_adopted',
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (url.includes('/organizations') && (!init?.method || init.method === 'GET')) {
          seenKeys.push(auth);
          return new Response(JSON.stringify({ data: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return realFetch(input, init);
      },
    );
    const manifest = parseManifest(validateJsonValue(manifestJson));
    const app = createHttpApplication(manifest);
    const ctx = await listen(app);
    server = ctx.server;
    const base = `http://127.0.0.1:${ctx.port}/mcp`;
    const initRes = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'x-lomi-api-key': 'lomi_sk_test_org_start',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'initialize',
        id: 1,
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'org-create', version: '0' },
        },
      }),
    });
    expect(initRes.status).toBe(200);
    const sessionId = initRes.headers.get('mcp-session-id');
    await initRes.text();

    const createRes = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'mcp-session-id': sessionId!,
        'x-lomi-api-key': 'lomi_sk_test_org_start',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        id: 2,
        params: {
          name: 'lomi_organization',
          arguments: { action: 'create', body: { name: 'Acme' } },
        },
      }),
    });
    const created = parseSseJsonRpc(await createRes.text());
    expect(created.result && (created.result as JsonObject).isError).not.toBe(
      true,
    );
    expect(JSON.stringify(created.result)).toContain('lomi_sk_test_adopted');

    const listRes = await fetch(base, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'mcp-session-id': sessionId!,
        'x-lomi-api-key': 'lomi_sk_test_org_start',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        id: 3,
        params: { name: 'lomi_organization', arguments: { action: 'list' } },
      }),
    });
    expect(listRes.status).toBe(200);
    const listed = parseSseJsonRpc(await listRes.text());
    expect(listed.result && (listed.result as JsonObject).isError).not.toBe(
      true,
    );
    expect(seenKeys.some((key) => key.includes('lomi_sk_test_adopted'))).toBe(
      true,
    );
    fetchMock.mockRestore();
  });
});

function parseSseJsonRpc(text: string): JsonObject {
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) return JSON.parse(trimmed) as JsonObject;
  const dataLines = trimmed
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim());
  const last = dataLines[dataLines.length - 1];
  if (!last) throw new Error(`no SSE data in response: ${text}`);
  return JSON.parse(last) as JsonObject;
}

async function collectSseUntil(
  res: Response,
  needle: string,
  timeoutMs: number,
): Promise<boolean> {
  const reader = res.body?.getReader();
  if (!reader) return false;
  const decoder = new TextDecoder();
  let buffer = '';
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const chunk = await Promise.race([
      reader.read(),
      new Promise<{ done: true; value: undefined }>((resolve) =>
        setTimeout(() => resolve({ done: true, value: undefined }), deadline - Date.now()),
      ),
    ]);
    if (chunk.value) buffer += decoder.decode(chunk.value, { stream: true });
    if (buffer.includes(needle)) return true;
    if (chunk.done) break;
  }
  return buffer.includes(needle);
}
