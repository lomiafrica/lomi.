import { newIdempotencyKey } from '../client';
import { validateMerchantFacingError } from '../assert';
import type { CheckDefinition } from '../types';

const FAKE_SESSION_ID = '00000000-0000-0000-0000-000000000001';

/** Security-focused sandbox checks (reject paths, no PAN/CVV in errors). */
export function createSecuritySandboxChecks(): CheckDefinition[] {
  return [
    {
      name: 'security: unauthenticated /me rejected',
      service: 'security',
      method: 'GET',
      path: '/me',
      auth: false,
      expectStatus: 401,
    },
    {
      name: 'security: internal jobs without cron secret rejected',
      service: 'security',
      method: 'POST',
      path: '/internal/jobs/expire-pending',
      auth: false,
      expectStatus: [401, 403, 404],
    },
    {
      name: 'security: gim checkout pay rejects unknown session',
      service: 'security',
      method: 'POST',
      path: '/checkout/v1/gim/pay',
      auth: false,
      body: () => ({
        checkoutSessionId: FAKE_SESSION_ID,
        pan: '4221941234569109',
        expiry: '06/30',
        cvv: '123',
      }),
      expectStatus: [400, 404, 422],
      validate: (_ctx, res) => {
        const serialized = JSON.stringify(res.data ?? '');
        if (/\b4221941234569109\b/.test(serialized)) {
          return 'Response must not echo submitted PAN';
        }
        if (/\b123\b/.test(serialized) && serialized.includes('cvv')) {
          return 'Response must not echo submitted CVV';
        }
        if (res.status >= 500) {
          return 'GIM reject path must not return 5xx for unknown session';
        }
        if (res.data && typeof res.data === 'object') {
          return validateMerchantFacingError(res.data) ?? null;
        }
        return null;
      },
    },
    {
      name: 'security: switch charge without API key rejected before body handling',
      service: 'security',
      method: 'POST',
      path: '/charge/switch',
      auth: false,
      headers: () => ({ 'Idempotency-Key': newIdempotencyKey() }),
      body: () => ({
        amount: 1000,
        currency_code: 'XOF',
        pan: '4221941234569109',
        expiry: '06/30',
        cvv: '123',
      }),
      expectStatus: [401, 403, 503],
      validate: (_ctx, res) => {
        const serialized = JSON.stringify(res.data ?? '');
        if (/\b4221941234569109\b/.test(serialized)) {
          return 'Response must not echo submitted PAN';
        }
        return null;
      },
    },
    {
      name: 'security: oauth introspect without client auth rejected',
      service: 'security',
      method: 'POST',
      path: '/oauth/introspect',
      auth: false,
      body: () => ({ token: 'lomi_oat_invalid' }),
      expectStatus: [400, 401, 403],
    },
  ];
}
