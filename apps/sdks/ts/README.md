# lomi. TypeScript SDK

Official JavaScript SDK for the lomi. REST API (`@lomi./sdk`). Works in Node 18+, Bun, and modern browsers **when you only embed publishable keys** (Payment Elements flows). Merchant secret keys belong on servers.

## Installation

```bash
pnpm add @lomi./sdk
# npm install @lomi./sdk / yarn add @lomi./sdk
```

## Quick start

```typescript
import { LomiSDK } from '@lomi./sdk';

const lomi = new LomiSDK({
  apiKey: process.env.LOMI_SECRET_KEY!,
  environment: 'test',
});

async function bootstrap() {
  const page = await lomi.customers.list({ page: 1, pageSize: 20 });
  console.log('- Customers page payload:', page);

  await lomi.payouts.create({
    destination: 'beneficiary',
    rail: 'wave',
    amount: 10000,
    currency: 'XOF',
    beneficiary: { name: 'Test User', phoneNumber: '+221771234567' },
  });

  console.log(await lomi.refunds.create({
    transactionId: '123e4567-e89b-12d3-a456-426614174000',
    amount: 1000,
    reason: 'duplicate_charge',
  }));
}

bootstrap().catch(console.error);
```

All methods map 1:1 to the curated public merchant OpenAPI routes (see docs `openapi.json` + `sdk-public-methods.json` inside `src/generated` after running codegen).

Docs: **[https://docs.lomi.africa](https://docs.lomi.africa)** • Type guide: **[`/build/sdks/typescript`](https://docs.lomi.africa/build/sdks/typescript)**

## lomi. Network (operators)

Charge on behalf of Member Accounts (`acct_…`) and move funds with transfers. Hand-written resources live in `src/resources/`.

```typescript
// Direct charges: Lomi-Account on every request (or per call with { account })
const asMember = new LomiSDK({ apiKey, account: 'acct_123' });
await asMember.checkoutSessions.create({ ...body, application_fee_amount: 500 });
await lomi.checkoutSessions.create(body, { account: 'acct_123' });

// Destination charge: operator charge, funds minus fee go to the member
await lomi.checkoutSessions.create({
  ...body,
  application_fee_amount: 500,
  transfer_data: { destination: 'acct_123' },
});

// Transfers are two-step: preview, then confirm with the token (same Idempotency-Key)
const preview = await lomi.transfers.create(
  { amount: 5000, currency_code: 'XOF', destination: 'acct_123', transfer_group: 'order_42' },
  { idempotencyKey: 'order_42_payout' },
);
// preview.requires_confirmation === true → re-send with preview.confirmation_token,
// or let the SDK do both calls:
const transfer = await lomi.transfers.createConfirmed(
  { amount: 5000, currency_code: 'XOF', destination: 'acct_123' },
  { idempotencyKey: 'order_42_payout' },
);
await lomi.transfers.list({ transfer_group: 'order_42' });
await lomi.transfers.get(transfer.id);
await lomi.transfers.reverseConfirmed(transfer.id, { amount: 1000 });

// Member helpers (operator key, no Lomi-Account)
const { url } = await lomi.network.accounts.createLoginLink('acct_123');
const session = await lomi.network.accountSessions.create({
  account: 'acct_123',
  components: { onboarding: { enabled: true }, payments: { enabled: true } },
});
// Member balance
await lomi.accounts.getBalance(undefined, { account: 'acct_123' });
```

## Generation

Codegen lives under `apps/sdks/scripts/generate-types-sdk.js`. Run `node scripts/typescript-generate.js` from `apps/sdks` whenever `apps/docs/openapi.json` or `apps/docs/lib/scripts/manual-api/_expected-public-operations.json` changes.

## Contributing & support

- Monorepo `CONTRIBUTING.md`
- **[hello@lomi.africa](mailto:hello@lomi.africa)**

## License

MIT
