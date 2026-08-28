/**
 * HTTP request layer — maps API errors to LomiError subclasses.
 */

import axios, { type AxiosRequestConfig } from 'axios';
import type { LomiClient } from './client.js';
import type { LomiClientRequestOptions } from './request-options.js';
import {
  isJsonObject,
  isString,
  readString,
  type JsonValue,
} from "@lomi./shared";
import {
  ApiError,
  LomiAuthError,
  LomiError,
  LomiNotFoundError,
  LomiRateLimitError,
  LomiValidationError,
  type LomiApiErrorBody,
} from './errors.js';

export type { LomiRequestOptions } from './request-options.js';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseApiBody(data: JsonValue): LomiApiErrorBody {
  if (!isJsonObject(data)) return {};
  const errorValue = data['error'];
  const error = errorValue !== undefined && isJsonObject(errorValue)
    ? {
        code: readString(errorValue, 'code'),
        message: readString(errorValue, 'message'),
        details: errorValue['details'],
      }
    : undefined;
  const messageValue = data['message'];
  const message = isString(messageValue)
    ? messageValue
    : Array.isArray(messageValue)
      ? messageValue.filter(isString)
      : undefined;
  return {
    error,
    request_id: readString(data, 'request_id'),
    message,
  };
}

function messageFromBody(body: LomiApiErrorBody, fallback: string): string {
  if (body.error?.message) return body.error.message;
  if (isString(body.message)) return body.message;
  if (Array.isArray(body.message)) return body.message.join(', ');
  return fallback;
}

export function mapResponseToLomiError(
  status: number,
  body: LomiApiErrorBody,
  fallbackMessage: string,
  url = '',
  statusText = '',
): LomiError {
  const message = messageFromBody(body, fallbackMessage);
  const requestId = body.request_id;
  const code = body.error?.code;

  switch (status) {
    case 400:
      return new LomiValidationError(message, body.error?.details, requestId, body);
    case 401:
    case 403:
      return new LomiAuthError(message, status, code, requestId, body);
    case 404:
      return new LomiNotFoundError(message, requestId, body);
    case 429:
      return new LomiRateLimitError(message, requestId, body);
    default:
      return new ApiError(message, status, body, url, statusText, requestId);
  }
}

export async function requestWithClient<T>(
  client: LomiClient,
  options: LomiClientRequestOptions,
): Promise<T> {
  const url = client.buildUrl(options.url, options.path);
  const headers = client.buildHeaders(options);
  const maxAttempts = 1 + (options.method === 'GET' ? client.retries : 0);

  let lastError = new LomiError('Request failed');

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const config: AxiosRequestConfig = {
      method: options.method,
      url,
      headers,
      params: options.query,
      data: options.body,
      timeout: client.timeout,
      signal: options.signal,
      validateStatus: () => true,
    };

    try {
      const response = await axios(config);
      if (response.status >= 200 && response.status < 300) {
        // SAFETY: Generated service methods bind T to the endpoint response schema.
        return response.data as T;
      }

      const body = parseApiBody(response.data);
      const err = mapResponseToLomiError(
        response.status,
        body,
        `Request failed with status ${response.status}`,
        url,
        response.statusText,
      );

      if (response.status === 429 && attempt < maxAttempts - 1) {
        await sleep(2 ** attempt * 500);
        continue;
      }

      throw err;
    } catch (error) {
      if (error instanceof LomiError) {
        throw error;
      }
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const body = parseApiBody(error.response.data);
          throw mapResponseToLomiError(
            error.response.status,
            body,
            error.message,
            url,
            error.response.statusText,
          );
        }
        if (error.code === 'ERR_CANCELED') {
          throw new LomiError('Request aborted', undefined, 'ABORTED');
        }
        lastError = new LomiError(
          'Network error — no response received',
          undefined,
          'NETWORK_ERROR',
        );
        if (attempt < maxAttempts - 1) {
          await sleep(2 ** attempt * 500);
          continue;
        }
        throw lastError;
      }
      throw error;
    }
  }

  throw lastError;
}
