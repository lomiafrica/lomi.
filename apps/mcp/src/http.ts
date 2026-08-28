import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID, timingSafeEqual } from 'node:crypto';

import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  hostHeaderValidation,
  localhostHostValidation,
} from '@modelcontextprotocol/sdk/server/middleware/hostHeaderValidation.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';

import manifestJson from './generated/tools-manifest.json' with { type: 'json' };
import type { ToolsManifest } from './manifest.js';
import { parseManifest } from './manifest-parse.js';
import { validateJsonValue } from "@lomi./shared";
import {
  getLomiApiBaseUrl,
  getMcpHttpBearerTokens,
  getMcpReadinessChecks,
  getOptionalMerchantApiKey,
  getOptionalPartnerKey,
  getOptionalProvisioningKey,
  httpListenPort,
  listenHostOptions,
  mcpHttpBasePath,
  mcpMaxBodyBytes,
  mcpMaxSessions,
  mcpRateLimitRpm,
  mcpSessionTtlMs,
  mcpTrustProxy,
} from './env-config.js';
import { extractSessionMerchantApiKey, extractSessionPartnerKey, extractSessionProvisioningKey, extractOAuthAccessToken } from './session-merchant-key.js';
import { McpSessionRegistry, type MerchantAccessLevel } from './session-registry.js';
import { mcpLog, mcpRequestAls } from './mcp-request-context.js';
import { wireMcpServer } from './wire-mcp-server.js';
import {
  buildProtectedResourceMetadata,
  getProtectedResourceMetadataUrl,
  introspectOAuthAccessToken,
} from './oauth-introspection.js';
import {
  buildAuthorizationServerPointer,
  buildMcpCatalog,
  buildMcpIndexHtml,
  buildMcpIndexMarkdown,
  buildMcpNotFoundMarkdown,
  buildMcpServerCard,
  buildMcpWellKnown,
  MCP_ROBOTS_TXT,
  wantsMcpHtml,
  wantsMcpJson,
  wantsMcpMarkdown,
} from './discovery.js';
import { isJsonObject, isString, type JsonValue } from "@lomi./shared";
import type { McpRequestStore } from './mcp-request-context.js';

type TransportEntry = StreamableHTTPServerTransport;

type JsonRpcId = JsonValue;

/** Express error middleware payload at the framework boundary. */
type ExpressError = Error | JsonValue;

/** Express JSON body at the HTTP boundary. */
type RequestBody = JsonValue | undefined | null;

function jsonRpcIdFromBody(body: RequestBody): JsonRpcId {
  if (!isJsonObject(body) || !('id' in body)) return null;
  const id = body.id;
  if (id === undefined) return null;
  return id;
}

function isPayloadTooLargeError(err: ExpressError): boolean {
  return isJsonObject(err) && err.type === 'entity.too.large';
}

type SessionBootstrapState = {
  sessionId: string | null;
  merchantApiKey: string | null;
  provisioningApiKey: string | null;
  partnerApiKey: string | null;
  merchantAccessLevel: MerchantAccessLevel;
};

const MISSING_SESSION_CREDENTIAL_MESSAGE =
  'Missing credentials: complete OAuth at the authorization server, send x-lomi-provisioning-key for 0-to-1 onboarding, x-lomi-partner-key for partner tools, or x-lomi-api-key / x-api-key for merchant API tools. See https://docs.lomi.africa/build/mcp';

async function resolveProvisioningKeyFromRequest(
  req: Request,
  headerProvisioningKey: string | null,
): Promise<string | null> {
  if (headerProvisioningKey) return headerProvisioningKey;
  const oauthToken = extractOAuthAccessToken(req);
  if (!oauthToken) return null;
  const introspected = await introspectOAuthAccessToken(oauthToken);
  if (
    !introspected.active ||
    introspected.grant_type === 'merchant' ||
    !introspected.provisioning_key
  ) {
    return null;
  }
  return introspected.provisioning_key;
}

