import assert from "node:assert/strict";
import { test } from "node:test";
import {
  combineAuthCookieChunks,
  decodeSupabaseAuthCookieValue,
  expireCookieAssignments,
  isPersistedSupabaseSession,
  parseCookieHeaderKeepLast,
  sessionJsonFromAuthCookies,
  supabaseAuthStorageKey,
  supabaseProjectRefFromUrl,
} from "./legacy-auth-cookies.js";

const KEY = "sb-mdswvokxrnfggrujsfjd-dashboard-auth";
const SESSION = JSON.stringify({
  access_token: "at",
  refresh_token: "rt",
  expires_at: 1_800_000_000,
  token_type: "bearer",
  user: { id: "u1" },
});

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

test("parses duplicate cookie names last-wins", () => {
  const parsed = parseCookieHeaderKeepLast("a=first; a=second; b=keep");
  assert.equal(parsed.a, "second");
  assert.equal(parsed.b, "keep");
});

test("combines chunked cookies and prefers the unchunked name", () => {
  assert.equal(
    combineAuthCookieChunks({ [KEY]: "whole", [`${KEY}.0`]: "part" }, KEY),
    "whole",
  );
  assert.equal(
    combineAuthCookieChunks({ [`${KEY}.0`]: "aa", [`${KEY}.1`]: "bb" }, KEY),
    "aabb",
  );
  assert.equal(combineAuthCookieChunks({}, KEY), null);
});

test("decodes base64- cookie payloads", () => {
  const encoded = `base64-${toBase64Url(SESSION)}`;
  assert.equal(decodeSupabaseAuthCookieValue(encoded), SESSION);
  assert.equal(decodeSupabaseAuthCookieValue(SESSION), SESSION);
  assert.equal(decodeSupabaseAuthCookieValue("base64-****"), null);
  assert.equal(decodeSupabaseAuthCookieValue("not-json"), null);
});

test("imports the last duplicate chunk set", () => {
  const frozen = JSON.stringify({
    access_token: "old",
    refresh_token: "stale",
  });
  const encodedFrozen = `base64-${toBase64Url(frozen)}`;
  const encodedFresh = `base64-${toBase64Url(SESSION)}`;
  const header = `${KEY}=${encodedFrozen}; ${KEY}=${encodedFresh}`;
  assert.equal(sessionJsonFromAuthCookies(header, KEY), SESSION);
});

test("rejects payloads without refresh_token", () => {
  assert.equal(
    isPersistedSupabaseSession(JSON.stringify({ access_token: "at" })),
    false,
  );
  assert.equal(isPersistedSupabaseSession(SESSION), true);
});

test("expire assignments cover host-only and parent domain", () => {
  const assignments = expireCookieAssignments(KEY, "lomi.africa", true);
  assert.equal(assignments.length, 3);
  assert.ok(assignments.every((row) => row.includes("max-age=0")));
  assert.ok(assignments.some((row) => row.includes("domain=.lomi.africa")));
  assert.ok(assignments.some((row) => !row.includes("domain=")));
});

test("derives the project ref from the Supabase URL", () => {
  assert.equal(
    supabaseProjectRefFromUrl("https://mdswvokxrnfggrujsfjd.supabase.co"),
    "mdswvokxrnfggrujsfjd",
  );
  assert.equal(
    supabaseAuthStorageKey("mdswvokxrnfggrujsfjd", "dashboard-auth"),
    KEY,
  );
});
