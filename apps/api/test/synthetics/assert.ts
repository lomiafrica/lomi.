import type { Anomaly, HttpResponse } from './types';

/** Patterns that must never appear in merchant-facing error messages. */
const LEAK_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /STRIPE_SECRET_KEY/i, label: 'Stripe secret env var name' },
  {
    pattern: /\bstripe\b.*\bnot configured\b/i,
    label: 'Stripe configuration hint',
  },
  {
    pattern: /\bnot configured for this api\b/i,
    label: 'API instance config hint',
  },
  { pattern: /\bset\s+STRIPE/i, label: 'Stripe setup instruction' },
  { pattern: /\bsupabase\b/i, label: 'Supabase reference' },
  { pattern: /\bDB_SECRET_KEY\b/i, label: 'DB secret key name' },
  { pattern: /\bWAVE_API_KEY\b/i, label: 'Wave API key name' },
  { pattern: /\benvironment variable\b/i, label: 'Environment variable hint' },
  { pattern: /\bat\s+\w+\s+\(/, label: 'Stack trace fragment' },
  { pattern: /Cannot read propert/i, label: 'Runtime error leak' },
  { pattern: /undefined is not/i, label: 'Runtime error leak' },
  { pattern: /Uint8Array/i, label: 'Binary body parsing leak' },
  { pattern: /Cannot delete property '0'/i, label: 'Validation pipeline leak' },
  { pattern: /GIM_BASE_URL/i, label: 'GIM configuration hint' },
  { pattern: /GIM_MERCHANT_ID|GIM_SECRET_KEY/i, label: 'GIM credential hint' },
  { pattern: /CRON_SECRET/i, label: 'Cron secret env name' },
  { pattern: /schema cache/i, label: 'Database schema hint' },
  {
    pattern: /Could not find the function public\./i,
    label: 'RPC signature leak',
  },
  { pattern: /\b4[0-9]{12,15}\b/, label: 'PAN-like sequence in error' },
];

function collectErrorStrings(data: unknown): string[] {
  const out: string[] = [];
  if (data == null) return out;

  if (typeof data === 'string') {
    out.push(data);
    return out;
  }

  if (typeof data !== 'object') return out;

  const obj = data as Record<string, unknown>;

  if (typeof obj.message === 'string') out.push(obj.message);
  if (typeof obj.error === 'string') out.push(obj.error);

  if (obj.error && typeof obj.error === 'object') {
    const err = obj.error as Record<string, unknown>;
    if (typeof err.message === 'string') out.push(err.message);
    if (typeof err.code === 'string') out.push(err.code);
  }

  if (Array.isArray(obj.message)) {
    for (const m of obj.message) {
      if (typeof m === 'string') out.push(m);
    }
  }

  return out;
}

export function scanForLeaks(data: unknown): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const texts = collectErrorStrings(data);

  for (const text of texts) {
    for (const { pattern, label } of LEAK_PATTERNS) {
      if (pattern.test(text)) {
        anomalies.push({
          kind: 'leak',
          message: `Internal detail leaked in error message (${label}): ${truncate(text, 120)}`,
        });
      }
    }
  }

  return anomalies;
}

export function analyzeStatus(
  res: HttpResponse,
  expected: number | number[],
): Anomaly[] {
  const allowed = Array.isArray(expected) ? expected : [expected];
  if (allowed.includes(res.status)) {
    return [];
  }
  return [
    {
      kind: 'status',
      message: `Expected HTTP ${allowed.join(' or ')}, got ${res.status}`,
    },
  ];
}

export function analyzeServiceUnavailable(res: HttpResponse): Anomaly[] {
  if (res.status !== 503) return [];

  const texts = collectErrorStrings(res.data);
  const code = texts.find((t) => t === 'service_unavailable');
  const hasCode =
    res.data &&
    typeof res.data === 'object' &&
    (res.data as Record<string, unknown>).error &&
    typeof (res.data as Record<string, unknown>).error === 'object' &&
    ((res.data as Record<string, unknown>).error as Record<string, unknown>)
      .code === 'service_unavailable';

  if (code || hasCode || res.status === 503) {
    const msg =
      texts.find((t) => t !== 'service_unavailable') ??
      JSON.stringify(res.data).slice(0, 200);
    return [
      {
        kind: 'service_unavailable',
        message: `Service unavailable (503): ${truncate(msg, 160)}`,
      },
    ];
  }
  return [];
}

