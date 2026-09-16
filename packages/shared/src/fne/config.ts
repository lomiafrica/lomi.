import { readEnvOptional } from "../json-value.js";

/** PostHog / product flag key (merchant + platform). Default off. */
export const FNE_KOMPTO_FEATURE_FLAG = "fne_kompto_enabled";

export const KOMPTO_API_KEY_ENV = "KOMPTO_API_KEY";
export const KOMPTO_BASE_URL_ENV = "KOMPTO_BASE_URL";
export const FNE_KOMPTO_ENABLED_ENV = "FNE_KOMPTO_ENABLED";
export const VITE_FNE_KOMPTO_ENABLED_ENV = "VITE_FNE_KOMPTO_ENABLED";

/** Public KOMPTO API host from https://kompto.com/KomptoApi */
export const KOMPTO_DEFAULT_BASE_URL = "https://app.kompto.com";

export type KomptoConfig = {
  enabled: boolean;
  apiKey: string | null;
  baseUrl: string;
};

export type EnvBag = {
  [key: string]: string | undefined;
};

function isTruthyFlag(value: string | undefined): boolean {
  if (value === undefined) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function readFromBag(
  bag: EnvBag | undefined,
  name: string,
): string | undefined {
  if (bag) {
    const value = bag[name];
    if (value !== undefined && value !== "") return value;
    return undefined;
  }
  return readEnvOptional(name);
}

function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Load KOMPTO config from env. API key is required only when the flag is on.
 * Never log the returned `apiKey`.
 */
export function readKomptoConfig(bag?: EnvBag): KomptoConfig {
  const enabled = isTruthyFlag(
    readFromBag(bag, FNE_KOMPTO_ENABLED_ENV) ??
      readFromBag(bag, VITE_FNE_KOMPTO_ENABLED_ENV),
  );
  const apiKey = readFromBag(bag, KOMPTO_API_KEY_ENV) ?? null;
  const baseUrlRaw =
    readFromBag(bag, KOMPTO_BASE_URL_ENV) ?? KOMPTO_DEFAULT_BASE_URL;
  const baseUrl = trimTrailingSlash(baseUrlRaw.trim());

  if (enabled && (apiKey === null || apiKey.trim() === "")) {
    throw new Error(
      `Missing required environment variable: ${KOMPTO_API_KEY_ENV}`,
    );
  }

  if (enabled && baseUrl === "") {
    throw new Error(
      `Missing required environment variable: ${KOMPTO_BASE_URL_ENV}`,
    );
  }

  return {
    enabled,
    apiKey: apiKey && apiKey.trim() !== "" ? apiKey.trim() : null,
    baseUrl: baseUrl === "" ? KOMPTO_DEFAULT_BASE_URL : baseUrl,
  };
}

/** Safe view for logs and tests. Never includes the raw API key. */
export function redactKomptoConfig(config: KomptoConfig): {
  enabled: boolean;
  baseUrl: string;
  apiKey: "redacted" | null;
  featureFlag: typeof FNE_KOMPTO_FEATURE_FLAG;
} {
  return {
    enabled: config.enabled,
    baseUrl: config.baseUrl,
    apiKey: config.apiKey ? "redacted" : null,
    featureFlag: FNE_KOMPTO_FEATURE_FLAG,
  };
}