async function resolveMerchantGrantFromRequest(
  req: Request,
): Promise<{ connectionKey: string; accessLevel: MerchantAccessLevel } | null> {
  const headerMerchantKey = extractSessionMerchantApiKey(req);
  if (headerMerchantKey) {
    return { connectionKey: headerMerchantKey, accessLevel: 'full' };
  }

  const oauthToken = extractOAuthAccessToken(req);
  if (!oauthToken) return null;
  const introspected = await introspectOAuthAccessToken(oauthToken);
  if (!introspected.active || !introspected.connection_key) return null;
  const accessLevel: MerchantAccessLevel =
    introspected.access_level === 'write' ? 'write' : 'read';
  return {
    connectionKey: introspected.connection_key,
    accessLevel,
  };
}

const TRANSPORT_UNAUTHORIZED_MESSAGE =
  'Missing credentials: complete OAuth in your browser (recommended), send x-lomi-api-key / x-api-key, or Authorization: Bearer <lomi_sk_…>. See https://docs.lomi.africa/build/mcp';

function oauthUnauthorizedChallenge(): string {
  const metadataUrl = getProtectedResourceMetadataUrl();
  return `Bearer resource_metadata="${metadataUrl}"`;
}

/** Rolling 60s window per IP for MCP routes */
type RateBucket = { count: number; windowStart: number };

function clientIp(req: Request): string {
  if (mcpTrustProxy()) {
    const xf = req.headers['x-forwarded-for'];
    if (isString(xf)) {
      const first = xf.split(',')[0]?.trim();
      if (first) return first;
    }
    if (Array.isArray(xf) && xf[0]) return xf[0].trim();
  }
  return req.socket.remoteAddress ?? 'unknown';
}

function bearerTokenMatches(presented: string, tokens: string[]): boolean {
  const presentedBuf = Buffer.from(presented);
  for (const token of tokens) {
    const tokenBuf = Buffer.from(token);
    if (
      presentedBuf.length === tokenBuf.length &&
      timingSafeEqual(presentedBuf, tokenBuf)
    ) {
      return true;
    }
  }
  return false;
}

function checkMcpRateLimit(
  buckets: Map<string, RateBucket>,
  ip: string,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const rpm = mcpRateLimitRpm();
  if (rpm <= 0) return { ok: true };
  const now = Date.now();
  const windowMs = 60_000;
  let b = buckets.get(ip);
  if (!b || now - b.windowStart >= windowMs) {
    b = { count: 0, windowStart: now };
    buckets.set(ip, b);
  }
  b.count += 1;
  if (b.count > rpm) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((windowMs - (now - b.windowStart)) / 1000),
    );
    return { ok: false, retryAfterSec };
  }
  return { ok: true };
}

function createLomiMcpExpressApp(hostOpts: ReturnType<typeof listenHostOptions>): Express {
  const app = express();
  const limit = mcpMaxBodyBytes();
  app.use(express.json({ limit: limit }));

  if (mcpTrustProxy()) {
    app.set('trust proxy', 1);
  }

  const { host, allowedHosts } = hostOpts;
  if (allowedHosts) {
    app.use(hostHeaderValidation(allowedHosts));
  } else {
    const localhostHosts = ['127.0.0.1', 'localhost', '::1'];
    if (localhostHosts.includes(host)) {
      app.use(localhostHostValidation());
    } else if (host === '0.0.0.0' || host === '::') {
      console.warn(
        `[lomi-mcp] Binding to ${host} without LOMI_MCP_ALLOWED_HOSTS, ensure TLS and auth (LOMI_MCP_BEARER_TOKEN) in production.`,
      );
    }
  }
  return app;
}

function ensureProductionBearer(): void {
  if (process.env.NODE_ENV === 'production' && getMcpHttpBearerTokens().length === 0) {
    console.error(
      '[lomi-mcp] FATAL: LOMI_MCP_BEARER_TOKEN is required when NODE_ENV=production',
    );
    process.exit(1);
  }
}

