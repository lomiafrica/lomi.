# lomi. Webhooks

Handle lomi. webhook events securely in your application.

## Signature verification

lomi. signs webhooks with HMAC-SHA256. Prefer `X-Lomi-Signature-V1` (`t=<unix>,v1=<hex>` over `timestamp.body`). Legacy `X-Lomi-Signature` is HMAC over the raw JSON body only. Event type is in `X-Lomi-Event`.

```typescript
import crypto from 'node:crypto';

function verifyLomiWebhook(rawBody: string, signatureV1: string, secret: string) {
  const parts = Object.fromEntries(
    signatureV1.split(',').map((part) => {
      const [k, v] = part.trim().split('=');
      return [k, v];
    }),
  );
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${parts.t}.${rawBody}`)
    .digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(parts.v1, 'hex'), Buffer.from(expected, 'hex'))) {
    throw new Error('Invalid signature');
  }
  return JSON.parse(rawBody);
}
```

## Common event types

- `PAYMENT_SUCCEEDED`
- `PAYMENT_FAILED`
- `REFUND_CREATED`
- `SUBSCRIPTION_CREATED` / `SUBSCRIPTION_UPDATED` / `SUBSCRIPTION_CANCELLED`

## Local development

**Recommended:** `lomi listen http://localhost:3000/webhooks`: receives real sandbox webhooks via cloud relay (no ngrok).

**Alternative:** `lomi dev`: local HTTP receiver on port 4242.

## Environment variable

Set `LOMI_WEBHOOK_SECRET=whsec_…` from `lomi listen` (connected event) or your dashboard webhook settings.
