import { describe, expect, it } from "vitest";
import {
  fingerprintAgentRegisterIp,
  issueAgentRegisterPowChallenge,
  sha256Bytes,
  solveAgentRegisterPow,
  verifyAgentRegisterPow,
} from "@lomi./shared";

const SECRET = "test-pow-secret";

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

describe("agent register PoW", () => {
  it("matches the SHA-256 vector for abc", () => {
    expect(toHex(sha256Bytes(new TextEncoder().encode("abc")))).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });
  it("issues, solves, and verifies a challenge for the same IP", () => {
    const ip = fingerprintAgentRegisterIp(SECRET, "203.0.113.10");
    const challenge = issueAgentRegisterPowChallenge({
      secret: SECRET,
      ipFingerprint: ip,
      difficulty: 8,
    });
    const nonce = solveAgentRegisterPow(
      challenge.challenge_id,
      challenge.difficulty,
    );
    const result = verifyAgentRegisterPow({
      secret: SECRET,
      ipFingerprint: ip,
      challengeId: challenge.challenge_id,
      nonce,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects an expired challenge", () => {
    const ip = fingerprintAgentRegisterIp(SECRET, "203.0.113.10");
    const now = 1_700_000_000_000;
    const challenge = issueAgentRegisterPowChallenge({
      secret: SECRET,
      ipFingerprint: ip,
      difficulty: 8,
      ttlMs: 1_000,
      nowMs: now,
    });
    const nonce = solveAgentRegisterPow(challenge.challenge_id, 8);
    const result = verifyAgentRegisterPow({
      secret: SECRET,
      ipFingerprint: ip,
      challengeId: challenge.challenge_id,
      nonce,
      nowMs: now + 2_000,
    });
    expect(result).toEqual({ ok: false, reason: "expired_challenge" });
  });

  it("rejects an IP mismatch", () => {
    const ip = fingerprintAgentRegisterIp(SECRET, "203.0.113.10");
    const other = fingerprintAgentRegisterIp(SECRET, "198.51.100.20");
    const challenge = issueAgentRegisterPowChallenge({
      secret: SECRET,
      ipFingerprint: ip,
      difficulty: 8,
    });
    const nonce = solveAgentRegisterPow(challenge.challenge_id, 8);
    const result = verifyAgentRegisterPow({
      secret: SECRET,
      ipFingerprint: other,
      challengeId: challenge.challenge_id,
      nonce,
    });
    expect(result).toEqual({ ok: false, reason: "ip_mismatch" });
  });

  it("rejects insufficient work", () => {
    const ip = fingerprintAgentRegisterIp(SECRET, "203.0.113.10");
    const challenge = issueAgentRegisterPowChallenge({
      secret: SECRET,
      ipFingerprint: ip,
      difficulty: 16,
    });
    const result = verifyAgentRegisterPow({
      secret: SECRET,
      ipFingerprint: ip,
      challengeId: challenge.challenge_id,
      nonce: "0",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("insufficient_work");
    }
  });
});
