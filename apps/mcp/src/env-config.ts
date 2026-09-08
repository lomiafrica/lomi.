/**
 * Shared environment helpers for MCP runtime (stdio + HTTP).
 */

function quoted(v: string | undefined): string {
  return v === undefined ? '<unset>' : `"${v}"`;
}

function parseUrlOrThrow(rawUrl: string, varName: string): URL {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('unsupported protocol');
    }
    return url;
  } catch {
    throw new Error(
      `[env] ${varName} must be a valid http/https URL, got ${quoted(rawUrl)}. Example: "https://api.lomi.africa".`,
    );
  }
}

function parseCsvHosts(raw: string, varName: string): string[] {
  const parts = raw.split(',').map((s) => s.trim());
  const emptyEntries = parts.filter((s) => s.length === 0).length;
  if (emptyEntries > 0) {
    throw new Error(
      `[env] ${varName} contains empty entries. Use comma-separated hostnames only (no blanks), e.g. "api.lomi.africa,sandbox.api.lomi.africa".`,
    );
  }
  for (const host of parts) {
    if (host.includes('://') || host.includes('/') || host.includes('?') || host.includes('#')) {
      throw new Error(
        `[env] ${varName} must contain hostnames only. Invalid entry: "${host}". Remove protocol/path and keep only hostnames.`,
      );
    }
  }
  return parts;
}

export function getLomiApiBaseUrl(): string {
  const raw = process.env.LOMI_API_URL?.trim() ?? 'https://api.lomi.africa';
  const parsed = parseUrlOrThrow(raw, 'LOMI_API_URL');
  const normalized = parsed.toString().replace(/\/$/, '');
  assertOutboundHostnameAllowed(normalized);
  return normalized;
}

function assertOutboundHostnameAllowed(baseUrl: string): void {
  const raw = process.env.LOMI_API_URL_ALLOWLIST?.trim();
  if (!raw) return;
  const allowed = new Set(parseCsvHosts(raw, 'LOMI_API_URL_ALLOWLIST'));
  const hostname = parseUrlOrThrow(baseUrl, 'LOMI_API_URL').hostname;
  if (!allowed.has(hostname)) {
    throw new Error(
      `[env] Outbound API hostname "${hostname}" is not allowed by LOMI_API_URL_ALLOWLIST (${quoted(raw)}). Add "${hostname}" to the allowlist.`,
    );
  }
}

/** Cached merchant API key once resolved (never caches absence). */
let cachedPositiveMerchantKey: string | undefined;

/** Reads merchant REST API key from env (empty/absent returns null). */
export function getOptionalMerchantApiKey(): string | null {
  if (cachedPositiveMerchantKey !== undefined) {
    return cachedPositiveMerchantKey;
  }
  const keyCandidates = [
    process.env.LOMI_SECRET_KEY?.trim(),
    process.env.X_API_KEY?.trim(),
  ].filter((v): v is string => Boolean(v && v.length > 0));
  const distinct = Array.from(new Set(keyCandidates));
  if (distinct.length > 1) {
    throw new Error(
      '[env] Multiple merchant key env vars are set with different values (LOMI_SECRET_KEY / X_API_KEY). Keep exactly one to avoid ambiguous auth.',
    );
  }
  const key = distinct[0] ?? null;
  if (!key || key.trim() === '') {
    return null;
  }
  cachedPositiveMerchantKey = key.trim();
  return cachedPositiveMerchantKey;
}

let cachedPositiveProvisioningKey: string | undefined;

/** Reads platform provisioning key from env (empty/absent returns null). */
export function getOptionalProvisioningKey(): string | null {
  if (cachedPositiveProvisioningKey !== undefined) {
    return cachedPositiveProvisioningKey;
  }
  const key = process.env.LOMI_PROVISIONING_KEY?.trim() ?? null;
  if (!key) {
    return null;
  }
  cachedPositiveProvisioningKey = key;
  return cachedPositiveProvisioningKey;
}

let cachedPositivePartnerKey: string | undefined;

/** Reads partner management key from env (empty/absent returns null). */
export function getOptionalPartnerKey(): string | null {
  if (cachedPositivePartnerKey !== undefined) {
    return cachedPositivePartnerKey;
  }
  const key = process.env.LOMI_PARTNER_KEY?.trim() ?? null;
  if (!key) {
    return null;
  }
  cachedPositivePartnerKey = key;
  return cachedPositivePartnerKey;
}

export type McpTransportMode = 'stdio' | 'http';

export function getTransportMode(): McpTransportMode {
  const t = (process.env.LOMI_MCP_TRANSPORT ?? 'stdio').toLowerCase();
  if (t === 'http' || t === 'stdio') return t;
  throw new Error(
    `[env] Invalid LOMI_MCP_TRANSPORT=${quoted(process.env.LOMI_MCP_TRANSPORT)}. Use "stdio" or "http".`,
  );
}

