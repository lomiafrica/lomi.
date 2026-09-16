# Côte d'Ivoire FNE + KOMPTO (implementation)

Internal design for certifying lomi. invoices through KOMPTO's FNE API. This is **not** legal, tax, or DGI advice. Production enablement is off until finance and the accounting firm confirm how commissions are treated.

Related: [`docs/fne-kompto-brief.md`](./fne-kompto-brief.md) (checked-in partner brief), [`docs/sql/fne-kompto.proposed.sql`](./sql/fne-kompto.proposed.sql) (proposed persistence, not applied), `@lomi./shared/fne` (config, types, mockable HTTP, dry-run aggregation).

## Status of this PR

| Item                           | State                                                                                                                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Partner brief in git           | Yes, redacted. No API keys.                                                                                                                                                              |
| KOMPTO PDF integration guide   | **Not in the repo.** HubSpot attachment IDs 464548911294 and 464548911295 were not downloadable in this run (Gmail MCP needed auth; HubSpot MCP returned the email body, not the files). |
| Live KOMPTO HTTP in `apps/api` | Not wired. Private `apps/api` / `apps/dashboard` submodules were empty in this checkout.                                                                                                 |
| Safe scaffold                  | Yes: `@lomi./shared` domain types, env config, mockable client, idempotent certify planner, dry-run commission batch.                                                                    |
| Feature flag                   | Constant `fne_kompto_enabled`. Default **off**.                                                                                                                                          |
| Accountant confirmation        | Open. Do not set `FNE_KOMPTO_ENABLED=true` in production.                                                                                                                                |

Scaffold is implemented from the 2026-09-02 email, the public KOMPTO API page, and existing lomi. invoice / fee patterns. It does **not** invent DGI statute, tax rates, or sticker prices beyond Martino's note that a sticker cost exists (from about 20 FCFA).

## Product intent

Two certification tracks, both behind the same flag:

1. **Merchant invoices** (`customer_invoices` in Postgres, Nest `InvoicesController`, dashboard invoicing sheet). A merchant in Côte d'Ivoire can request FNE certification for an invoice they issue to their customer.
2. **Platform commissions** (lomi. fees collected from merchants). If finance confirms FNE applies, emit **one aggregated FNE per merchant per period**, not one sticker per payment.

KOMPTO is a DGI-agréé FNE editor. lomi. would call KOMPTO rather than integrating the DGI portal directly. That is KOMPTO's product claim ([API page](https://kompto.com/KomptoApi)); it is not a lomi. legal opinion.

## Partner facts

