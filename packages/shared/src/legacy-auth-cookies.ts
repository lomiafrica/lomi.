import { isAuthStorageCookieName } from "./auth-recovery.js";
import { isJsonObject, parseJson, readString } from "./json-value.js";

const BASE64_PREFIX = "base64-";
const DEFAULT_APEX = "lomi.africa";

export const LOMI_SUPABASE_AUTH_KEY_SUFFIXES = [
  "dashboard-auth",
  "admin-auth",
  "website-auth",
  "docs-auth",
  "storefront-auth",
  "checkout-auth",
  "auth-token",
] as const;

export function supabaseAuthStorageKey(
  projectRef: string,
  suffix: string,
): string {
  return `sb-${projectRef}-${suffix}`;
}

export function supabaseProjectRefFromUrl(supabaseUrl: string): string {
  return new URL(supabaseUrl).hostname.split(".")[0] ?? "";
}

/**
 * Parse a Cookie header keeping the last value per name.
 * Browsers list older Domain=.apex cookies before later host-only ones;
 * RFC 6265 last-wins is the cookie we wrote most recently.
 */
export function parseCookieHeaderKeepLast(header: string) {
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const name = trimmed.slice(0, eq);
    const raw = trimmed.slice(eq + 1);
    try {
      out[name] = decodeURIComponent(raw);
    } catch {
      out[name] = raw;
    }
  }
  return out;
}

export function combineAuthCookieChunks(
  cookies: Record<string, string>,
  storageKey: string,
): string | null {
  const whole = cookies[storageKey];
  if (whole) return whole;
  const parts: string[] = [];
  for (let i = 0; ; i += 1) {
    const chunk = cookies[`${storageKey}.${i}`];
    if (!chunk) break;
    parts.push(chunk);
  }
  return parts.length > 0 ? parts.join("") : null;
}

function stringFromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = padded.length % 4;
  const base64 = remainder === 0 ? padded : padded + "=".repeat(4 - remainder);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function decodeSupabaseAuthCookieValue(value: string): string | null {
  if (!value.startsWith(BASE64_PREFIX)) {
    try {
      parseJson(value);
      return value;
    } catch {
      return null;
    }
  }
  try {
    const decoded = stringFromBase64Url(value.slice(BASE64_PREFIX.length));
    parseJson(decoded);
    return decoded;
  } catch {
    return null;
  }
}

export function isPersistedSupabaseSession(json: string): boolean {
  try {
    const parsed = parseJson(json);
    if (!isJsonObject(parsed)) return false;
    const access = readString(parsed, "access_token");
    const refresh = readString(parsed, "refresh_token");
    return Boolean(access && refresh);
  } catch {
    return false;
  }
}

export function sessionJsonFromAuthCookies(
  cookieHeader: string,
  storageKey: string,
): string | null {
  const cookies = parseCookieHeaderKeepLast(cookieHeader);
  const combined = combineAuthCookieChunks(cookies, storageKey);
  if (!combined) return null;
  const decoded = decodeSupabaseAuthCookieValue(combined);
  if (!decoded || !isPersistedSupabaseSession(decoded)) return null;
  return decoded;
}

export function expireCookieAssignments(
  name: string,
  apexDomain: string,
  secure: boolean,
): string[] {
  const suffixes = [
    "path=/; max-age=0",
    `path=/; max-age=0; domain=.${apexDomain}`,
    `path=/; max-age=0; domain=${apexDomain}`,
  ];
  if (secure) {
    return suffixes.map((suffix) => `${name}=; ${suffix}; secure`);
  }
  return suffixes.map((suffix) => `${name}=; ${suffix}`);
}

export function lomiSupabaseAuthStorageKeys(projectRef: string): string[] {
  return LOMI_SUPABASE_AUTH_KEY_SUFFIXES.map((suffix) =>
    supabaseAuthStorageKey(projectRef, suffix),
  );
}

function cookieNamesToExpire(
  cookieHeader: string,
  projectRef: string,
): string[] {
  const keys = lomiSupabaseAuthStorageKeys(projectRef);
  const names = new Set(keys);
  const parsed = parseCookieHeaderKeepLast(cookieHeader);
  for (const name of Object.keys(parsed)) {
    if (keys.some((key) => isAuthStorageCookieName(name, key))) {
      names.add(name);
    }
  }
  for (const key of keys) {
    names.add(`${key}-code-verifier`);
    for (let i = 0; i < 8; i += 1) {
      names.add(`${key}.${i}`);
    }
  }
  return [...names];
}

type BrowserDocument = {
  cookie: string;
};

type BrowserStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

type BrowserGlobal = {
  document?: BrowserDocument;
  localStorage?: BrowserStorage;
  location?: { protocol?: string };
};

function browserGlobal(): BrowserGlobal {
  // SAFETY: document, localStorage, and location live on the browser host; optional chaining is the boundary.
  return globalThis as BrowserGlobal;
}

function browserDocument(): BrowserDocument | null {
  return browserGlobal().document ?? null;
}

function browserLocalStorage(): BrowserStorage | null {
  try {
    return browserGlobal().localStorage ?? null;
  } catch {
    return null;
  }
}

export type AdoptLegacyAuthCookiesOptions = {
  supabaseUrl: string;
  storageKey?: string;
  apexDomain?: string;
  secure?: boolean;
};

/**
 * Copy a valid @supabase/ssr cookie session into localStorage (once), then
 * delete host-only and parent-domain auth cookies so they cannot shadow it.
 */
export function adoptLegacyAuthCookies(
  options: AdoptLegacyAuthCookiesOptions,
): boolean {
  const doc = browserDocument();
  if (!doc) return false;

  const projectRef = supabaseProjectRefFromUrl(options.supabaseUrl);
  if (!projectRef) return false;

  const apexDomain = options.apexDomain ?? DEFAULT_APEX;
  const secure =
    options.secure ?? browserGlobal().location?.protocol === "https:";

  let imported = false;
  const storage = browserLocalStorage();
  if (options.storageKey && storage) {
    try {
      if (!storage.getItem(options.storageKey)) {
        const sessionJson = sessionJsonFromAuthCookies(
          doc.cookie,
          options.storageKey,
        );
        if (sessionJson) {
          storage.setItem(options.storageKey, sessionJson);
          imported = true;
        }
      }
    } catch {
      /* private mode */
    }
  }

  for (const name of cookieNamesToExpire(doc.cookie, projectRef)) {
    for (const assignment of expireCookieAssignments(
      name,
      apexDomain,
      secure,
    )) {
      doc.cookie = assignment;
    }
  }

  return imported;
}