export interface ListenHostOptions {
  host: string;
  allowedHosts?: string[];
}

export function listenHostOptions(): ListenHostOptions {
  // HTTP entrypoint should be reachable by platform health checks even when
  // LOMI_MCP_TRANSPORT is unset (e.g. start:http deployments on Railway).
  const host = process.env.LOMI_MCP_HTTP_HOST?.trim() || '0.0.0.0';
  const raw = process.env.LOMI_MCP_ALLOWED_HOSTS?.trim();
  if (!raw) {
    return { host };
  }
  const allowedHosts = parseCsvHosts(raw, 'LOMI_MCP_ALLOWED_HOSTS');
  // Railway health checks can use this host header.
  if (
    (process.env.RAILWAY_PROJECT_ID || process.env.RAILWAY_ENVIRONMENT_ID) &&
    !allowedHosts.includes('healthcheck.railway.app')
  ) {
    allowedHosts.push('healthcheck.railway.app');
  }
  return { host, allowedHosts };
}

export function httpListenPort(): number {
  const raw = process.env.PORT ?? process.env.LOMI_MCP_HTTP_PORT ?? '3333';
  const p = Number(raw);
  if (!Number.isFinite(p) || p <= 0 || p > 65535 || !Number.isInteger(p)) {
    throw new Error(
      `[env] Invalid PORT/LOMI_MCP_HTTP_PORT=${quoted(raw)}. Use an integer between 1 and 65535.`,
    );
  }
  return p;
}

export function mcpHttpBasePath(): string {
  const raw =
    process.env.LOMI_MCP_HTTP_PATH?.trim() ||
    process.env.MCP_HTTP_PATH?.trim() ||
    '/mcp';
  const p = raw.startsWith('/') ? raw : `/${raw}`;
  if (p.length === 0 || p.includes(' ') || p.includes('?') || p.includes('#')) {
    throw new Error(
      `[env] Invalid LOMI_MCP_HTTP_PATH/MCP_HTTP_PATH=${quoted(raw)}. Use a URL path like "/mcp" (no spaces/query/hash).`,
    );
  }
  return p;
}

function parseEnvIntInRange(
  raw: string | undefined,
  envName: string,
  defaultValue: number,
  min: number,
  max: number,
): number {
  if (raw === undefined || raw.trim() === '') {
    return defaultValue;
  }
  const n = Number(raw.trim());
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new Error(
      `[env] ${envName} must be an integer between ${min} and ${max}, got ${quoted(raw)}.`,
    );
  }
  return n;
}

/** Max concurrent MCP HTTP sessions (streamable transport). Default 2000. */
export function mcpMaxSessions(): number {
  return parseEnvIntInRange(
    process.env.LOMI_MCP_MAX_SESSIONS,
    'LOMI_MCP_MAX_SESSIONS',
    2000,
    1,
    100_000,
  );
}

/** Idle time after which a session is evicted. Default 30 minutes. */
export function mcpSessionTtlMs(): number {
  return parseEnvIntInRange(
    process.env.LOMI_MCP_SESSION_TTL_MS,
    'LOMI_MCP_SESSION_TTL_MS',
    30 * 60 * 1000,
    60_000,
    24 * 60 * 60 * 1000,
  );
}

/** Max concurrent HTTP sessions per credential fingerprint. Default 8. */
export function mcpMaxSessionsPerKey(): number {
  return parseEnvIntInRange(
    process.env.LOMI_MCP_MAX_SESSIONS_PER_KEY,
    'LOMI_MCP_MAX_SESSIONS_PER_KEY',
    8,
    1,
    1_000,
  );
}

/** Max concurrent HTTP sessions per client IP. Default 20. */
export function mcpMaxSessionsPerIp(): number {
  return parseEnvIntInRange(
    process.env.LOMI_MCP_MAX_SESSIONS_PER_IP,
    'LOMI_MCP_MAX_SESSIONS_PER_IP',
    20,
    1,
    10_000,
  );
}

/** Max JSON body size for Express (bytes). Default 1 MiB. */
export function mcpMaxBodyBytes(): number {
  return parseEnvIntInRange(
    process.env.LOMI_MCP_MAX_BODY_BYTES,
    'LOMI_MCP_MAX_BODY_BYTES',
    1024 * 1024,
    4096,
    50 * 1024 * 1024,
  );
}

/** Default per-IP MCP request budget; matches the Rill and Beecargo hosted MCPs. */
export const DEFAULT_MCP_RATE_LIMIT_RPM = 120;

/**
 * Per-client IP max MCP requests per rolling 60s window on /mcp routes
 * (including the anonymous /mcp/guest transport). Default 120. Set 0 to disable.
 */
export function mcpRateLimitRpm(): number {
  return parseEnvIntInRange(
    process.env.LOMI_MCP_RATE_LIMIT_RPM,
    'LOMI_MCP_RATE_LIMIT_RPM',
    DEFAULT_MCP_RATE_LIMIT_RPM,
    0,
    100_000,
  );
}

