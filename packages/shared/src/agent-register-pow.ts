import {
  isJsonObject,
  isNumber,
  isString,
  parseJson,
  readNumber,
  readString,
} from "./json-value.js";

/** Default leading-zero-bit target. About a few milliseconds on a laptop. */
export const AGENT_REGISTER_POW_DEFAULT_DIFFICULTY = 12;
export const AGENT_REGISTER_POW_MAX_DIFFICULTY = 20;
export const AGENT_REGISTER_POW_TTL_MS = 120_000;

export const AGENT_POW_ISSUE_PER_HOUR = 30;
export const AGENT_REGISTER_PER_HOUR = 5;
export const AGENT_REGISTER_GLOBAL_PER_HOUR = 500;

export const BOOTSTRAP_DAILY_ACCOUNT_LIMIT = 3;
export const BOOTSTRAP_RATE_LIMIT_PER_MINUTE = 20;

export type AgentRegisterPowChallenge = {
  challenge_id: string;
  difficulty: number;
  expires_at: string;
};

export type AgentRegisterPowIssueInput = {
  secret: string;
  ipFingerprint: string;
  difficulty?: number;
  ttlMs?: number;
  nowMs?: number;
};

export type AgentRegisterPowVerifyInput = {
  secret: string;
  ipFingerprint: string;
  challengeId: string;
  nonce: string;
  nowMs?: number;
};

export type AgentRegisterPowVerifyResult =
  | { ok: true; challengeInnerId: string }
  | { ok: false; reason: string };

type ChallengePayload = {
  v: 1;
  id: string;
  exp: number;
  d: number;
  ip: string;
};

const textEncoder = new TextEncoder();

const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotr(value: number, bits: number): number {
  return (value >>> bits) | (value << (32 - bits));
}

