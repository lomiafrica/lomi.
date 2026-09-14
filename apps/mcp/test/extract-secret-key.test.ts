import { describe, expect, it } from "vitest";
import { extractMerchantSecretKey } from "../src/extract-secret-key.js";

describe("extractMerchantSecretKey", () => {
  it("extracts a test secret key from a complete-onboarding envelope", () => {
    const body = JSON.stringify({
      ok: true,
      status: 200,
      body: {
        merchant_id: "m_1",
        organization_id: "o_1",
        test_secret_key: "lomi_sk_test_abcdef0123456789",
        publishable_key: "lomi_pk_abcdef0123456789",
      },
    });
    expect(extractMerchantSecretKey(body)).toBe(
      "lomi_sk_test_abcdef0123456789",
    );
  });

  it("extracts from an api-keys list and prefers the test secret key", () => {
    const body = JSON.stringify({
      ok: true,
      body: [
        { key_type: "publishable", api_key: "lomi_pk_live0000000000000" },
        { key_type: "secret", api_key: "lomi_sk_test_zzzzzzzzzzzzzzzz" },
      ],
    });
    expect(extractMerchantSecretKey(body)).toBe(
      "lomi_sk_test_zzzzzzzzzzzzzzzz",
    );
  });

  it("ignores masked live secret keys", () => {
    const body = JSON.stringify({
      body: [{ key_type: "secret", api_key: "lomi_sk_1234••••••••" }],
    });
    expect(extractMerchantSecretKey(body)).toBeNull();
  });

  it("returns null when no secret key is present", () => {
    const body = JSON.stringify({ body: { status: "pending" } });
    expect(extractMerchantSecretKey(body)).toBeNull();
  });

  it("returns null for non-JSON bodies", () => {
    expect(extractMerchantSecretKey("not json")).toBeNull();
  });
});