export function analyzeResponse(
  res: HttpResponse,
  expected: number | number[],
): Anomaly[] {
  const allowed = Array.isArray(expected) ? expected : [expected];
  const anomalies: Anomaly[] = [];
  anomalies.push(...analyzeStatus(res, expected));

  const expectsUnavailable = allowed.includes(503);
  if ((res.status >= 500 || res.status === 503) && !expectsUnavailable) {
    anomalies.push(...analyzeServiceUnavailable(res));
  }

  if (res.status >= 400) {
    anomalies.push(...scanForLeaks(res.data));
  }

  return anomalies;
}

export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
}

export function previewResponse(data: unknown, max = 280): string {
  try {
    const text = JSON.stringify(data);
    return truncate(text, max);
  } catch {
    return String(data);
  }
}

/** Unwrap `{ success, data }` envelopes common in lomi API responses. */
export function unwrapData(body: unknown): unknown {
  if (body && typeof body === 'object' && 'data' in body) {
    const wrapped = body as { data: unknown };
    if (wrapped.data !== undefined && wrapped.data !== null) {
      return wrapped.data;
    }
  }
  return body;
}

export function pickString(
  body: unknown,
  ...keys: string[]
): string | undefined {
  const data = unwrapData(body);
  if (!data || typeof data !== 'object') return undefined;
  const obj = data as Record<string, unknown>;
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === 'string' && val.length > 0) return val;
  }
  return undefined;
}

export type ApiErrorShape = {
  code?: string;
  message?: string;
};

/** Parse `{ error: { code, message }, request_id }` envelopes from the public API. */
export function extractApiError(body: unknown): ApiErrorShape | null {
  if (!body || typeof body !== 'object') return null;
  const root = body as Record<string, unknown>;
  const err = root.error;
  if (!err || typeof err !== 'object') return null;
  const record = err as Record<string, unknown>;
  return {
    code: typeof record.code === 'string' ? record.code : undefined,
    message: typeof record.message === 'string' ? record.message : undefined,
  };
}

/** Ensures merchant-facing errors are actionable and not generic 500s or infra leaks. */
export function validateMerchantFacingError(
  body: unknown,
  options?: { expectCode?: string },
): string | null {
  const err = extractApiError(body);
  if (!err?.message?.trim()) {
    return 'Expected structured error.message in API response';
  }
  if (err.message === 'An unexpected error occurred') {
    return 'Generic internal_error message is not acceptable for merchant-facing failures';
  }
  if (options?.expectCode && err.code !== options.expectCode) {
    return `Expected error code "${options.expectCode}", got "${err.code ?? 'missing'}"`;
  }
  if (err.message.length < 12) {
    return `Error message too short to be useful: "${err.message}"`;
  }
  for (const leak of scanForLeaks(body)) {
    return leak.message;
  }
  return null;
}

/** Validates intentional 503 responses for muted direct card / switch endpoints. */
export function validateUnavailableChargeResponse(
  body: unknown,
): string | null {
  const codeError = validateMerchantFacingError(body, {
    expectCode: 'service_unavailable',
  });
  if (codeError) return codeError;
  const message = extractApiError(body)?.message ?? '';
  if (!message.toLowerCase().includes('temporarily unavailable')) {
    return `Expected a clear unavailability message, got: "${message}"`;
  }
  return null;
}

/** Validates successful webhook registration responses. */
export function validateWebhookCreateResponse(body: unknown): string | null {
  const root = body as Record<string, unknown> | null;
  if (!root || typeof root !== 'object') {
    return 'Expected webhook create response object';
  }
  const data = root.data as Record<string, unknown> | undefined;
  const id =
    (typeof data?.id === 'string' ? data.id : undefined) ??
    pickString(body, 'webhook_id', 'id');
  if (!id) {
    return 'Expected webhook id in create response';
  }
  if (typeof root.secret !== 'string' || !root.secret.startsWith('whsec_')) {
    return 'Expected whsec_ signing secret on create (returned once)';
  }
  const serialized = JSON.stringify(data ?? root);
  if (serialized.includes('verification_token')) {
    return 'verification_token must not appear in webhook list/create payload';
  }
  return null;
}

