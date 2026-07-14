import type { CheckDefinition } from '../types';

/** Tier B: single live reachability probe — no writes. */
export function createLiveChecks(): CheckDefinition[] {
  return [
    {
      name: 'live create-stripe-payment-intent CORS preflight',
      service: 'stripe-checkout',
      functionName: 'create-stripe-payment-intent',
      method: 'OPTIONS',
      auth: false,
      expectStatus: 200,
      validate: (_ctx, res) => {
        const allowOrigin = res.headers['access-control-allow-origin'];
        if (!allowOrigin) {
          return 'Expected Access-Control-Allow-Origin on live edge CORS response';
        }
        return null;
      },
    },
  ];
}
