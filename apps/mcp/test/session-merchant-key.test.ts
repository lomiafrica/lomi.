import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Request } from "express";

import {
  extractSessionMerchantApiKey,
  looksLikeLomiApiCredential,
} from "../src/session-merchant-key.js";

const isTransportBearer = vi.fn((_token: string) => false);

function req(headers: {
  [name: string]: string | string[] | undefined;
}): Request {
  // SAFETY: Express Request is only read for headers in extractSessionMerchantApiKey.
  return { headers } as Request;
}

describe("looksLikeLomiApiCredential", () => {
  it("accepts known prefixes", () => {
    expect(looksLikeLomiApiCredential("lomi_mcp_" + "a".repeat(20))).toBe(true);
    expect(looksLikeLomiApiCredential("lomi_cli_" + "b".repeat(20))).toBe(true);
    expect(looksLikeLomiApiCredential("lomi_sk_" + "c".repeat(20))).toBe(true);
  });

  it("rejects short or unrelated tokens", () => {
    expect(looksLikeLomiApiCredential("lomi_")).toBe(false);
    expect(looksLikeLomiApiCredential("secret")).toBe(false);
    expect(looksLikeLomiApiCredential("lomi_oat_" + "x".repeat(20))).toBe(
      false,
    );
    expect(looksLikeLomiApiCredential("lomi_prov_" + "y".repeat(20))).toBe(
      false,
    );
    expect(looksLikeLomiApiCredential("lomi_partner_" + "z".repeat(20))).toBe(
      false,
    );
  });
});

describe("extractSessionMerchantApiKey", () => {
  beforeEach(() => {
    isTransportBearer.mockReset();
    isTransportBearer.mockReturnValue(false);
  });

  it("prefers explicit API key headers", () => {
    expect(
      extractSessionMerchantApiKey(
        req({
          "x-lomi-api-key": "lomi_mcp_one_abcdefghij",
          authorization: "Bearer lomi_mcp_two_abcdefghij",
        }),
        isTransportBearer,
      ),
    ).toBe("lomi_mcp_one_abcdefghij");
  });

  it("rejects header values that do not look like lomi credentials", () => {
    expect(
      extractSessionMerchantApiKey(
        req({
          "x-lomi-api-key": "not-a-lomi-key",
        }),
        isTransportBearer,
      ),
    ).toBe(null);
  });

  it("reads x-api-key", () => {
    expect(
      extractSessionMerchantApiKey(
        req({
          "x-api-key": "lomi_sk_testkey123456789012345678901234567890",
        }),
        isTransportBearer,
      ),
    ).toBe("lomi_sk_testkey123456789012345678901234567890");
  });

  it("reads Bearer merchant credential when transport bearer unset", () => {
    isTransportBearer.mockReturnValue(false);
    expect(
      extractSessionMerchantApiKey(
        req({ authorization: "Bearer lomi_mcp_abcdefghijklmnop" }),
        isTransportBearer,
      ),
    ).toBe("lomi_mcp_abcdefghijklmnop");
  });

  it("ignores Bearer when it matches any MCP transport secret", () => {
    isTransportBearer.mockImplementation(
      (t) => t === "transport-secret" || t === "transport-secret-2",
    );
    expect(
      extractSessionMerchantApiKey(
        req({ authorization: "Bearer transport-secret" }),
        isTransportBearer,
      ),
    ).toBe(null);
    expect(
      extractSessionMerchantApiKey(
        req({ authorization: "Bearer transport-secret-2" }),
        isTransportBearer,
      ),
    ).toBe(null);
  });
});
