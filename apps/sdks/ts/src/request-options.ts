/**
 * Per-request options (idempotency, connected account, abort).
 */

import type { JsonPrimitive } from "@lomi./shared";

export type LomiHeaders = { [key: string]: string };
export type LomiPathParameters = { [key: string]: string | number };
export interface LomiQueryParameters {}
export interface LomiRequestBody {}
export type LomiRequestPayload = JsonPrimitive | LomiRequestBody;

export type LomiRequestOptions = {
  /** Idempotency key for safe retries on create-style calls (`Idempotency-Key` header). */
  idempotencyKey?: string;
  /** Connected account id (`Lomi-Account` header, `acct_…`). Overrides client default. */
  account?: string;
  /** AbortSignal for cancellation. */
  signal?: AbortSignal;
  /** Extra headers for this request only. */
  headers?: LomiHeaders;
};

export type LomiHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type LomiClientRequestOptions = LomiRequestOptions & {
  method: LomiHttpMethod;
  url: string;
  path?: LomiPathParameters;
  query?: LomiQueryParameters;
  body?: LomiRequestPayload;
};