/**
 * Resolves whether the request carries a transport-acceptable lomi. credential.
 * Merchant / provisioning keys must match known prefixes; OAuth access tokens
 * must pass server-side introspection before they unlock the gate.
 */
async function resolveTransportCredential(req: Request): Promise<boolean> {
  if (extractSessionMerchantApiKey(req) || extractSessionProvisioningKey(req) || extractSessionPartnerKey(req)) {
    return true;
  }

  const oauthToken = extractOAuthAccessToken(req);
  if (!oauthToken) return false;

  const introspected = await introspectOAuthAccessToken(oauthToken);
  return Boolean(
    introspected.active &&
      (introspected.connection_key || introspected.provisioning_key),
  );
}

async function bearerAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const tokens = getMcpHttpBearerTokens();
  const auth = req.headers.authorization;
  const presented =
    auth && auth.startsWith('Bearer ')
      ? auth.slice('Bearer '.length).trim()
      : null;

  // Legacy path: a shared transport secret still unlocks the endpoint.
  // Compared against server-configured secrets (not user-controlled allow).
  if (presented && tokens.length > 0 && bearerTokenMatches(presented, tokens)) {
    next();
    return;
  }

  // Primary path: shaped merchant/provisioning key, or introspected OAuth token.
  if (await resolveTransportCredential(req)) {
    next();
    return;
  }

  // No transport secret configured and no credential presented: open (local/dev).
  if (tokens.length === 0) {
    next();
    return;
  }

  res.setHeader('WWW-Authenticate', oauthUnauthorizedChallenge());
  res.status(401).json({
    error: 'Unauthorized',
    error_code: presented ? 'invalid_credentials' : 'missing_credentials',
    message: TRANSPORT_UNAUTHORIZED_MESSAGE,
  });
}

function resolveMerchantKey(
  registry: McpSessionRegistry,
  sessionId: string | undefined,
  initialKey: string | null,
): string | null {
  if (sessionId) {
    return registry.getMerchantApiKey(sessionId) ?? getOptionalMerchantApiKey();
  }
  return initialKey ?? getOptionalMerchantApiKey();
}

function resolveProvisioningKey(
  registry: McpSessionRegistry,
  sessionId: string | undefined,
  initialKey: string | null,
): string | null {
  if (sessionId) {
    return registry.getProvisioningApiKey(sessionId) ?? getOptionalProvisioningKey();
  }
  return initialKey ?? getOptionalProvisioningKey();
}

function resolvePartnerKey(
  registry: McpSessionRegistry,
  sessionId: string | undefined,
  initialKey: string | null,
): string | null {
  if (sessionId) {
    return registry.getPartnerApiKey(sessionId) ?? getOptionalPartnerKey();
  }
  return initialKey ?? getOptionalPartnerKey();
}

/** Credentials already resolved for this request (headers / OAuth / env). */
function hasResolvedSessionCredential(
  merchantKey: string | null,
  provisioningKey: string | null,
  oauthMerchantGrant: boolean,
  partnerKey: string | null,
): boolean {
  const merchant = merchantKey ?? getOptionalMerchantApiKey();
  const provisioning = provisioningKey ?? getOptionalProvisioningKey();
  const partner = partnerKey ?? getOptionalPartnerKey();
  return Boolean(merchant || provisioning || partner || oauthMerchantGrant);
}

