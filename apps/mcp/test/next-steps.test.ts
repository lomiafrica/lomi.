import { describe, expect, it } from 'vitest';
import { isJsonArray, parseJsonObject } from '@lomi./shared';

import { formatHttpResult, type LomiHttpResult } from '../src/lomi-http.js';
import { nextStepsForHttpResult } from '../src/next-steps.js';

function result(
  partial: Partial<LomiHttpResult> & Pick<LomiHttpResult, 'status' | 'bodyText'>,
): LomiHttpResult {
  return {
    statusText: 'error',
    contentType: 'application/json',
    ...partial,
  };
}

describe('next_steps', () => {
  it('suggests Connect or an API key on 401', () => {
    const steps = nextStepsForHttpResult(
      result({ status: 401, bodyText: '{"error_code":"unauthorized"}' }),
    );
    expect(steps[0]).toMatch(/Connect with lomi/);
  });

  it('routes 503 card charge to hosted checkout', () => {
    const steps = nextStepsForHttpResult(
      result({
        status: 503,
        bodyText: '{"error_code":"service_unavailable"}',
        pathTemplate: '/charge/card',
      }),
    );
    expect(steps[0]).toMatch(/lomi_checkout action=create/);
  });

  it('honors Retry-After on 429', () => {
    const steps = nextStepsForHttpResult(
      result({
        status: 429,
        bodyText: '{}',
        retryAfter: 12,
      }),
    );
    expect(steps[0]).toMatch(/Wait 12 seconds/);
  });

  it('explains missing payment providers', () => {
    const steps = nextStepsForHttpResult(
      result({
        status: 400,
        bodyText: '{"error":{"code":"provider_not_connected","message":"No payment provider"}}',
      }),
    );
    expect(steps[0]).toMatch(/No payment provider/);
  });

  it('asks for an idempotency key', () => {
    const steps = nextStepsForHttpResult(
      result({
        status: 400,
        bodyText: '{"error_code":"idempotency_key_required"}',
      }),
    );
    expect(steps[0]).toMatch(/idempotency_key/);
  });

  it('warns not to fulfill pending mobile money', () => {
    const steps = nextStepsForHttpResult(
      result({
        status: 200,
        statusText: 'OK',
        bodyText: '{"data":{"status":"pending"}}',
        pathTemplate: '/charge/wave',
      }),
    );
    expect(steps[0]).toMatch(/Do not fulfill yet/);
  });

  it('attaches next_steps on formatHttpResult', () => {
    const text = formatHttpResult(
      result({
        status: 401,
        bodyText: '{"error_code":"unauthorized"}',
      }),
    );
    const parsed = parseJsonObject(text);
    const steps = parsed.next_steps;
    expect(isJsonArray(steps) ? steps[0] : undefined).toMatch(
      /Connect with lomi/,
    );
  });
});