/** Sync SHA-256 so PoW solving stays fast without Node crypto. */
export function sha256Bytes(data: Uint8Array): Uint8Array {
  const bitLen = data.length * 8;
  const withPad = data.length + 1 + 8;
  const blockCount = Math.ceil(withPad / 64);
  const padded = new Uint8Array(blockCount * 64);
  padded.set(data);
  padded[data.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 4, bitLen, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;
  const w = new Uint32Array(64);

  for (let i = 0; i < padded.length; i += 64) {
    for (let t = 0; t < 16; t += 1) {
      w[t] = view.getUint32(i + t * 4, false);
    }
    for (let t = 16; t < 64; t += 1) {
      const s0 =
        rotr(w[t - 15]!, 7) ^ rotr(w[t - 15]!, 18) ^ (w[t - 15]! >>> 3);
      const s1 =
        rotr(w[t - 2]!, 17) ^ rotr(w[t - 2]!, 19) ^ (w[t - 2]! >>> 10);
      w[t] = (w[t - 16]! + s0 + w[t - 7]! + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let t = 0; t < 64; t += 1) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[t]! + w[t]!) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, h0, false);
  outView.setUint32(4, h1, false);
  outView.setUint32(8, h2, false);
  outView.setUint32(12, h3, false);
  outView.setUint32(16, h4, false);
  outView.setUint32(20, h5, false);
  outView.setUint32(24, h6, false);
  outView.setUint32(28, h7, false);
  return out;
}

function hmacSha256(secret: string, message: string): Uint8Array {
  const keyBytes = textEncoder.encode(secret);
  const block = new Uint8Array(64);
  if (keyBytes.length > 64) {
    block.set(sha256Bytes(keyBytes));
  } else {
    block.set(keyBytes);
  }
  const inner = new Uint8Array(64 + textEncoder.encode(message).length);
  const outerPad = new Uint8Array(64);
  for (let i = 0; i < 64; i += 1) {
    inner[i] = block[i]! ^ 0x36;
    outerPad[i] = block[i]! ^ 0x5c;
  }
  inner.set(textEncoder.encode(message), 64);
  const innerHash = sha256Bytes(inner);
  const outer = new Uint8Array(64 + 32);
  outer.set(outerPad);
  outer.set(innerHash, 64);
  return sha256Bytes(outer);
}

function toHex(bytes: Uint8Array): string {
  let hex = "";
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(raw: string): Uint8Array | null {
  try {
    const padded = raw.replace(/-/g, "+").replace(/_/g, "/");
    const padLen = (4 - (padded.length % 4)) % 4;
    const binary = atob(padded + "=".repeat(padLen));
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      out[i] = binary.charCodeAt(i);
    }
    return out;
  } catch {
    return null;
  }
}

function signPayload(secret: string, body: string): string {
  return toBase64Url(hmacSha256(secret, body));
}

function safeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function randomHexId(bytes = 16): string {
  const buf = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(buf);
  return toHex(buf);
}

/** Count leading zero bits in a SHA-256 digest. */
export function countLeadingZeroBits(digest: Uint8Array): number {
  let bits = 0;
  for (const byte of digest) {
    if (byte === 0) {
      bits += 8;
      continue;
    }
    for (let i = 7; i >= 0; i -= 1) {
      if ((byte >> i) & 1) return bits;
      bits += 1;
    }
  }
  return bits;
}

/** Hash used for agent-register PoW: SHA-256(challenge_id + ":" + nonce). */
export function agentRegisterPowDigest(
  challengeId: string,
  nonce: string,
): Uint8Array {
  return sha256Bytes(textEncoder.encode(`${challengeId}:${nonce}`));
}

/** Stable IP fingerprint bound into the signed challenge. */
export function fingerprintAgentRegisterIp(
  secret: string,
  ip: string,
): string {
  return toHex(sha256Bytes(textEncoder.encode(`${secret}:${ip.trim()}`))).slice(
    0,
    32,
  );
}

/** Issue a signed, IP-bound register challenge. */
export function issueAgentRegisterPowChallenge(
  input: AgentRegisterPowIssueInput,
): AgentRegisterPowChallenge {
  const now = input.nowMs ?? Date.now();
  const ttlMs = input.ttlMs ?? AGENT_REGISTER_POW_TTL_MS;
  const difficulty = Math.min(
    AGENT_REGISTER_POW_MAX_DIFFICULTY,
    Math.max(
      1,
      Math.floor(input.difficulty ?? AGENT_REGISTER_POW_DEFAULT_DIFFICULTY),
    ),
  );
  const payload: ChallengePayload = {
    v: 1,
    id: randomHexId(16),
    exp: now + ttlMs,
    d: difficulty,
    ip: input.ipFingerprint,
  };
  const body = toBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const sig = signPayload(input.secret, body);
  const challenge_id = `v1.${body}.${sig}`;
  return {
    challenge_id,
    difficulty,
    expires_at: new Date(payload.exp).toISOString(),
  };
}

function parseChallenge(
  challengeId: string,
  secret: string,
): ChallengePayload | null {
  const parts = challengeId.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;
  const [, body, sig] = parts;
  if (!body || !sig) return null;
  const expected = signPayload(secret, body);
  if (!safeEqualStr(sig, expected)) return null;
  const raw = fromBase64Url(body);
  if (!raw) return null;
  try {
    const parsed = parseJson(new TextDecoder().decode(raw));
    if (!isJsonObject(parsed)) return null;
    const id = readString(parsed, "id");
    const exp = readNumber(parsed, "exp");
    const difficulty = readNumber(parsed, "d");
    const ip = readString(parsed, "ip");
    if (
      parsed["v"] !== 1 ||
      !isString(id) ||
      !isNumber(exp) ||
      !isNumber(difficulty) ||
      !isString(ip)
    ) {
      return null;
    }
    return { v: 1, id, exp, d: difficulty, ip };
  } catch {
    return null;
  }
}

/** Verify PoW solution for a challenge bound to an IP fingerprint. */
export function verifyAgentRegisterPow(
  input: AgentRegisterPowVerifyInput,
): AgentRegisterPowVerifyResult {
  const now = input.nowMs ?? Date.now();
  const challengeId = input.challengeId?.trim() ?? "";
  const nonce = input.nonce?.trim() ?? "";
  if (!challengeId || !nonce) {
    return { ok: false, reason: "missing_pow" };
  }
  const payload = parseChallenge(challengeId, input.secret);
  if (!payload) {
    return { ok: false, reason: "invalid_challenge" };
  }
  if (payload.exp <= now) {
    return { ok: false, reason: "expired_challenge" };
  }
  if (payload.ip !== input.ipFingerprint) {
    return { ok: false, reason: "ip_mismatch" };
  }
  const digest = agentRegisterPowDigest(challengeId, nonce);
  if (countLeadingZeroBits(digest) < payload.d) {
    return { ok: false, reason: "insufficient_work" };
  }
  return { ok: true, challengeInnerId: payload.id };
}

/**
 * Find a nonce that satisfies the challenge difficulty.
 * Safe for MCP/CLI clients (no secret required).
 */
export function solveAgentRegisterPow(
  challengeId: string,
  difficulty: number,
  options?: { maxAttempts?: number },
): string {
  const target = Math.max(1, Math.floor(difficulty));
  const maxAttempts = options?.maxAttempts ?? 50_000_000;
  for (let i = 0; i < maxAttempts; i += 1) {
    const nonce = i.toString(36);
    if (
      countLeadingZeroBits(agentRegisterPowDigest(challengeId, nonce)) >= target
    ) {
      return nonce;
    }
  }
  throw new Error("Failed to solve agent register proof-of-work");
}
