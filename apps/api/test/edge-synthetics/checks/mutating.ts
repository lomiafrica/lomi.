import { randomUUID } from 'node:crypto';
import { ApiClient } from '../../synthetics/client';
import { pickString, unwrapData } from '../../synthetics/assert';
import { EdgeFunctionsClient } from '../client';
import type { SuiteContext } from '../types';

function resolveSandboxApiUrl(): string {
  const override = process.env.SANDBOX_API_URL?.trim();
  if (override) return override.replace(/\/$/, '');
  return 'https://sandbox.api.lomi.africa';
}

/**
 * Tier C (opt-in): create one sandbox checkout session via merchant API, then
 * invoke create-stripe-payment-intent with valid session binding.
 */
export async function runMutatingChecks(
  supabaseUrl: string,
  anonKey: string,
  ctx: SuiteContext,
): Promise<{
  name: string;
  status: 'pass' | 'fail' | 'skip';
  httpStatus?: number;
  latencyMs?: number;
  skipReason?: string;
  message?: string;
}> {
  const testKey = process.env.LOMI_TEST_KEY?.trim();
  if (!testKey) {
    return {
      name: 'mutating stripe payment intent bound to checkout session',
      status: 'skip',
      skipReason: 'LOMI_TEST_KEY required for EDGE_SYNTHETICS_MUTATING=1',
    };
  }

  const api = new ApiClient({
    baseUrl: resolveSandboxApiUrl(),
    apiKey: testKey,
  });
  const edge = new EdgeFunctionsClient({ supabaseUrl, anonKey });

  const createRes = await api.request('POST', '/checkout-sessions', {
    body: {
      currency_code: 'XOF',
      amount: 1000,
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      title: 'Edge synthetics checkout',
      metadata: { source: 'edge_synthetics', run_id: ctx.runId },
    },
    headers: { 'Idempotency-Key': randomUUID() },
  });

  if (createRes.status !== 200 && createRes.status !== 201) {
    return {
      name: 'mutating stripe payment intent bound to checkout session',
      status: 'fail',
      httpStatus: createRes.status,
      message: `Failed to create checkout session: ${JSON.stringify(createRes.data).slice(0, 200)}`,
    };
  }

  const checkoutSessionId =
    pickString(createRes.data, 'checkout_session_id', 'id') ?? '';
  if (!checkoutSessionId) {
    return {
      name: 'mutating stripe payment intent bound to checkout session',
      status: 'fail',
      message: 'checkout_session_id missing from API create response',
    };
  }

  ctx.checkoutSessionId = checkoutSessionId;

  const getRes = await api.request(
    'GET',
    `/checkout-sessions/${checkoutSessionId}`,
  );
  if (getRes.status !== 200) {
    return {
      name: 'mutating stripe payment intent bound to checkout session',
      status: 'fail',
      httpStatus: getRes.status,
      message: `Failed to fetch checkout session: ${JSON.stringify(getRes.data).slice(0, 200)}`,
    };
  }

  const session = unwrapData(getRes.data) as Record<string, unknown>;
  const organizationId = pickString(getRes.data, 'organization_id') ??
    (typeof session.organization_id === 'string'
      ? session.organization_id
      : undefined);
  const merchantId = pickString(getRes.data, 'merchant_id') ??
    (typeof session.merchant_id === 'string' ? session.merchant_id : undefined);
  const currency = pickString(getRes.data, 'currency_code') ?? 'XOF';

  if (!organizationId) {
    return {
      name: 'mutating stripe payment intent bound to checkout session',
      status: 'fail',
      message: 'organization_id missing from checkout session',
    };
  }

  ctx.organizationId = organizationId;
  ctx.merchantId = merchantId;

  const started = Date.now();
  const piRes = await edge.invoke(
    'create-stripe-payment-intent',
    'POST',
    {
      body: {
        organization_id: organizationId,
        merchant_id: merchantId,
        amount: 1000,
        currency,
        checkoutSessionId,
        customer_email: `synthetics+${ctx.runId}@lomi.test`,
        customer_name: 'Edge Synthetics',
        environment: 'test',
      },
    },
  );
  const latencyMs = Date.now() - started;

  if (piRes.status === 403 || piRes.status === 400) {
    const err =
      piRes.data && typeof piRes.data === 'object'
        ? (piRes.data as Record<string, unknown>).error
        : piRes.data;
    return {
      name: 'mutating stripe payment intent bound to checkout session',
      status: 'fail',
      httpStatus: piRes.status,
      latencyMs,
      message: `Session binding rejected unexpectedly: ${String(err)}`,
    };
  }

  if (piRes.status >= 500) {
    return {
      name: 'mutating stripe payment intent bound to checkout session',
      status: 'fail',
      httpStatus: piRes.status,
      latencyMs,
      message: `Edge function server error: ${JSON.stringify(piRes.data).slice(0, 200)}`,
    };
  }

  const data = piRes.data as Record<string, unknown> | null;
  const clientSecret =
    typeof data?.clientSecret === 'string' ? data.clientSecret : undefined;
  const paymentIntentId = typeof data?.id === 'string' ? data.id : undefined;
  const successFlag = data?.success;

  if (clientSecret || paymentIntentId || successFlag === true) {
    return {
      name: 'mutating stripe payment intent bound to checkout session',
      status: 'pass',
      httpStatus: piRes.status,
      latencyMs,
    };
  }

  if (successFlag === false && typeof data?.error === 'string') {
    const code = typeof data.code === 'string' ? data.code : '';
    const allowedStripeCodes = new Set([
      'amount_too_small',
      'card_declined',
      'authentication_required',
    ]);
    if (allowedStripeCodes.has(code)) {
      return {
        name: 'mutating stripe payment intent bound to checkout session',
        status: 'pass',
        httpStatus: piRes.status,
        latencyMs,
        message: `Binding OK; Stripe returned controlled error: ${code}`,
      };
    }
  }

  return {
    name: 'mutating stripe payment intent bound to checkout session',
    status: 'fail',
    httpStatus: piRes.status,
    latencyMs,
    message: `Unexpected payment intent response: ${JSON.stringify(piRes.data).slice(0, 240)}`,
  };
}
