/**
 * Error handler for API calls (legacy axios interop).
 */

import axios from "axios";
import {
  LomiError,
  LomiValidationError,
  LomiAuthError,
  LomiNotFoundError,
  LomiRateLimitError,
  ApiError,
} from "./errors.js";
import { mapResponseToLomiError, parseApiBody } from "./http.js";

export function handleApiError(error: Error | string): never {
  if (error instanceof LomiError) {
    throw error;
  }

  if (error instanceof ApiError) {
    throw error;
  }

  if (axios.isAxiosError(error) && error.response) {
    const { status, data, statusText } = error.response;
    const body = parseApiBody(data ?? null);
    throw mapResponseToLomiError(
      status,
      body,
      error.message,
      error.config?.url ?? "",
      statusText,
    );
  }

  if (axios.isAxiosError(error) && error.request) {
    throw new LomiError(
      "Network error - no response received",
      undefined,
      "NETWORK_ERROR",
    );
  }

  if (error instanceof Error) {
    throw new LomiError(error.message);
  }

  throw new LomiError("An unknown error occurred");
}

// Re-export for instanceof checks in docs
export {
  LomiValidationError,
  LomiAuthError,
  LomiNotFoundError,
  LomiRateLimitError,
};