export function createHttpApplication(manifest: ToolsManifest): Express {

  const hostOpts = listenHostOptions();
  const app = createLomiMcpExpressApp(hostOpts);
  const registry = new McpSessionRegistry(mcpMaxSessions(), mcpSessionTtlMs());
  registry.startPeriodicPrune();
  const rateBuckets = new Map<string, RateBucket>();

  function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const ip = clientIp(req);
    const rl = checkMcpRateLimit(rateBuckets, ip);
    if (rl.ok) {
      next();
      return;
    }
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    res.status(429).json({
      error: 'Too Many Requests',
      error_code: 'rate_limited',
      message: `MCP request rate limit exceeded (${mcpRateLimitRpm()} req/min per client).`,
      retry_after_sec: rl.retryAfterSec,
    });
  }

  const protectedResourceMetadataPattern =
    /^\/\.well-known\/oauth-protected-resource(\/.*)?$/;

  function serveProtectedResourceMetadata(_req: Request, res: Response): void {
    res.status(200).json(buildProtectedResourceMetadata());
  }

  app.get(
    protectedResourceMetadataPattern,
    rateLimitMiddleware,
    serveProtectedResourceMetadata,
  );

  app.get('/.well-known/oauth-authorization-server', rateLimitMiddleware, (_req, res) => {
    res.status(200).json(buildAuthorizationServerPointer());
  });

  app.get('/.well-known/mcp', rateLimitMiddleware, (_req, res) => {
    res.status(200).json(buildMcpWellKnown(manifest));
  });

  app.get('/.well-known/mcp.json', rateLimitMiddleware, (_req, res) => {
    res.status(200).json(buildMcpWellKnown(manifest));
  });

  app.get('/.well-known/mcp/catalog.json', rateLimitMiddleware, (_req, res) => {
    res.status(200).json(buildMcpCatalog(manifest));
  });

  app.get('/server-card', rateLimitMiddleware, (_req, res) => {
    res.status(200).json(buildMcpServerCard(manifest));
  });

  app.get('/robots.txt', (_req, res) => {
    res
      .status(200)
      .type('text/plain; charset=utf-8')
      .send(MCP_ROBOTS_TXT);
  });

  app.get('/', (req, res) => {
    const accept = isString(req.headers.accept) ? req.headers.accept : undefined;
    const userAgent = isString(req.headers['user-agent'])
      ? req.headers['user-agent']
      : undefined;
    res.setHeader('Vary', 'Accept, User-Agent');
    if (wantsMcpMarkdown(accept, userAgent)) {
      res
        .status(200)
        .type('text/markdown; charset=utf-8')
        .send(buildMcpIndexMarkdown(manifest));
      return;
    }
    if (wantsMcpHtml(accept) || !wantsMcpJson(accept)) {
      res
        .status(200)
        .type('text/html; charset=utf-8')
        .send(buildMcpIndexHtml(manifest));
      return;
    }
    res.status(200).json(buildMcpWellKnown(manifest));
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({
      ok: true,
      service: 'lomi-mcp',
      manifestVersion: manifest.manifestVersion,
      apiVersion: manifest.apiVersion,
      toolCount: manifest.toolCount,
    });
  });

  app.get('/ready', (_req, res) => {
    const envResult = getMcpReadinessChecks();
    const manifestOk =
      Boolean(manifest.manifestVersion) &&
      Array.isArray(manifest.tools) &&
      manifest.tools.length > 0;

    const checks = [
      ...envResult.checks,
      {
        name: 'tools_manifest',
        ok: manifestOk,
        detail: manifestOk ? undefined : 'manifest missing tools or version',
      },
    ];
    const ok = envResult.ok && manifestOk;
    if (!ok) {
      res.status(503).json({
        ready: false,
        service: 'lomi-mcp',
        checks,
      });
      return;
    }
    res.status(200).json({
      ready: true,
      service: 'lomi-mcp',
      checks,
    });
  });

  const basePath = mcpHttpBasePath();

  const mcpPostHandler = (guest: boolean) => async (req: Request, res: Response): Promise<void> => {
    const headerRequestId = req.headers['x-request-id'];
    const requestId =
      (isString(headerRequestId) && headerRequestId.trim()) ||
      randomUUID();

    const store: McpRequestStore = { requestId };

    await mcpRequestAls.run(store, async () => {
      try {
        const sessionHeader = req.headers['mcp-session-id'];
        const sessionId = Array.isArray(sessionHeader)
          ? sessionHeader[0]
          : sessionHeader;

        const headerMerchantKey = extractSessionMerchantApiKey(req);
        const headerProvisioningKey = extractSessionProvisioningKey(req);
        const headerPartnerKey = extractSessionPartnerKey(req);
        const merchantGrant = await resolveMerchantGrantFromRequest(req);
        const resolvedMerchantKey =
          merchantGrant?.connectionKey ?? headerMerchantKey;
        const resolvedProvisioningKey =
          (await resolveProvisioningKeyFromRequest(req, headerProvisioningKey)) ??
          headerProvisioningKey;
        const resolvedPartnerKey = headerPartnerKey;
        if (sessionId && registry.has(sessionId) && resolvedMerchantKey) {
          registry.updateMerchantApiKey(sessionId, resolvedMerchantKey);
        }
        if (
          sessionId &&
          registry.has(sessionId) &&
          merchantGrant?.accessLevel
        ) {
          registry.updateMerchantAccessLevel(
            sessionId,
            merchantGrant.accessLevel,
          );
        }
        if (sessionId && registry.has(sessionId) && resolvedProvisioningKey) {
          registry.updateProvisioningApiKey(sessionId, resolvedProvisioningKey);
        }
        if (sessionId && registry.has(sessionId) && resolvedPartnerKey) {
          registry.updatePartnerApiKey(sessionId, resolvedPartnerKey);
        }

        let transport: TransportEntry | undefined;

        if (sessionId && registry.has(sessionId)) {
          // Existing session: id must match a server-issued registry entry.
          transport = registry.get(sessionId)!.transport;
          registry.touch(sessionId);
          store.sessionId = sessionId;
        } else if (!sessionId) {
          // New session: require credentials first, then an MCP initialize body.
          if (
            !guest &&
            !hasResolvedSessionCredential(
              resolvedMerchantKey,
              resolvedProvisioningKey,
              Boolean(merchantGrant?.connectionKey),
              resolvedPartnerKey,
            )
          ) {
            res.setHeader('WWW-Authenticate', oauthUnauthorizedChallenge());
            res.status(401).json({
              jsonrpc: '2.0',
              error: {
                code: -32002,
                message: MISSING_SESSION_CREDENTIAL_MESSAGE,
              },
              id: jsonRpcIdFromBody(req.body),
            });
            return;
          }

          if (!isInitializeRequest(req.body)) {
            res.status(400).json({
              jsonrpc: '2.0',
              error: {
                code: -32000,
                message: 'Bad Request: No valid MCP session ID provided',
              },
              id: null,
            });
            return;
          }

          if (!registry.canAcceptNewSession()) {
            mcpLog(
              'mcp_session_rejected',
              {
                reason: 'max_sessions',
                activeSessions: registry.size,
                maxSessions: mcpMaxSessions(),
              },
              'warn',
            );
            res.status(503).json({
              jsonrpc: '2.0',
              error: {
                code: -32000,
                message: `MCP server at session capacity (${mcpMaxSessions()}). Try again later.`,
              },
              id: null,
            });
            return;
          }

          const sessionState: SessionBootstrapState = {
            sessionId: null,
            merchantApiKey: resolvedMerchantKey,
            provisioningApiKey: resolvedProvisioningKey,
            partnerApiKey: resolvedPartnerKey,
            merchantAccessLevel: merchantGrant?.accessLevel ?? 'full',
          };

          transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (sid) => {
              sessionState.sessionId = sid;
              registry.attachSession(
                sid,
                transport!,
                sessionState.merchantApiKey,
                sessionState.provisioningApiKey,
                sessionState.merchantAccessLevel,
                sessionState.partnerApiKey,
              );
              store.sessionId = sid;
            },
          });

          const server = wireMcpServer({
            manifest,
            mode: 'http',
            guest,
            merchantAccessLevel: sessionState.merchantAccessLevel,
            getApiKey: () =>
              resolveMerchantKey(
                registry,
                sessionState.sessionId ?? undefined,
                sessionState.merchantApiKey,
              ),
            getProvisioningKey: () =>
              resolveProvisioningKey(
                registry,
                sessionState.sessionId ?? undefined,
                sessionState.provisioningApiKey,
              ),
            getPartnerKey: () =>
              resolvePartnerKey(
                registry,
                sessionState.sessionId ?? undefined,
                sessionState.partnerApiKey,
              ),
            onMerchantKeyDiscovered: (secretKey) => {
              sessionState.merchantApiKey = secretKey;
              if (sessionState.sessionId) {
                registry.updateMerchantApiKey(sessionState.sessionId, secretKey);
              }
            },
            onProvisioningKeyDiscovered: (key) => {
              sessionState.provisioningApiKey = key;
              if (sessionState.sessionId) {
                registry.updateProvisioningApiKey(sessionState.sessionId, key);
              }
            },
          });
          await server.connect(transport);
          // SAFETY: Express Request/Response implement Node IncomingMessage/ServerResponse for the MCP transport.
          await transport.handleRequest(
            req as IncomingMessage,
            res as ServerResponse,
            req.body,
          );
          return;
        } else {
          res.status(400).json({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Bad Request: No valid MCP session ID provided',
            },
            id: null,
          });
          return;
        }

        // SAFETY: Express Request/Response implement Node IncomingMessage/ServerResponse for the MCP transport.
        await transport!.handleRequest(
          req as IncomingMessage,
          res as ServerResponse,
          req.body,
        );
      } catch (error) {
        mcpLog(
          'mcp_post_error',
          {
            error: error instanceof Error ? error.message : String(error),
          },
          'error',
        );
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal server error',
            },
            id: null,
          });
        }
      }
    });
  };

  const mcpGetHandler = async (req: Request, res: Response): Promise<void> => {
    const headerRequestIdGet = req.headers['x-request-id'];
    const requestId =
      (isString(headerRequestIdGet) && headerRequestIdGet.trim()) ||
      randomUUID();
    const store: McpRequestStore = { requestId };

    await mcpRequestAls.run(store, async () => {
      try {
        const sessionHeader = req.headers['mcp-session-id'];
        const sessionId = Array.isArray(sessionHeader)
          ? sessionHeader[0]
          : sessionHeader;
        if (!sessionId || !registry.has(sessionId)) {
          res.status(400).send('Invalid or missing MCP session ID');
          return;
        }
        store.sessionId = sessionId;
        registry.touch(sessionId);
        const transport = registry.get(sessionId)!.transport;
        // SAFETY: Express Request/Response implement Node IncomingMessage/ServerResponse for the MCP transport.
        await transport.handleRequest(
          req as IncomingMessage,
          res as ServerResponse,
        );
      } catch (error) {
        mcpLog(
          'mcp_get_error',
          {
            error: error instanceof Error ? error.message : String(error),
          },
          'error',
        );
        if (!res.headersSent) {
          res.status(500).send('Internal server error');
        }
      }
    });
  };

  const mcpDeleteHandler = async (req: Request, res: Response): Promise<void> => {
    const headerRequestIdDel = req.headers['x-request-id'];
    const requestId =
      (isString(headerRequestIdDel) && headerRequestIdDel.trim()) ||
      randomUUID();
    const store: McpRequestStore = { requestId };

    await mcpRequestAls.run(store, async () => {
      try {
        const sessionHeader = req.headers['mcp-session-id'];
        const sessionId = Array.isArray(sessionHeader)
          ? sessionHeader[0]
          : sessionHeader;
        if (!sessionId || !registry.has(sessionId)) {
          res.status(400).send('Invalid or missing MCP session ID');
          return;
        }
        store.sessionId = sessionId;
        const transport = registry.get(sessionId)!.transport;
        // SAFETY: Express Request/Response implement Node IncomingMessage/ServerResponse for the MCP transport.
        await transport.handleRequest(
          req as IncomingMessage,
          res as ServerResponse,
        );
      } catch (error) {
        mcpLog(
          'mcp_delete_error',
          {
            error: error instanceof Error ? error.message : String(error),
          },
          'error',
        );
        if (!res.headersSent) {
          res.status(500).send('Internal server error');
        }
      }
    });
  };

  app.post(basePath, rateLimitMiddleware, bearerAuthMiddleware, mcpPostHandler(false));
  app.get(basePath, rateLimitMiddleware, bearerAuthMiddleware, mcpGetHandler);
  app.delete(basePath, rateLimitMiddleware, bearerAuthMiddleware, mcpDeleteHandler);

  app.post(`${basePath}/guest`, rateLimitMiddleware, mcpPostHandler(true));
  app.get(`${basePath}/guest`, rateLimitMiddleware, mcpGetHandler);
  app.delete(`${basePath}/guest`, rateLimitMiddleware, mcpDeleteHandler);

  app.use((req, res) => {
    const accept = isString(req.headers.accept) ? req.headers.accept : undefined;
    const userAgent = isString(req.headers['user-agent'])
      ? req.headers['user-agent']
      : undefined;
    res.setHeader('Vary', 'Accept, User-Agent');
    if (req.method === 'GET' || req.method === 'HEAD') {
      if (wantsMcpMarkdown(accept, userAgent)) {
        res
          .status(404)
          .type('text/markdown; charset=utf-8')
          .send(buildMcpNotFoundMarkdown());
        return;
      }
      if (wantsMcpHtml(accept)) {
        res
          .status(404)
          .type('text/html; charset=utf-8')
          .send(
            `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Not found</title></head><body><h1>Not found</h1><p>No resource at this path on the lomi. MCP host. See <a href="/">the MCP landing</a>, <a href="https://docs.lomi.africa/build/mcp">MCP docs</a>, or <a href="/server-card">the server card</a>.</p></body></html>`,
          );
        return;
      }
    }
    res.status(404).json({
      error: 'Not Found',
      error_code: 'not_found',
      message: 'No resource at this path. GET / for MCP discovery.',
    });
  });

  app.use(
    (err: ExpressError, _req: Request, res: Response, next: NextFunction) => {
      if (isPayloadTooLargeError(err)) {
        res.status(413).json({
          error: 'Payload Too Large',
          error_code: 'payload_too_large',
          message: `JSON body exceeds LOMI_MCP_MAX_BODY_BYTES (${mcpMaxBodyBytes()}).`,
        });
        return;
      }
      next(err);
    },
  );

  return app;
}

