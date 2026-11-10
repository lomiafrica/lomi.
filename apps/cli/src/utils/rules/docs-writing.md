# lomi. documentation writing (agents)

Condensed rules for AI assistants authoring or editing **docs.lomi.africa** content. Full guide: https://docs.lomi.africa/resources/contributing/writing-for-lomi-docs

## Brand

- Product name: **lomi.** (trailing dot in prose)
- SDK package: `@lomi./sdk`
- Domains without dot: `lomi.africa`, `docs.lomi.africa`, `api.lomi.africa`

## Before you write

1. Fetch https://docs.lomi.africa/llms.txt for the page map.
2. Pick **docType**: `tutorial` | `how-to` | `explanation` | `reference`.
3. Reuse canonical pages, do not duplicate sandbox tables or state-machine semantics.

## Voice

- Direct, merchant-centric, present tense.
- Question-led titles for guides: "How do I verify a payment?"
- No vague adjectives ("seamless", "robust") without concrete behavior.

## Integration truths (state in guides)

- **Amounts**: an amount is the money in that currency. `10000` is 10,000 XOF, 10,000 USD, and 10,000 EUR. USD and EUR may use two decimal places, such as `11.99`. XOF is a whole number. Do not convert to cents.
- **Keys**: `lomi_sk_test_…` / `lomi_sk_live_…`; environment follows the **key**, not hostname alone.
- **Mobile money (live)**: async, verify with webhooks + `GET /transactions/{id}` before fulfilling.
- **Never trust client-only success**: server-side verification required.

## EN + FR

New pages under `start/`, `build/guides/`, `build/payment-methods/` need `.mdx` + `.fr.mdx` siblings.

## Anchor pages to imitate

- `start/sandbox-payments`, `start/integration-journey`
- `build/choose-integration`, `build/guides/verify-payments`
- `build/advanced-guides/handling-webhooks`
- `resources/contributing/api-reference-authoring`

## Maintenance

After OpenAPI changes: `CONFIRM_BOOTSTRAP=1 pnpm run api:regenerate-rest-reference` in `apps/docs`. Run `pnpm docs:drift` and `lomi docs check` before merging doc PRs.
