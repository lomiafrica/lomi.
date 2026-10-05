import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isPublicIp } from "./network.ts";
import { mintConsoleToken, verifyConsoleToken } from "./token.ts";
import { assertRef, SNAPSHOT_EXPRESSION } from "./snapshot.ts";

describe("public addresses", () => {
  it("blocks private and loopback ranges", () => {
    assert.equal(isPublicIp("127.0.0.1"), false);
    assert.equal(isPublicIp("10.1.1.1"), false);
    assert.equal(isPublicIp("192.168.1.1"), false);
    assert.equal(isPublicIp("169.254.1.1"), false);
    assert.equal(isPublicIp("1.1.1.1"), true);
  });
});

describe("live view token", () => {
  it("accepts a fresh token for the same session", () => {
    const token = mintConsoleToken(
      "a".repeat(32),
      "11111111-1111-4111-8111-111111111111",
      1_000,
    );
    assert.equal(
      verifyConsoleToken(
        "a".repeat(32),
        "11111111-1111-4111-8111-111111111111",
        token,
        1_000,
      ),
      true,
    );
  });

  it("rejects another session and an expired token", () => {
    const token = mintConsoleToken(
      "a".repeat(32),
      "11111111-1111-4111-8111-111111111111",
      1_000,
    );
    assert.equal(
      verifyConsoleToken(
        "a".repeat(32),
        "22222222-2222-4222-8222-222222222222",
        token,
        1_000,
      ),
      false,
    );
    assert.equal(
      verifyConsoleToken(
        "a".repeat(32),
        "11111111-1111-4111-8111-111111111111",
        token,
        1_000 + 16 * 60_000,
      ),
      false,
    );
  });
});

describe("snapshot source", () => {
  it("keeps the whitespace regex intact", () => {
    assert.match(SNAPSHOT_EXPRESSION, /replace\(\/\\s\+\/g/);
    assert.match(SNAPSHOT_EXPRESSION, /__sandRefs/);
  });
});

describe("refs", () => {
  it("accepts snapshot refs only", () => {
    assert.equal(assertRef("e12"), "e12");
    assert.throws(() => assertRef("e0"));
    assert.throws(() => assertRef("window"));
  });
});