/**
 * Hosted MCP transport bearer(s). Comma-separated for zero-downtime rotation.
 * Empty / unset = no transport gate.
 */
export function getMcpHttpBearerTokens(): string[] {
  const raw = process.env.LOMI_MCP_BEARER_TOKEN?.trim();
  if (!raw) return [];
  const segments = raw.split(',');
  for (const seg of segments) {
    if (seg.trim() === '') {
      throw new Error(
        `[env] LOMI_MCP_BEARER_TOKEN contains an empty entry. Use comma-separated tokens with no empty segments, or a single token.`,
      );
    }
  }
  const tokens = segments.map((s) => s.trim()).filter(Boolean);
  const distinct = new Set(tokens);
  if (distinct.size !== tokens.length) {
    throw new Error(
      `[env] LOMI_MCP_BEARER_TOKEN contains duplicate token(s). Remove duplicates.`,
    );
  }
  return tokens;
}

export function isMcpTransportBearerToken(candidate: string): boolean {
  return getMcpHttpBearerTokens().includes(candidate);
}

export type ReadinessCheck = {
  name: string;
  ok: boolean;
  detail?: string;
};

/**
 * Validates env and outbound config for /ready (does not require manifest).
 */
export interface McpReadinessResult {
  ok: boolean;
  checks: ReadinessCheck[];
}

export function getMcpReadinessChecks(): McpReadinessResult {
  const checks: ReadinessCheck[] = [];

  const run = (name: string, fn: () => void): void => {
    try {
      fn();
      checks.push({ name, ok: true });
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      checks.push({ name, ok: false, detail });
    }
  };

  run('lomi_api_base_url', () => {
    void getLomiApiBaseUrl();
  });
  run('mcp_bearer_tokens', () => {
    void getMcpHttpBearerTokens();
  });
  run('listen_host', () => {
    void listenHostOptions();
  });
  run('http_port', () => {
    void httpListenPort();
  });
  run('mcp_http_path', () => {
    void mcpHttpBasePath();
  });
  run('mcp_max_sessions', () => {
    void mcpMaxSessions();
  });
  run('mcp_session_ttl_ms', () => {
    void mcpSessionTtlMs();
  });
  run('mcp_max_body_bytes', () => {
    void mcpMaxBodyBytes();
  });
  run('mcp_rate_limit_rpm', () => {
    void mcpRateLimitRpm();
  });
  run('merchant_key_env', () => {
    void getOptionalMerchantApiKey();
  });
  run('production_transport_bearer', () => {
    if (process.env.NODE_ENV === 'production' && getMcpHttpBearerTokens().length === 0) {
      throw new Error(
        'NODE_ENV=production requires LOMI_MCP_BEARER_TOKEN for hosted MCP transport auth.',
      );
    }
  });

  const introspectionKey =
    process.env.INTERNAL_API_KEY?.trim() || process.env.CRON_SECRET?.trim() || '';
  const oauthDeploymentHint = [
    process.env.LOMI_OAUTH_ISSUER?.trim(),
    process.env.LOMI_MCP_RESOURCE_URL?.trim(),
    process.env.LOMI_API_URL?.trim(),
  ]
    .filter(Boolean)
    .join(' ');
  const hostedOAuthDeployment =
    oauthDeploymentHint.length > 0 &&
    !/localhost|127\.0\.0\.1/i.test(oauthDeploymentHint);
  if (!introspectionKey) {
    checks.push({
      name: 'oauth_introspection',
      ok: !hostedOAuthDeployment,
      detail: hostedOAuthDeployment
        ? 'INTERNAL_API_KEY or CRON_SECRET required for OAuth token introspection on hosted MCP'
        : 'not configured (optional for local dev)',
    });
  } else {
    checks.push({ name: 'oauth_introspection', ok: true });
  }

  return {
    ok: checks.every((c) => c.ok),
    checks,
  };
}

/** Max characters returned from a single tool call. Default 100_000. */
export function mcpMaxResultCharsFromEnv(): number {
  return parseEnvIntInRange(
    process.env.LOMI_MCP_MAX_RESULT_CHARS,
    'LOMI_MCP_MAX_RESULT_CHARS',
    100_000,
    1_000,
    500_000,
  );
}

/** When true, trust CF-Connecting-IP / X-Forwarded-For for MCP rate limiting (set behind Railway/CDN). */
export function mcpTrustProxy(): boolean {
  const v = process.env.LOMI_MCP_TRUST_PROXY?.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

/** Rightmost X-Forwarded-For hops trusted as proxies when trust proxy is on. */
export function mcpTrustedProxyHops(): number {
  return parseEnvIntInRange(
    process.env.LOMI_MCP_TRUSTED_PROXY_HOPS,
    'LOMI_MCP_TRUSTED_PROXY_HOPS',
    1,
    1,
    8,
  );
}