/** Validates POST /webhooks/:id/test, sender reached the merchant URL and logged delivery. */
export function validateWebhookTestDeliveryResponse(
  body: unknown,
): string | null {
  if (!body || typeof body !== 'object') {
    return 'Expected webhook test delivery response object';
  }
  const record = body as Record<string, unknown>;
  if (typeof record.success !== 'boolean') {
    return 'Expected boolean success in webhook test response';
  }
  if (record.success !== true) {
    const status = record.status;
    const snippet =
      typeof record.response === 'string'
        ? record.response.slice(0, 120)
        : JSON.stringify(record).slice(0, 120);
    return `Webhook test delivery failed (success=false, status=${String(status)}): ${snippet}`;
  }
  const httpStatus = Number(record.status);
  if (!Number.isFinite(httpStatus) || httpStatus < 200 || httpStatus >= 300) {
    return `Expected 2xx receiver status, got ${String(record.status)}`;
  }
  if (typeof record.delivered_url !== 'string' || !record.delivered_url) {
    return 'Expected delivered_url in webhook test response';
  }
  return null;
}

/** Validates delivery log rows after a test send. */
export function validateWebhookDeliveryLogs(body: unknown): string | null {
  const rows = Array.isArray(body) ? body : body ? [body] : [];
  if (rows.length === 0) {
    return 'Expected at least one webhook delivery log after test send';
  }
  const latest = rows[0] as Record<string, unknown>;
  const eventType = String(latest.event_type ?? latest.event ?? '');
  if (!eventType.toLowerCase().includes('test')) {
    return `Expected test webhook event in delivery log, got "${eventType}"`;
  }
  const status = Number(latest.response_status ?? latest.status);
  if (!Number.isFinite(status) || status < 200 || status >= 300) {
    return `Expected successful delivery log status, got ${String(latest.response_status)}`;
  }
  return null;
}

/** Verifies list responses never expose signing secrets. */
export function validateWebhookListHasNoSecrets(body: unknown): string | null {
  const rows = Array.isArray(body) ? body : [];
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const record = row as Record<string, unknown>;
    if (
      'verification_token' in record ||
      (typeof record.secret === 'string' && record.secret.length > 0)
    ) {
      return 'Webhook list must not include verification_token or secret';
    }
  }
  return null;
}

type LogType = 'api_request' | 'api_error' | 'webhook_delivery' | 'activity';

/** Validates GET /logs list envelope and optional minimum useful entries. */
export function validateLogsListResponse(
  body: unknown,
  expectedType: LogType,
  options?: { minEntries?: number; requireUsefulFields?: boolean },
): string | null {
  if (!body || typeof body !== 'object') {
    return 'Expected logs list response object';
  }
  const record = body as Record<string, unknown>;
  if (record.object !== 'list') {
    return 'Expected logs list object: "list"';
  }
  if (record.type !== expectedType) {
    return `Expected log type "${expectedType}", got "${String(record.type)}"`;
  }
  if (!Array.isArray(record.data)) {
    return 'Expected logs data array';
  }
  if (typeof record.total_count !== 'number') {
    return 'Expected numeric total_count';
  }
  if (typeof record.has_more !== 'boolean') {
    return 'Expected boolean has_more';
  }

  const minEntries = options?.minEntries ?? 0;
  if (record.data.length < minEntries) {
    return `Expected at least ${minEntries} ${expectedType} log(s), got ${record.data.length}`;
  }

  if (options?.requireUsefulFields && record.data.length > 0) {
    const entry = record.data[0] as Record<string, unknown>;
    if (typeof entry.id !== 'string' || !entry.id) {
      return 'Expected log entry id';
    }
    if (typeof entry.timestamp !== 'string' || !entry.timestamp) {
      return 'Expected log entry timestamp';
    }
    if (entry.type !== expectedType) {
      return `Expected entry type "${expectedType}"`;
    }

    switch (expectedType) {
      case 'api_request':
        if (
          typeof entry.method !== 'string' ||
          typeof entry.endpoint !== 'string'
        ) {
          return 'api_request log should include method and endpoint for debugging';
        }
        if (entry.data && typeof entry.data === 'object') {
          const data = entry.data as Record<string, unknown>;
          if (
            typeof data.api_key === 'string' &&
            !data.api_key.includes('****')
          ) {
            return 'api_request logs must mask api_key values';
          }
        }
        break;
      case 'webhook_delivery':
        if (entry.success !== true && entry.success !== false) {
          return 'webhook_delivery log should include success boolean';
        }
        break;
      case 'api_error':
        break;
      case 'activity':
        break;
      default: {
        const _exhaustive: never = expectedType;
        return `Unhandled log type: ${String(_exhaustive)}`;
      }
    }
  }

  return null;
}

/** Validates GET /logs/:type/:id single entry response. */
export function validateLogEntryResponse(
  body: unknown,
  expectedType: LogType,
): string | null {
  if (!body || typeof body !== 'object') {
    return 'Expected log entry object';
  }
  const entry = body as Record<string, unknown>;
  if (entry.type !== expectedType) {
    return `Expected log entry type "${expectedType}"`;
  }
  if (typeof entry.id !== 'string' || !entry.id) {
    return 'Expected log entry id';
  }
  return null;
}

