import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Fingerprint high-entropy API keys and OAuth tokens for session binding.
 * These are not user-chosen passwords, so a fast hash is the right tool.
 * A slow password KDF on every MCP request would be a CPU exhaustion vector.
 */
export function hashSessionMaterial(value: string): string {
  // codeql[js/insufficient-password-hash]
  return createHash("sha256").update(value).digest("hex");
}

export function fingerprintsEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Fail closed when a bound session has no fingerprint. */
export function sessionFingerprintMatches(
  boundFingerprint: string | null | undefined,
  presented: string,
): boolean {
  if (!boundFingerprint) return false;
  return fingerprintsEqual(presented, boundFingerprint);
}

/**
 * Bind an MCP HTTP session to the transport credential that created it.
 * Guest `/mcp/guest` sessions bind to client IP so later calls can omit the
 * provisioning key (clients keep using mcp-session-id only). Authenticated
 * `/mcp` sessions bind to the OAuth token or API key, which the transport
 * gate requires on every request.
 */
export function fingerprintSessionCredential(input: {
  guest: boolean;
  clientIp: string;
  merchantKey: string | null;
  provisioningKey: string | null;
  partnerKey: string | null;
  oauthToken: string | null;
}): string {
  if (input.guest) {
    return hashSessionMaterial(`guest:${input.clientIp}`);
  }
  const material =
    input.oauthToken ||
    input.merchantKey ||
    input.provisioningKey ||
    input.partnerKey;
  if (material) {
    return hashSessionMaterial(material);
  }
  return hashSessionMaterial(`unauth:${input.clientIp}`);
}
