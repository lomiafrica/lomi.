import type { RestCallSpec } from './manifest.js';
import {
  isJsonObject,
  isString,
  readObject,
  type JsonObject,
  type JsonValue,
} from "@lomi./shared";
import { attachNextSteps } from './next-steps.js';

export type LomiHttpResult = {
  status: number;
  statusText: string;
  bodyText: string;
  contentType: string | null;
  retryAfter?: number;
  pathTemplate?: string;
  method?: string;
};

function parseRetryAfterSeconds(header: string | null): number | undefined {
  if (!header) return undefined;
  const seconds = Number.parseInt(header.trim(), 10);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds;
  const at = Date.parse(header);
  if (!Number.isFinite(at)) return undefined;
  return Math.max(0, Math.ceil((at - Date.now()) / 1000));
}

function serializeQueryValue(value: JsonValue | undefined): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (isJsonObject(value) || Array.isArray(value)) return JSON.stringify(value);
  return String(value);
}

function declaredHeaderInputKeys(inputSchema: JsonObject): Set<string> {
  const props = readObject(inputSchema, 'properties');
  if (!props) return new Set();
  return new Set(
    Object.keys(props).filter((k) =>
      k.startsWith('header_'),
    ),
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchTimeoutMs(): number {
  const n = Number(process.env.LOMI_API_FETCH_TIMEOUT_MS ?? '30000');
  return Number.isFinite(n) && n > 0 ? n : 30000;
}

function fetchMaxRetries(): number {
  const n = Number(process.env.LOMI_API_FETCH_RETRIES ?? '2');
  return Number.isFinite(n) && n >= 0 ? Math.min(n, 5) : 2;
}

export async function callLomiRest(
  spec: RestCallSpec,
  args: JsonObject,
  options: {
    baseUrl: string;
    apiKey?: string | null;
    authHeaderName?: string;
  },
): Promise<LomiHttpResult> {
  const { baseUrl, apiKey, authHeaderName = 'X-API-KEY' } = options;
  type LomiRequestHeaders = { [header: string]: string };
  const headers: LomiRequestHeaders = {
    Accept: 'application/json',
  };
  if (apiKey) {
    headers[authHeaderName] = apiKey;
  }

  let path = spec.pathTemplate;
  for (const name of spec.pathParamNames) {
    const v = args[name];
    if (v === undefined || v === null) {
      throw new Error(`Missing required path parameter "${name}"`);
    }
    path = path.replace(`{${name}}`, encodeURIComponent(String(v)));
  }

  const qp = new URLSearchParams();
  for (const name of spec.queryParamNames) {
    const v = args[name];
    const s = serializeQueryValue(v);
    if (s !== undefined) qp.append(name, s);
  }

  for (const key of declaredHeaderInputKeys(spec.inputSchema)) {
    const v = args[key];
    if (v === undefined || v === null) continue;
    const headerName = key.slice('header_'.length);
    headers[headerName] = String(v);
  }

  const idem = args.idempotency_key;
  if (isString(idem) && idem.length > 0) {
    headers['Idempotency-Key'] = idem;
  }

  let body: string | undefined;
  if (spec.wantsBody) {
    const b = args.body;
    if (b === undefined || b === null) {
      throw new Error('Missing required "body" object for this operation.');
    }
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(b);
  }

  const root = baseUrl.replace(/\/$/, '');
  const query = qp.toString();
  const url = `${root}${path}${query ? `?${query}` : ''}`;

  const methodLower = spec.method.toLowerCase();
  const allowRetry =
    methodLower === 'get' || methodLower === 'head';
  const maxRetries = fetchMaxRetries();
  const maxAttempts = allowRetry ? maxRetries + 1 : 1;
  const timeoutMs = fetchTimeoutMs();

  let lastError = new Error('lomi. API request failed');
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: spec.method.toUpperCase(),
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (
        allowRetry &&
        attempt < maxAttempts - 1 &&
        (res.status === 429 || res.status === 503 || res.status === 502)
      ) {
        await sleep(200 * (attempt + 1));
        continue;
      }

      const contentType = res.headers.get('content-type');
      const bodyText = await res.text();
      const retryAfter = parseRetryAfterSeconds(res.headers.get('retry-after'));

      return {
        status: res.status,
        statusText: res.statusText,
        bodyText,
        contentType,
        retryAfter,
        pathTemplate: spec.pathTemplate,
        method: spec.method,
      };
    } catch (err) {
      clearTimeout(timer);
      lastError =
        err instanceof Error ? err : new Error('Unexpected lomi. API failure');
      if (!allowRetry || attempt >= maxAttempts - 1) {
        throw err instanceof Error ? err : new Error(String(err));
      }
      await sleep(200 * (attempt + 1));
    }
  }

  throw lastError;
}

export function formatHttpResult(result: LomiHttpResult): string {
  let parsed: JsonValue;
  try {
    parsed = JSON.parse(result.bodyText);
  } catch {
    parsed = result.bodyText;
  }

  const ok = result.status >= 200 && result.status < 300;

  const envelope: JsonObject = {
    ok,
    status: result.status,
    statusText: result.statusText,
    contentType: result.contentType,
    body: parsed,
  };

  if (!ok) {
    envelope.error = {
      kind: 'lomi_http_error',
      status: result.status,
      statusText: result.statusText,
      body: parsed,
    };
  }

  attachNextSteps(envelope, result, {
    pathTemplate: result.pathTemplate,
    method: result.method,
  });

  return JSON.stringify(envelope, null, 2);
}
