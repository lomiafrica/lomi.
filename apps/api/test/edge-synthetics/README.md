# Edge function synthetics

Daily and on-demand smoke tests against deployed Supabase edge functions. Focuses on **reject-path auth/binding checks** (no DB writes) plus one **CORS reachability** probe.

Uses the **same** `SUPABASE_URL` + publishable/anon key as the API — you do **not** need separate `EDGE_SYNTHETICS_*` Supabase credentials.

Mutating sandbox checks (checkout session + Stripe payment intent binding) are **opt-in** via `EDGE_SYNTHETICS_MUTATING=1` and are **not** run in daily CI.

## Why not sandbox URL vs live URL?

lomi. uses **one** Supabase project for edge functions (`https://….supabase.co`).  
Sandbox vs live is a **merchant API / data** distinction (`lomi_sk_test_…` vs `lomi_sk_live_…`, `sandbox.api` vs `api`), **not** a second Supabase host.

So edge synthetics always hit that single functions base:

`{SUPABASE_URL}/functions/v1/{name}`

The suite names `sandbox` / `live` mean:

| Suite | Meaning |
| --- | --- |
| `sandbox` | Reject-path checks (and optional mutating with `LOMI_TEST_KEY`) |
| `live` | Thin CORS/reachability probe on the **same** URL (no charges) |

## Prerequisites

- Node 20+ and pnpm (from `apps/api`)
- `SUPABASE_URL` + publishable key (already used by the API)

## Run locally

From `apps/api` (reads `.env` / `.env.local`):

```bash
# Default: reject checks + CORS probe
pnpm synthetics:edge

# Reject checks only
pnpm synthetics:edge:sandbox

# Reachability probe only
pnpm synthetics:edge:live

# Opt-in mutating path (creates one checkout session + tests PI binding)
EDGE_SYNTHETICS_MUTATING=1 LOMI_TEST_KEY=lomi_sk_test_... \
pnpm synthetics:edge:sandbox
```

Exit code `0` = all checks passed. Exit code `1` = at least one failure.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Same project URL as the API |
| `SUPABASE_PUBLISHABLE_KEY` | Yes* | Anon/publishable key (`DB_PUBLISHABLE_KEY` or `SUPABASE_ANON_KEY` also accepted) |
| `LOMI_TEST_KEY` | Mutating only | Sandbox merchant API key (`lomi_sk_test_...`) |
| `SANDBOX_API_URL` | No | Default `https://sandbox.api.lomi.africa` |
| `EDGE_SYNTHETICS_MUTATING` | No | Set to `1` for mutating happy-path (off in CI) |

\* Required under one of the three publishable key names above.

**Not used in daily CI:** `DB_SECRET_KEY`, `INTERNAL_EDGE_AUTH_TOKEN`, or service-role keys.

## What is checked

### Sandbox — reject (default, no writes)

| Function | Check |
| --- | --- |
| `create-stripe-payment-intent` | CORS; missing/unknown `checkoutSessionId` rejected |
| `mtn` | CORS; missing auth; anon bearer without user session rejected |
| `mtn-sync` | Missing `referenceId`; unknown reference rejected |
| `expire-pending-transactions` | POST without internal auth → 401 |
| `send-transaction-email` | Untrusted caller / partial internal header → 401/403 |

### Live — reachability (same project)

- `OPTIONS` on `create-stripe-payment-intent` (CORS headers present)

### Mutating (opt-in)

1. `POST /checkout-sessions` via sandbox merchant API (`LOMI_TEST_KEY`)
2. `POST create-stripe-payment-intent` with valid session binding
3. Expects payment intent success or a controlled Stripe test error — **not** a binding 403

Uses `@lomi.test` emails and `metadata.source: edge_synthetics`.

## CI

Scheduled via `.github/workflows/app-synthetics-edge.yml`.

Repository secrets (reuse existing API/Supabase secrets if already set):

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SLACK_WEBHOOK_URL` (optional)

## What this does not prove

- Full hosted checkout UI flows
- MTN RequestToPay happy path via edge (API synthetics cover sandbox MTN charges)
- Internal cron paths with valid `INTERNAL_EDGE_AUTH_TOKEN`
