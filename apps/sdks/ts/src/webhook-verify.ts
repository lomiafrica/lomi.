/**
 * Webhook signature verification (HMAC SHA-256).
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

function hmacHex(secret: string, value: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

function safeEqualHex(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function parseV1Header(header: string): { timestamp: string; v1: string } | null {
  let timestamp: string | undefined;
  let v1: string | undefined;
  for (const part of header.split(',')) {
    const trimmed = part.trim();
    if (trimmed.startsWith('t=')) timestamp = trimmed.slice(2);
    else if (trimmed.startsWith('v1=')) v1 = trimmed.slice(3);
  }
  if (!timestamp || !v1) return null;
  return { timestamp, v1 };
}

/**
 * Verify an incoming lomi. webhook signature.
 *
 * Prefer `X-Lomi-Signature-V1` (`t=<unix>,v1=<hmac(ts.body)>`).
 * Legacy `X-Lomi-Signature` (HMAC of the raw body) remains valid for one cycle.
 *
 * @param rawBody - Raw request body (string or Buffer)
 * @param signature - Value of `X-Lomi-Signature-V1` or `X-Lomi-Signature`
 * @param secret - Your webhook signing secret from the dashboard
 */
export function verifyWebhookSignature(
  rawBody: string | Buffer,
  signature: string,
  secret: string,
): boolean {
  if (!signature || !secret) return false;

  const payload = Buffer.isBuffer(rawBody)
    ? rawBody.toString('utf8')
    : rawBody;

  const parsed = parseV1Header(signature);
  if (parsed) {
    const expected = hmacHex(secret, `${parsed.timestamp}.${payload}`);
    return safeEqualHex(parsed.v1, expected);
  }

  const expected = hmacHex(secret, payload);
  return safeEqualHex(signature, expected);
}
