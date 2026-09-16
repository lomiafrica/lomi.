import { readEnvOptional } from "../json-value.js";

export const FNE_FLAG_KEY = "fne_enabled";
export const FNE_DEFAULT_BASE_URL = "http://54.247.95.108/ws";
export const DGIPAY_DEFAULT_BASE_URL = "https://test-bj.imaniafrica.com";

export type FneConfig = {
  enabled: boolean;
  apiKey: string | null;
  baseUrl: string;
};

export type DgiPayConfig = {
  enabled: boolean;
  apiKey: string | null;
  apiSecret: string | null;
  aggregator: string | null;
  baseUrl: string;
};

function flagEnabled(value: string | undefined): boolean {
  return value === "1" || value === "true";
}

function trimOrNull(value: string | undefined): string | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/** Read FNE invoice-API env. Key is required only when the flag is on. */
export function readFneConfig(
  env: Record<string, string | undefined> = {},
): FneConfig {
  const enabled = flagEnabled(
    env["FNE_ENABLED"] ?? readEnvOptional("FNE_ENABLED"),
  );
  const apiKey = trimOrNull(
    env["FNE_API_KEY"] ?? readEnvOptional("FNE_API_KEY"),
  );
  const baseUrl =
    trimOrNull(env["FNE_BASE_URL"] ?? readEnvOptional("FNE_BASE_URL")) ??
    FNE_DEFAULT_BASE_URL;
  return { enabled, apiKey, baseUrl: baseUrl.replace(/\/$/, "") };
}

/** Read DGIPay aggregator env. Keys are required only when the flag is on. */
export function readDgiPayConfig(
  env: Record<string, string | undefined> = {},
): DgiPayConfig {
  const enabled = flagEnabled(
    env["DGIPAY_ENABLED"] ?? readEnvOptional("DGIPAY_ENABLED"),
  );
  const apiKey = trimOrNull(
    env["DGIPAY_API_KEY"] ?? readEnvOptional("DGIPAY_API_KEY"),
  );
  const apiSecret = trimOrNull(
    env["DGIPAY_API_SECRET"] ?? readEnvOptional("DGIPAY_API_SECRET"),
  );
  const aggregator = trimOrNull(
    env["DGIPAY_AGGREGATOR"] ?? readEnvOptional("DGIPAY_AGGREGATOR"),
  );
  const baseUrl =
    trimOrNull(env["DGIPAY_BASE_URL"] ?? readEnvOptional("DGIPAY_BASE_URL")) ??
    DGIPAY_DEFAULT_BASE_URL;
  if (enabled && (apiKey === null || apiSecret === null || aggregator === null)) {
    throw new Error(
      "DGIPay requires DGIPAY_API_KEY, DGIPAY_API_SECRET, and DGIPAY_AGGREGATOR when enabled.",
    );
  }
  return {
    enabled,
    apiKey,
    apiSecret,
    aggregator,
    baseUrl: baseUrl.replace(/\/$/, ""),
  };
}

/** Hide API keys in logs and snapshots. */
export function redactFneConfig(config: FneConfig): FneConfig {
  return {
    ...config,
    apiKey: config.apiKey === null ? null : "[redacted]",
  };
}

/** Hide DGIPay secrets in logs and snapshots. */
export function redactDgiPayConfig(config: DgiPayConfig): DgiPayConfig {
  return {
    ...config,
    apiKey: config.apiKey === null ? null : "[redacted]",
    apiSecret: config.apiSecret === null ? null : "[redacted]",
  };
}
