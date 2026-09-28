# lomi. Charges

Charges represent a single payment collection attempt (Wave, MTN, or embedded card).

## Embedded card charge

Server-side (secret key):

```typescript
import { lomiApi } from './lib/lomi/client';

const charge = await lomiApi.charges.createCardCharge({
  amount: 5000,
  currency_code: 'XOF',
  // customer, metadata, return_url, etc.
});
// Pass charge.client_secret to lomi. Elements on the client with your publishable key.
```

Client-side: confirm with `loadLomi('lomi_pk_test_…')` or `loadLomi('lomi_pk_live_…')`. Poll `GET /charge/card/{id}` or listen for webhooks.

## Mobile money (Wave / MTN)

```typescript
const wave = await lomiApi.charges.createWaveCharge({
  amount: 5000,
  currency_code: 'XOF',
  phone_number: '+221XXXXXXXX',
});
```

Use sandbox test numbers from https://docs.lomi.africa/start/sandbox-payments

## Confirming payment

Poll charge status or handle `payment.succeeded` (and related) webhooks. Never trust client-side confirmation alone, always verify server-side.
