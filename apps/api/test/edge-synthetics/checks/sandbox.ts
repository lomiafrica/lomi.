import type { CheckDefinition } from '../types';

const FAKE_SESSION_ID = '00000000-0000-0000-0000-000000000001';
const FAKE_ORG_ID = '00000000-0000-0000-0000-000000000002';
const FAKE_REFERENCE_ID = '00000000-0000-0000-0000-000000000099';

function errorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return '';
  const record = data as Record<string, unknown>;
  if (typeof record.error === 'string') return record.error;
  return '';
}

/** Tier A: reject-path checks only — no successful writes or side effects. */
export function createSandboxRejectChecks(): CheckDefinition[] {
  return [
    {
      name: 'create-stripe-payment-intent CORS preflight',
      service: 'stripe-checkout',
      functionName: 'create-stripe-payment-intent',
      method: 'OPTIONS',
      auth: false,
      expectStatus: 200,
    },
    {
      name: 'create-stripe-payment-intent rejects missing checkout session',
      service: 'stripe-checkout',
      functionName: 'create-stripe-payment-intent',
      method: 'POST',
      body: () => ({
        organization_id: FAKE_ORG_ID,
        amount: 1000,
        currency: 'xof',
        environment: 'test',
      }),
      expectStatus: [400, 403],
      validate: (_ctx, res) => {
        const message = errorMessage(res.data).toLowerCase();
        if (!message.includes('checkout')) {
          return `Expected checkout session binding error, got: "${message || JSON.stringify(res.data)}"`;
        }
        return null;
      },
    },
    {
      name: 'create-stripe-payment-intent rejects unknown checkout session',
      service: 'stripe-checkout',
      functionName: 'create-stripe-payment-intent',
      method: 'POST',
      body: () => ({
        organization_id: FAKE_ORG_ID,
        amount: 1000,
        currency: 'xof',
        checkoutSessionId: FAKE_SESSION_ID,
        environment: 'test',
      }),
      expectStatus: [400, 403],
      validate: (_ctx, res) => {
        const message = errorMessage(res.data).toLowerCase();
        if (
          !message.includes('invalid') &&
          !message.includes('checkout') &&
          !message.includes('session')
        ) {
          return `Expected invalid checkout session rejection, got: "${message || JSON.stringify(res.data)}"`;
        }
        return null;
      },
    },
    {
      name: 'mtn CORS preflight',
      service: 'mtn',
      functionName: 'mtn',
      method: 'OPTIONS',
      auth: false,
      expectStatus: 200,
    },
    {
      name: 'mtn rejects missing authorization',
      service: 'mtn',
      functionName: 'mtn',
      method: 'POST',
      auth: false,
      body: () => ({
        path: '/refund',
        method: 'POST',
        body: { transactionId: FAKE_SESSION_ID },
      }),
      expectStatus: 401,
    },
    {
      name: 'mtn rejects anon bearer without user session',
      service: 'mtn',
      functionName: 'mtn',
      method: 'POST',
      body: () => ({
        path: '/collection/v1_0/requesttopay',
        method: 'POST',
        body: { amount: '1000', currency: 'XOF' },
      }),
      expectStatus: 401,
    },
    {
      name: 'mtn-sync rejects missing referenceId',
      service: 'mtn-sync',
      functionName: 'mtn-sync',
      method: 'POST',
      body: () => ({}),
      expectStatus: 400,
    },
    {
      name: 'mtn-sync rejects unknown reference (read-only lookup)',
      service: 'mtn-sync',
      functionName: 'mtn-sync',
      method: 'POST',
      body: () => ({
        referenceId: FAKE_REFERENCE_ID,
        transactionId: FAKE_SESSION_ID,
        checkoutSessionId: FAKE_SESSION_ID,
      }),
      expectStatus: [403, 404],
      validate: (_ctx, res) => {
        const message = errorMessage(res.data).toLowerCase();
        if (
          res.status === 404 &&
          !message.includes('reference') &&
          !message.includes('mtn')
        ) {
          return `Expected unknown-reference rejection, got: "${message}"`;
        }
        if (res.status === 403 && !message.includes('sync')) {
          return `Expected invalid sync context, got: "${message}"`;
        }
        return null;
      },
    },
    {
      name: 'expire-pending-transactions rejects without internal auth',
      service: 'expire-pending',
      functionName: 'expire-pending-transactions',
      method: 'POST',
      body: () => ({ expiry_hours: 4 }),
      expectStatus: 401,
    },
    {
      name: 'send-transaction-email rejects without trusted caller',
      service: 'send-transaction-email',
      functionName: 'send-transaction-email',
      method: 'POST',
      body: () => ({
        type: 'payment_success',
        data: {
          merchantEmail: 'synthetics@lomi.test',
          customerEmail: 'synthetics@lomi.test',
        },
      }),
      expectStatus: [401, 403],
    },
    {
      name: 'send-transaction-email rejects partial internal header',
      service: 'send-transaction-email',
      functionName: 'send-transaction-email',
      method: 'POST',
      headers: () => ({ 'X-Internal-Call': 'true' }),
      body: () => ({
        type: 'payment_success',
        data: { merchantEmail: 'synthetics@lomi.test' },
      }),
      expectStatus: 401,
    },
  ];
}
