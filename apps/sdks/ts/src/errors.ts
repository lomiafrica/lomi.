import type { JsonValue } from "@lomi./shared";

/**
 * Custom error classes for lomi. SDK
 */

export type LomiApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    details?: JsonValue;
  };
  request_id?: string;
  message?: string | string[];
};

export class LomiError extends Error {
  /** HTTP status (alias of statusCode for axios familiarity). */
  public readonly status?: number;

  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: JsonValue,
    public requestId?: string,
    public body?: LomiApiErrorBody,
  ) {
    super(message);
    this.name = "LomiError";
    this.status = statusCode;
    Object.setPrototypeOf(this, LomiError.prototype);
  }
}

export class LomiValidationError extends LomiError {
  constructor(
    message: string,
    public errors?: JsonValue,
    requestId?: string,
    body?: LomiApiErrorBody,
  ) {
    super(message, 400, "VALIDATION_ERROR", errors, requestId, body);
    this.name = "LomiValidationError";
    Object.setPrototypeOf(this, LomiValidationError.prototype);
  }
}

export class LomiAuthError extends LomiError {
  constructor(
    message: string = "Authentication failed",
    statusCode: number = 401,
    code?: string,
    requestId?: string,
    body?: LomiApiErrorBody,
  ) {
    super(
      message,
      statusCode,
      code ?? "AUTH_ERROR",
      undefined,
      requestId,
      body,
    );
    this.name = "LomiAuthError";
    Object.setPrototypeOf(this, LomiAuthError.prototype);
  }
}

export class LomiNotFoundError extends LomiError {
  constructor(
    message: string = "Resource not found",
    requestId?: string,
    body?: LomiApiErrorBody,
  ) {
    super(message, 404, "NOT_FOUND", undefined, requestId, body);
    this.name = "LomiNotFoundError";
    Object.setPrototypeOf(this, LomiNotFoundError.prototype);
  }
}

export class LomiRateLimitError extends LomiError {
  constructor(
    message: string = "Rate limit exceeded",
    requestId?: string,
    body?: LomiApiErrorBody,
  ) {
    super(message, 429, "RATE_LIMIT_ERROR", undefined, requestId, body);
    this.name = "LomiRateLimitError";
    Object.setPrototypeOf(this, LomiRateLimitError.prototype);
  }
}

/**
 * @deprecated Use {@link LomiError} subclasses — kept for backward compatibility.
 */
export class ApiError extends LomiError {
  public readonly statusText: string;
  public readonly url: string;

  constructor(
    message: string,
    status: number,
    body?: LomiApiErrorBody,
    url = "",
    statusText = "",
    requestId?: string,
  ) {
    const code = body?.error?.code;
    super(message, status, code, body?.error?.details, requestId, body);
    this.name = "ApiError";
    this.statusText = statusText;
    this.url = url;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
