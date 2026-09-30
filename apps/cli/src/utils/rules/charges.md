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

## Card hold (deposit)

`hold: true` blocks the amount without taking it. One capture settles it. A lower capture amount releases the rest. `incrementCardHold` raises the total (the new total, not the increase). `cancelCardCharge` releases the hold.

```typescript
const created = await lomiApi.charges.createCardCharge({
  amount: 100000,
  currency_code: 'XOF',
  hold: true,
  customer_email: 'client@example.com',
  customer_name: 'Awa Ndiaye',
});
const holdId = created.data.id;
// Confirm created.data.client_secret with lomi. Elements, then:
const current = await lomiApi.charges.getCardCharge(holdId);
if (current.data.can_increment) {
  await lomiApi.charges.incrementCardHold(holdId, { amount: 150000 });
}
await lomiApi.charges.captureCardCharge(holdId, { amount: 25000 });
// or await lomiApi.charges.cancelCardCharge(holdId);
```

CLI (sends `Idempotency-Key` on writes):

```bash
lomi charges hold --amount 100000 --currency XOF --email client@example.com --name "Awa Ndiaye" --json
lomi charges get pi_123 --json
lomi charges raise pi_123 --amount 150000 --json
lomi charges capture pi_123 --amount 25000 --json
lomi charges release pi_123 --json
```

`amount` on raise is the new total. Omit `--amount` on capture to take the full hold. Card numbers never go through the API or the CLI.

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
