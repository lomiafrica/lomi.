# Integration checklist for agents (Rex / product)

Goal: decide multi-merchant readiness of KOMPTO API for lomi. hosted payments.

## Must answer from docs + sandbox

1. Auth model: one platform key vs per-merchant keys; how establishment / point-of-sale map to lomi. merchants.
2. Idempotency and retries on `verify` / `confirm` / `create`.
3. Error catalog: which failures are safe to retry; what surfaces to merchants.
4. Webhooks or polling for async DGI confirm delays.
5. Credit-note flow for refunds / chargebacks already handled in lomi.
6. Rate limits and bulk / end-of-day aggregation if sticker cost makes per-txn FNE expensive (Alberto’s note).
7. Data residency / retention of invoice payloads and certificates.
8. Commercial: pricing per invoice or merchant, SLA, exit rights (business, not only tech).

## Suggested first engineering spike

- Call `verify` then `getVerify` with one B2B and one B2C fixture.
- Confirm `create` vs verify→confirm behaviour.
- Fetch `getElectronicInvoice` and store certificate reference without committing secrets.

## Out of scope for this PR

Implementing production FNE issuance. This folder is analysis input only.
