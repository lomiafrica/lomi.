import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isAuthStorageCookieName,
  isInvalidRefreshTokenResponseBody,
  isSupabaseRefreshTokenRequest,
} from "./auth-recovery.js";

test("detects GoTrue refresh-token 400 bodies", () => {
  assert.equal(
    isInvalidRefreshTokenResponseBody({
      error: "invalid_grant",
      error_description: "Invalid Refresh Token: Refresh Token Not Found",
    }),
    true,
  );
  assert.equal(
    isInvalidRefreshTokenResponseBody({
      error_code: "refresh_token_not_found",
      msg: "Invalid Refresh Token",
    }),
    true,
  );
  assert.equal(
    isInvalidRefreshTokenResponseBody({
      error: "invalid_grant",
      error_description: "Invalid Refresh Token: Already Used",
    }),
    true,
  );
  assert.equal(
    isInvalidRefreshTokenResponseBody({
      error: "invalid_grant",
    }),
    true,
  );
  assert.equal(
    isInvalidRefreshTokenResponseBody({
      error: "over_request_rate_limit",
    }),
    false,
  );
});

test("matches chunked supabase-ssr auth cookie names", () => {
  const key = "sb-mdswvokxrnfggrujsfjd-admin-auth";
  assert.equal(isAuthStorageCookieName(key, key), true);
  assert.equal(isAuthStorageCookieName(`${key}.0`, key), true);
  assert.equal(isAuthStorageCookieName(`${key}.1`, key), true);
  assert.equal(isAuthStorageCookieName(`${key}-code-verifier`, key), true);
  assert.equal(
    isAuthStorageCookieName("sb-mdswvokxrnfggrujsfjd-dashboard-auth", key),
    false,
  );
});

test("identifies refresh-token grant requests", () => {
  assert.equal(
    isSupabaseRefreshTokenRequest(
      "https://mdswvokxrnfggrujsfjd.supabase.co/auth/v1/token?grant_type=refresh_token",
    ),
    true,
  );
  assert.equal(
    isSupabaseRefreshTokenRequest(
      "https://mdswvokxrnfggrujsfjd.supabase.co/auth/v1/token?grant_type=password",
    ),
    false,
  );
});