export async function startHttpServer(): Promise<void> {
  ensureProductionBearer();
  const manifest = parseManifest(validateJsonValue(manifestJson));
  const app = createHttpApplication(manifest);
  const port = httpListenPort();
  const hostOpts = listenHostOptions();
  const basePath = mcpHttpBasePath();

  await new Promise<void>((resolve, reject) => {
    const srv = app.listen(port, hostOpts.host, () => resolve());
    srv.on('error', reject);
  });

  const bearerMode =
    getMcpHttpBearerTokens().length > 0 ? 'required' : 'off';
  mcpLog('mcp_http_startup', {
    host: hostOpts.host,
    port,
    mcpPath: basePath,
    healthPath: '/health',
    readyPath: '/ready',
    allowedHostsCount: hostOpts.allowedHosts?.length ?? 0,
    transportBearerMode: bearerMode,
    transportBearerCount: getMcpHttpBearerTokens().length,
    apiBaseUrlHost: (() => {
      try {
        return new URL(getLomiApiBaseUrl()).hostname;
      } catch {
        return 'invalid';
      }
    })(),
    maxSessions: mcpMaxSessions(),
    sessionTtlMs: mcpSessionTtlMs(),
    maxBodyBytes: mcpMaxBodyBytes(),
    rateLimitRpm: mcpRateLimitRpm(),
    toolCount: manifest.toolCount,
    apiVersion: manifest.apiVersion,
  });
}
