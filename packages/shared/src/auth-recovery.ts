import {
  isJsonObject,
  isString,
  readString,
  type JsonObject,
  type JsonValue,
} from "./json-value.js";

/**
 * Read a request target as an href string (fetch input variants).
 */
export function readRequestHref(input: string | URL | Request): string {
  if (input instanceof Request) return input.url;
  if (input instanceof URL) return input.href;
  if (isString(input)) return input;
  return String(input);
}

/** True when the request hits Supabase Auth `/auth/v1/token`. */
export function isSupabaseAuthTokenRequest(
  url: string | URL | Request,
): boolean {
  return readRequestHref(url).includes("/auth/v1/token");
}

/** True for refresh_token grant requests on `/auth/v1/token`. */
export function isSupabaseRefreshTokenRequest(
  url: string | URL | Request,
): boolean {
  const href = readRequestHref(url);
  return (
    href.includes("/auth/v1/token") &&
    href.includes("grant_type=refresh_token")
  );
}

function readInvalidRefreshTokenMessage(body: JsonObject): string {
  return [
    readString(body, "error"),
    readString(body, "error_code"),
    readString(body, "msg"),
    readString(body, "error_description"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/**
 * Whether a parsed Auth error body indicates an invalid/missing refresh token.
 * Callers should only invoke this for HTTP 400 responses.
 */
export function isInvalidRefreshTokenResponseBody(json: JsonValue): boolean {
  if (!isJsonObject(json)) return false;

  const message = readInvalidRefreshTokenMessage(json);
  return (
    message.includes("refresh token not found") ||
    message.includes("invalid refresh token") ||
    message.includes("refresh_token_not_found") ||
    message.includes("already used") ||
    message.includes("invalid_grant") ||
    message.includes("session_not_found")
  );
}

/** Cookie names @supabase/ssr writes for a given `auth.storageKey`. */
export function isAuthStorageCookieName(
  cookieName: string,
  storageKey: string,
): boolean {
  return (
    cookieName === storageKey ||
    cookieName.startsWith(`${storageKey}.`) ||
    cookieName.startsWith(`${storageKey}-`)
  );
}