- KOMPTO / PROGICI SARL: `progici@kompto.com`, `martino@kompto.com`, +225 07 05 797 658, [kompto.com](https://www.kompto.com)
- HubSpot deal: **KOMPTO — FNE API**, stage qualified-to-buy as of 2026-09-11
- Teams call planned 31 Aug 2026 16h30, then Wednesday 14h30 after a missed hop
- Test API key was sent in the 2026-09-02 email. Store it in secrets / env only. **Never paste it into git, docs, tests, or PR text.**

## FNE obligation (partner view only)

Alberto Martino (KOMPTO), 2026-09-02, personal non-binding analysis:

1. Strict **banking status** can be exempt. Outside that, lomi. is likely subject to FNE on **commissions**.
2. Confirm with lomi.'s accounting firm how this has been treated so far.
3. Prefer an **aggregated** FNE (monthly or semi-annual) listing commission transactions for a client in the period, because each sticker has a cost (from about 20 FCFA). Confirm with accountant / DGI.
4. KOMPTO can help ask DGI for a written position if needed.

He said this is a personal appreciation, not tax advice. Official DGI materials live at [fne.dgi.gouv.ci](https://www.fne.dgi.gouv.ci/). Do not copy KOMPTO marketing pages ("obligatory for every firm without exception") into product copy or legal conclusions.

**Open questions for finance / accountant** are at the bottom of this document. Until they are answered, admin aggregation `commit` stays blocked in code.

## Existing lomi. surfaces (explored)

No FNE / KOMPTO / DGI code existed in the public tree before this PR.

| Surface                | Path                                                                                                        | Relevance                                                                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Merchant invoices (DB) | `packages/shared/src/database.ts` → `customer_invoices`                                                     | Status `draft \| sent \| paid \| overdue \| cancelled`. `metadata` JSON is the least-invasive place to stash FNE state before a dedicated table exists.     |
| Invoice RPCs           | `packages/queries/src/invoicing.ts`                                                                         | `create_invoice_receivable`, `list_customer_invoices_api`, `log_invoice_event`, …                                                                           |
| Public API             | `apps/api/src/core/invoices/invoices.controller.ts` (private)                                               | Nest routes: create, list, get, pdf, finalize, send, remind, void. No certify route yet.                                                                    |
| Dashboard UI           | `apps/dashboard/src/components/dashboard/invoicing/` (private)                                              | Sheet + editor + PDF. Feature flags live in `src/lib/constants/feature-flags.ts` (`VITE_INVOICING_ENABLED`). Invoicing itself is Coming Soon in production. |
| Platform fees          | `get_merchant_platform_fees`, `packages/shared/src/processing-fee.ts`, `packages/queries/src/admin/fees.ts` | Commission ledger source for aggregated FNE.                                                                                                                |
| Invoice PDF            | `packages/receipt-pdf`, dashboard `invoice-pdf-document.tsx`                                                | Later: render DGI QR / FNE visuel / normalized number **only after** KOMPTO returns them. Do not invent a fake cachet.                                      |
| Côte d'Ivoire helpers  | `packages/shared/src/country.ts` `isCoteDIvoire`                                                            | Gate merchant certify on org country when wiring UI.                                                                                                        |

New HTTP jobs belong in Nest (`apps/api`) + BullMQ, not Edge Functions. Persistence belongs in dashboard migrations, then `pnpm types:generate`. This PR does not apply SQL.

## KOMPTO API (public structure)

Source: [kompto.com/KomptoApi](https://kompto.com/KomptoApi), retrieved 2026-09-16. The PDF guide was **not** available; field-level errors, establishment / point-of-sale ids, and exact GET query names are TBD from that PDF.

- Base URL: `https://app.kompto.com` (override with `KOMPTO_BASE_URL`)
- Auth: `Authorization: Bearer {KOMPTO_API_KEY}`
- JSON over HTTPS. Field names in English. Do **not** send calculated HT / TVA / TTC; KOMPTO computes amounts.

| Method | Path                                | Role                                                                                               |
| ------ | ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| POST   | `/api/invoice/verify`               | Validate and compute amounts. **No DGI submission.** Prefer this for dry-run and unusual invoices. |
| GET    | `/api/invoice/getVerify`            | Re-read a verified invoice not yet submitted                                                       |
| POST   | `/api/invoice/confirm`              | Submit to DGI. Irreversible legal document.                                                        |
| GET    | `/api/invoice/getElectronicInvoice` | Fetch certified FNE, fiscal number, certificate                                                    |
| DELETE | `/api/invoice/delete`               | Drop a pending invoice **before** confirm                                                          |
| POST   | `/api/invoice/create`               | Verify + confirm in one call. Use only after verify/confirm is proven.                             |
| POST   | `/api/invoice/createCreditNote`     | Avoir on a confirmed invoice (itself a declared FNE)                                               |

Public curl example (secrets stripped):

```bash
curl -X POST "$KOMPTO_BASE_URL/api/invoice/verify" \
  -H "Content-Type: application/json; charset=utf-8" \
  -H "Authorization: Bearer $KOMPTO_API_KEY" \
  -d '{
        "clientType": "B2B",
        "clientName": "KOUAME ET FRERES SARL",
        "clientNCC": "8200001A",
        "clientTelephone": "2721212121",
        "clientEmail": "contact@example.com",
        "paymentMethod": "transfer",
        "items": [
          {
            "itemName": "Prestation de conseil",
            "itemQuantity": 2,
            "itemUnitPrice": 50000,
            "itemTVAName": "TVA"
          }
        ]
      }'
```

Public page also states:

- Client types: `B2B` (NCC required), `B2C`, `B2G`, `B2F`
- TVA **field names** KOMPTO lists: `TVA` (described as 18%), `TVAB` (described as 9%), `TVAC` / `TVAD` / `TVAE` (described as 0% cases). **lomi. must not compute those rates.** Pass the code the accountant chooses; KOMPTO calculates money.
- Payment modes described in French: espèces, carte, chèque, mobile money (Wave, Orange Money, MTN Money), virement, paiement différé. The only **confirmed enum string** in the public curl is `"transfer"`. Do not invent `wave` / `cash` strings until the PDF lists them.
- Production vs test: same paths; change base URL, API key, and establishment / point-of-sale identifiers. Those identifiers are **not** on the public page.
- Confirmed FNE is irreversible; corrections are credit notes.

### Error cases (known without the PDF)

The public page promises an error index in the private guide. Until that PDF is in-repo:

- Treat non-2xx as failure. Persist `last_error` from JSON `message` / `code` when present, else HTTP status text.
- Never retry `confirm` after a success that stored `kompto_invoice_id` or `dgi_identifier`.
- On verify failure, leave status `failed` and allow retry of **verify** only.
- On confirm transport failure with no DGI id, call `getElectronicInvoice` / `getVerify` before sending confirm again (idempotency).
- Do not call `delete` after confirm.

### Certified invoice display (KOMPTO / DGI public pages)

KOMPTO's blog states a customized invoice is valid when it shows the unique certification number, official FNE visuel, and DGI QR, and when HT / TVA / TTC and party identity match DGI. Follow-up PDF rendering should **copy KOMPTO's returned payload**, not generate a decorative QR.

## Config and secrets

| Name                      | Where             | Default                                                  |
| ------------------------- | ----------------- | -------------------------------------------------------- |
| `KOMPTO_API_KEY`          | API secrets       | unset. Required only when the flag is on.                |
| `KOMPTO_BASE_URL`         | API env           | `https://app.kompto.com`                                 |
| `FNE_KOMPTO_ENABLED`      | API env           | unset / false                                            |
| `VITE_FNE_KOMPTO_ENABLED` | dashboard env     | unset / false (same pattern as `VITE_INVOICING_ENABLED`) |
| `fne_kompto_enabled`      | flag key constant | used by both merchant UI and platform admin              |

Follow-up: add the three env names (no values) to `apps/api/.env.example` next to `WAVE_API_KEY` / `WAVE_API_BASE_URL`. Dashboard flag next to `isInvoicingComingSoon` in `apps/dashboard/src/lib/constants/feature-flags.ts`.

gitleaks: never commit a UUID-shaped KOMPTO key. Tests use `test-kompto-key`, not the partner test key.

## Domain model

```
Merchant invoice (customer_invoices)
  └─ optional FneCertificationRecord
       status, kompto_invoice_id, dgi_identifier, qr_payload, pdf_url

Platform commission ledger (fee RPCs / transactions.processing_fee)
  └─ grouped by organization_id + period
       └─ one FneCertificationRecord (scope = platform_commission)
```

State machine (`FneCertificationStatus`):

`not_requested` → `verify_pending` → `verified` → `confirm_pending` → `certified`

Failures go to `failed`. Credit-note / void path is `voided` (not implemented until `createCreditNote` fields are known).

**Idempotency:** unique `(scope, customer_invoice_id)` for merchant invoices; unique `(scope, organization_id, period_start, period_end)` for commission batches; unique `kompto_invoice_id`. `planMerchantInvoiceCertification` returns `skip` when already certified. Dry-run never calls `confirm`. Admin `commit` returns `commit_blocked_pending_accountant_confirmation` until finance signs off.

## API surface (contracts in `@lomi./shared/fne`)

Not mounted on Nest yet. Intended routes for follow-up:

| Actor    | Route (proposed)                           | Behavior                                                  |
| -------- | ------------------------------------------ | --------------------------------------------------------- |
| Merchant | `POST /invoices/:id/fne/certify`           | Verify, optionally confirm. `dryRun=true` is verify only. |
| Merchant | `GET /invoices/:id/fne`                    | Certification status                                      |
| Merchant | `GET /fne/certifications`                  | List for the org                                          |
| Admin    | `POST /internal/fne/commissions/aggregate` | Body `{ mode: "dry-run" \| "commit", period }`            |

Dashboard TODOs (private submodule, not edited in this PR):

1. `apps/dashboard/src/lib/constants/feature-flags.ts` — `isFneKomptoEnabled` from `VITE_FNE_KOMPTO_ENABLED === "true"`.
2. `apps/dashboard/src/components/dashboard/invoicing/invoice-sheet.tsx` / `invoice-editor.tsx` — Certify action when invoicing is unlocked, org is Côte d'Ivoire, and the flag is on. Copy through locale files (`en` / `fr` / `es` / `zh`). Show status, never a UUID; show `inv_…` / DGI number.
3. `apps/dashboard/src/components/dashboard/invoicing/pdf/invoice-pdf-document.tsx` — TODO: render KOMPTO-returned QR / visuel / normalized number only when `status === certified`.
4. `apps/admin` — dry-run commission preview page calling the internal route. Commit button disabled until accountant confirmation is recorded.

API TODOs:

1. `apps/api/.env.example` — document `KOMPTO_*` and `FNE_KOMPTO_ENABLED` with empty values.
2. New Nest module `src/core/fne/` using `createKomptoClient` from `@lomi./shared/fne`.
3. `apps/api/src/core/invoices/invoices.controller.ts` — certify + get status. Do not add `create` (one-shot confirm) as the default.
4. BullMQ job for period aggregation, cron via `api_internal_base_url()` + `x-cron-secret`. Job default `mode: "dry-run"`.
5. `packages/queries` RPC wrappers **after** dashboard SQL/RPCs exist. Do not add fake RPC names before the migration.

## Tests

`packages/shared` (`pnpm --dir packages/shared test`):

- Config: enabled without key throws; redacted snapshot never includes the key
- Payload: B2B without NCC rejected; missing TVA name rejected; only `transfer` maps from SPI / bank transfer
- Aggregation: groups by org + period; skips already-certified ids; rejects mixed currencies in a group
- Planner: certified records skip confirm; dry-run never emits `confirm`
- HTTP mock: verify success, 4xx, and confirm-not-called on dry-run

## Follow-up for Cursor (after this PR)

1. Drop the PDF guide into a **private** attachment store (not this public repo if it contains credentials). Update `kompto.ts` query/body field names from the PDF. Delete the `id` query-param guess if the guide uses another name.
2. Init `apps/dashboard` and `apps/api` submodules; implement the TODOs above.
3. Apply proposed SQL through dashboard migrations; generate Database types.
4. Mock-server test in `apps/api` against KOMPTO test env using GitHub Actions secrets (`KOMPTO_API_KEY`), never a committed key.
5. Accountant answers (below) before flipping the flag or allowing `commit`.

## Open questions for finance / accountant

Please answer in writing before production enablement. KOMPTO offered to help escalate to DGI if needed.

1. Does lomi.africa SARL have **bank status** that would exempt FNE, or are we treated as a non-bank payment firm?
2. Are **platform commissions** (processing fees) subject to FNE? If yes, is the client the merchant (B2B, NCC) for each aggregated invoice?
3. Is **monthly vs semi-annual** aggregation acceptable to DGI for commission stickers, versus one FNE per captured payment?
4. Which KOMPTO `itemTVAName` applies to commissions (`TVA` / `TVAB` / `TVAC` / `TVAD` / `TVAE`)? Do not guess in code.
5. Establishment and point-of-sale identifiers for KOMPTO production: who owns them, and are they one platform establishment or per merchant?
6. Who is the seller on merchant-issued invoices that lomi. certifies on the merchant's behalf: the merchant (NCC) or lomi.? (Product intent is merchant-as-seller; confirm.)
7. Archive / retention: keep KOMPTO PDF + DGI number how long, in which bucket?
8. Credit notes: when a payment is refunded, do we emit `createCreditNote`, and does that need a sticker too?

Until (1)-(4) are answered, keep `FNE_KOMPTO_ENABLED` off and aggregation in dry-run only.
