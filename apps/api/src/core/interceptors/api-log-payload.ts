/** Shared sanitization for api_interactions request/response payloads. */

const LOG_PAYLOAD_MAX_CHARS = 4096;

const SENSITIVE_KEYS = new Set([
  'secret',
  'verification_token',
  'pan',
  'cvv',
  'cvv2',
  'card_number',
  'cardnumber',
  'password',
  'authorization',
]);

const HEAVY_PAYLOAD_PREFIXES = [
  '/checkout-sessions',
  '/checkout/v1/gim',
  '/charge/card',
  '/charge/switch',
  '/webhooks',
];

export function isHeavyOrSensitiveLogPath(path: string): boolean {
  return HEAVY_PAYLOAD_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

function redactSensitiveFields(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) {
    return value.map(redactSensitiveFields);
  }
  if (typeof value !== 'object') return value;
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      out[key] = '[REDACTED]';
    } else {
      out[key] = redactSensitiveFields(val);
    }
  }
  return out;
}

export function sanitizeLogPayload(
  endpointPath: string,
  value: unknown,
): Record<string, unknown> {
  if (value === null || value === undefined) {
    return {};
  }

  const sanitized = isHeavyOrSensitiveLogPath(endpointPath)
    ? redactSensitiveFields(value)
    : value;

  let text: string;
  try {
    text =
      typeof sanitized === 'string' ? sanitized : JSON.stringify(sanitized);
  } catch {
    return { _log_serialization_failed: true };
  }

  if (text.length <= LOG_PAYLOAD_MAX_CHARS) {
    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return { preview: text };
    }
  }

  return {
    _truncated: true,
    original_length: text.length,
    preview: text.slice(0, LOG_PAYLOAD_MAX_CHARS),
  };
}
