import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 15 * 60_000;

/** Short-lived capability for the merchant live view. Not the worker bearer token. */
export function mintConsoleToken(
  secret: string,
  sessionId: string,
  now = Date.now(),
): string {
  const exp = now + TOKEN_TTL_MS;
  const payload = `${sessionId}.${exp}`;
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/** True when the token matches this session and has not expired. */
export function verifyConsoleToken(
  secret: string,
  sessionId: string,
  token: string,
  now = Date.now(),
): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [id, expRaw, sig] = parts;
  if (!id || !expRaw || !sig || id !== sessionId) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < now) return false;
  const expected = createHmac("sha256", secret)
    .update(`${id}.${expRaw}`)
    .digest("base64url");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
