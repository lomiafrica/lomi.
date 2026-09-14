/**
 * Per-instance HTTP client for the lomi. SDK.
 */

import type { LomiConfig } from "./config.js";
import { DEFAULT_CONFIG } from "./config.js";
import type {
  LomiClientRequestOptions,
  LomiHeaders,
  LomiPathParameters,
} from "./request-options.js";

export class LomiClient {
  public readonly baseUrl: string;
  public readonly timeout: number;
  public readonly retries: number;
  private apiKey: string;
  private defaultAccount?: string;
  private defaultHeaders: LomiHeaders;

  constructor(config: LomiConfig) {
    this.baseUrl =
      config.baseUrl ??
      (config.environment === "test"
        ? DEFAULT_CONFIG.sandboxBaseUrl
        : DEFAULT_CONFIG.baseUrl);
    this.timeout = config.timeout ?? DEFAULT_CONFIG.timeout;
    this.retries = config.retries ?? DEFAULT_CONFIG.retries;
    this.apiKey = config.apiKey;
    this.defaultAccount = config.account;
    this.defaultHeaders = { ...config.headers };
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  buildUrl(pathTemplate: string, path?: LomiPathParameters): string {
    let url = `${this.baseUrl}${pathTemplate}`;
    if (path) {
      for (const [key, value] of Object.entries(path)) {
        url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
      }
    }
    return url;
  }

  buildHeaders(options?: LomiClientRequestOptions): LomiHeaders {
    const headers: LomiHeaders = {
      "Content-Type": "application/json",
      "X-API-KEY": this.apiKey,
      ...this.defaultHeaders,
      ...options?.headers,
    };
    const account = options?.account ?? this.defaultAccount;
    if (account) {
      headers["Lomi-Account"] = account;
    }
    if (options?.idempotencyKey) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }
    return headers;
  }
}
