# lomi. SDK Basics

Use the official TypeScript SDK `@lomi./sdk` to integrate lomi. payments.

## Authentication

- **Production API**: `https://api.lomi.africa`
- **Sandbox API**: `https://sandbox.api.lomi.africa`
- **Secret keys**: `lomi_sk_live_…` (production) or `lomi_sk_test_…` (sandbox)
- **Publishable keys**: `lomi_pk_live_…` or `lomi_pk_test_…`

Environment is determined by your **API key**, not the hostname.

## Client setup

```typescript
import { LomiSDK } from '@lomi./sdk';
import 'dotenv/config';

export const lomi = new LomiSDK({
  apiKey: process.env.LOMI_SECRET_KEY!,
  environment: process.env.LOMI_SECRET_KEY?.includes('_test_') ? 'test' : 'live',
});
```

## Environment variables

| Variable | Description |
| --- | --- |
| `LOMI_SECRET_KEY` | Secret API key from the dashboard |
| `LOMI_WEBHOOK_SECRET` | Webhook signing secret (`whsec_…`) |
| `LOMI_API_URL` | Optional API base URL override (use `baseUrl` on `LomiSDK` instead) |

## Currencies

Supported: **XOF**, **USD**, **EUR**. An amount is the money in that currency. `10000` is 10,000 XOF, 10,000 USD, and 10,000 EUR. USD and EUR may use two decimal places, such as `11.99`. XOF is a whole number. Do not convert to cents.

## Docs

Full documentation: https://docs.lomi.africa
