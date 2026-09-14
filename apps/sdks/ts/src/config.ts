import type { LomiHeaders } from "./request-options.js";

/**
 * SDK Configuration
 */

export interface LomiConfig {
  /**
   * Secret API key (`lomi_sk_test_…` or `lomi_sk_live_…`)
   */
  apiKey: string;

  /**
   * Sandbox (`test`) or production (`live`). Maps to the API host when `baseUrl` is omitted.
   * @default 'live'
   */
  environment?: "live" | "test";

  /**
   * Override API base URL (optional). When omitted, `environment` selects the host.
   */
  baseUrl?: string;

  /**
   * Default connected account for operator integrations (`acct_…` → `Lomi-Account` header).
   */
  account?: string;

  /**
   * Extra headers merged into every request.
   */
  headers?: LomiHeaders;

  /**
   * Request timeout in milliseconds.
   * @default 30000
   */
  timeout?: number;

  /**
   * Retry count for idempotent GET requests and 429 responses (exponential backoff).
   * @default 0
   */
  retries?: number;
}

export const DEFAULT_CONFIG = {
  baseUrl: "https://api.lomi.africa",
  sandboxBaseUrl: "https://sandbox.api.lomi.africa",
  timeout: 30000,
  environment: "live" as const,
  retries: 0,
};
