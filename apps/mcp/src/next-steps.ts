import {
  isJsonObject,
  isString,
  parseJson,
  readString,
  type JsonObject,
  type JsonValue,
} from '@lomi./shared';
import type { LomiHttpResult } from './lomi-http.js';

function parseBody(result: LomiHttpResult): JsonValue {
  try {
    return parseJson(result.bodyText);
  } catch {
    return result.bodyText;
  }
}

function errorCode(body: JsonValue): string | undefined {
  if (!isJsonObject(body)) return undefined;
  const nested = body.error;
  if (isJsonObject(nested)) {
    return readString(nested, 'code') ?? readString(nested, 'error_code');
  }
  return readString(body, 'error_code') ?? readString(body, 'code');
}

function errorMessage(body: JsonValue): string | undefined {
  if (!isJsonObject(body)) return undefined;
  const nested = body.error;
  if (isJsonObject(nested)) {
    return readString(nested, 'message');
  }
  const message = body.message;
  return isString(message) ? message : undefined;
}

function bodyStatus(body: JsonValue): string | undefined {
  if (!isJsonObject(body)) return undefined;
  const data = isJsonObject(body.data) ? body.data : body;
  return readString(data, 'status') ?? readString(data, 'payment_status');
}

export type NextStepsContext = {
  pathTemplate?: string;
  method?: string;
};

export function nextStepsForHttpResult(
  result: LomiHttpResult,
  context: NextStepsContext = {},
): string[] {
  const body = parseBody(result);
  const code = errorCode(body)?.toLowerCase() ?? '';
  const message = (errorMessage(body) ?? '').toLowerCase();
  const path = (context.pathTemplate ?? '').toLowerCase();
  const steps: string[] = [];

  if (result.status === 401) {
    steps.push(
      'Missing or invalid credentials. Complete Connect with lomi. at the authorization server, or send x-lomi-api-key / x-lomi-provisioning-key. See https://docs.lomi.africa/build/mcp',
    );
  }

  if (
    result.status === 503 &&
    (path.includes('/charge/card') || code === 'service_unavailable')
  ) {
    steps.push(
      'Direct card charge is not available. Create a hosted checkout instead: lomi_checkout action=create, then send the customer checkout_url.',
    );
  }

  if (result.status === 429) {
    const retryAfter = result.retryAfter;
    steps.push(
      retryAfter
        ? `Rate limited. Wait ${retryAfter} seconds (Retry-After), then retry.`
        : 'Rate limited. Wait, then retry. Honor the Retry-After header when present.',
    );
  }

  if (
    code.includes('provider') ||
    message.includes('provider not connected') ||
    message.includes('no payment provider')
  ) {
    steps.push(
      'No payment provider is connected for this organization. Ask the merchant to connect Wave, MTN, SPI, or cards in dashboard Settings, then retry.',
    );
  }

  if (code === 'idempotency_key_required' || message.includes('idempotency')) {
    steps.push(
      'This create moves money. Generate a unique idempotency_key (UUID) and retry the same tool call with that key so a network retry cannot double-charge.',
    );
  }

  const status = bodyStatus(body);
  const pending =
    status === 'pending' ||
    status === 'processing' ||
    status === 'requires_action';
  const momoPath =
    path.includes('/charge/wave') ||
    path.includes('/charge/mtn') ||
    path.includes('wave') ||
    path.includes('mtn');
  if (pending && (momoPath || result.status < 300)) {
    steps.push(
      'Do not fulfill yet. Mobile money is asynchronous. Wait for the webhook, then confirm with lomi_transactions action=get before fulfilling.',
    );
  }

  return [...new Set(steps)];
}

export function attachNextSteps(
  envelope: JsonObject,
  result: LomiHttpResult,
  context?: NextStepsContext,
): JsonObject {
  const nextSteps = nextStepsForHttpResult(result, context);
  if (nextSteps.length > 0) {
    envelope.next_steps = nextSteps;
  }
  return envelope;
}