/** Validates api_request logs include correlation id from X-Request-Id when captured. */
export function validateApiRequestCorrelation(
  body: unknown,
  correlatedRequestId: string | undefined,
): string | null {
  if (!correlatedRequestId) return null;
  const record = body as { data?: Array<Record<string, unknown>> };
  const rows = record?.data ?? [];
  const match = rows.find(
    (row) =>
      row.request_id === correlatedRequestId && row.type === 'api_request',
  );
  if (!match) {
    return `Expected api_request log with request_id "${correlatedRequestId}"`;
  }
  return null;
}

/** Validates GET /usage-events/:id shows processed status and meter_id. */
export function validateUsageEventProcessed(body: unknown): string | null {
  const data = unwrapData(body) as Record<string, unknown>;
  const status = String(
    data?.processing_status ?? data?.status ?? '',
  ).toLowerCase();
  if (status === 'failed') {
    const err = data?.error_message;
    return `Usage event processing failed${err ? `: ${String(err)}` : ''}`;
  }
  if (status !== 'processed') {
    return `Expected usage event status "processed", got "${status || 'missing'}"`;
  }
  const meterId = pickString(body, 'meter_id');
  if (!meterId) {
    return 'Expected meter_id on processed usage event';
  }
  return null;
}

/** Validates GET /meters/:id/balances/:customerId consumed_units >= min. */
export function validateMeterBalanceAtLeast(
  body: unknown,
  min: number,
): string | null {
  const data = unwrapData(body) as Record<string, unknown>;
  const consumed = data?.consumed_units;
  if (typeof consumed !== 'number' || Number.isNaN(consumed)) {
    return 'Expected consumed_units number on meter balance';
  }
  if (consumed < min) {
    return `Expected consumed_units >= ${min}, got ${consumed}`;
  }
  return null;
}

/**
 * Validates GET /usage-billing/subscriptions/:id/usage: an active usage_based
 * subscription whose meter balances reflect at least `minConsumed` units.
 */
export function validateSubscriptionUsage(
  body: unknown,
  minConsumed: number,
): string | null {
  const data = unwrapData(body) as Record<string, unknown>;
  if (!data || typeof data !== 'object') {
    return 'Expected subscription usage object';
  }
  const status = String(data.status ?? '').toLowerCase();
  if (status !== 'active') {
    return `Expected active usage subscription, got "${status || 'missing'}"`;
  }
  const productType = String(data.product_type ?? '').toLowerCase();
  if (productType !== 'usage_based') {
    return `Expected product_type "usage_based", got "${productType || 'missing'}"`;
  }
  const balances = data.meter_balances;
  if (!Array.isArray(balances) || balances.length === 0) {
    return 'Expected non-empty meter_balances on usage subscription';
  }
  const maxConsumed = balances.reduce((max, row) => {
    const consumed = Number((row as Record<string, unknown>)?.consumed_units);
    return Number.isFinite(consumed) && consumed > max ? consumed : max;
  }, 0);
  if (maxConsumed < minConsumed) {
    return `Expected a meter balance with consumed_units >= ${minConsumed}, got max ${maxConsumed}`;
  }
  return null;
}

/**
 * Validates that a real domain webhook of `expectedEvent` was delivered
 * successfully (2xx) by scanning webhook delivery log rows.
 */
export function validatePaymentWebhookDelivered(
  body: unknown,
  expectedEvent: string,
): string | null {
  const rows = Array.isArray(body) ? body : body ? [body] : [];
  if (rows.length === 0) {
    return `Expected at least one delivery log for ${expectedEvent}`;
  }
  const match = rows.find((row) => {
    const record = row as Record<string, unknown>;
    const eventType = String(record.event_type ?? record.event ?? '');
    return eventType === expectedEvent;
  }) as Record<string, unknown> | undefined;
  if (!match) {
    const seen = rows
      .map((row) => String((row as Record<string, unknown>).event_type ?? ''))
      .filter(Boolean)
      .join(', ');
    return `Expected a ${expectedEvent} delivery log, saw event types: [${seen}]`;
  }
  const success = match.success;
  const status = Number(match.response_status ?? match.status_code);
  const delivered =
    success === true ||
    (Number.isFinite(status) && status >= 200 && status < 300);
  if (!delivered) {
    return `Found ${expectedEvent} delivery log but it was not successful (status=${String(match.response_status ?? match.status_code)})`;
  }
  return null;
}
