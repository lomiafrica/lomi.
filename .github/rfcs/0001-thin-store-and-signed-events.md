# RFC 0001: thin store, signed events

**Status:** draft. This is an idea for review, not a shipping plan and not a commitment.
**Owner:** the lomi. seat (product).
**Raised by:** Babacar.
**Scope of this document:** written argument plus a ships-versus-missing inventory. No product code changes.

## The question

> Can a merchant import products, pick a thin template, point a domain, take Wave, and then
> build anything else off signed webhooks (including WhatsApp), without us becoming Shopify?

The interesting half is the second half. Anyone can ship a store page. The bet is that the
store stays deliberately thin and the extensibility lives in signed events, so a merchant (or
their cousin with a Make account) builds the rest without waiting on our UI. That is closer to
Stripe than to Squarespace.

## Constraints this RFC does not reopen

Locked with product on the existing call:

- Storefront is parked as the GTM hero. This RFC is about what the hero would be, not about unparking it now.
- Customer portal stays billing. It does not become a shop surface.
- Jumbo keeps Wave, MTN, and π-SPI QR plus payment links. No storefront rendering on mobile.
- WhatsApp connect belongs on the phone, not the dashboard.
- GTM stays Wave and Apple Pay first.

Sequencing constraint that shapes everything below: **first money is still a payment link.**
The shop and the webhook come after a merchant has been paid once. Nothing here should turn
onboarding into store setup.

## What already ships

Verified against the submodule pins in this commit (`apps/storefront` `befe430`,
`apps/dashboard` `46166a0`, `apps/api` `0fba03e`, `apps/jumbo` `ff6f1c6`).

### Store

| Capability | Where |
| --- | --- |
| `/{slug}` store home, product detail, in-shop checkout, confirmation, service booking | `apps/storefront/src/app/[slug]/` |
| Gated on `storefront_enabled`, 404 otherwise | `apps/storefront/src/app/[slug]/layout.tsx:111` |
| Custom domain rewrite, host to `/{slug}` | `apps/storefront/proxy.ts:28` via RPC `get_organization_by_custom_domain` |
| Catalog read | `get_public_products_by_org_slug`, `get_public_subscription_plans_by_org_slug`, `get_public_bookable_services_by_org_slug` |
| Cart | client-side provider plus drawer, no cart route |
| WhatsApp float on store, product, service, confirmation | `apps/storefront/src/components/storefront/floating-whatsapp-button.tsx`, driven by `organizations.whatsapp_number` |
| Wave checkout in shop | `POST /providers/wave` via `apps/storefront/src/lib/wave/client.ts:28` |
| Apple Pay and Google Pay | Stripe express checkout, gated on `apple_pay_enabled` / `google_pay_enabled` |

So "point a domain, take Wave" already works end to end today.

### Merchant surfaces

| Capability | Where |
| --- | --- |
| Storefront enable, disable, slug, announcement, shipping, tax | dashboard `StorefrontTab.tsx` via `upsert_storefront`, `update_organization_storefront`, `update_organization_slug`, `update_storefront_settings` |
| Custom domain add, verify, delete | dashboard `domain-section.tsx` to `/dashboard/organizations/:orgId/domains`, CNAME to `store.lomi.africa`, verified with `dns.resolveCname` |
| Storefront on/off plus slug on mobile | jumbo `StorefrontSettingsScreen.tsx` |
| WhatsApp Commerce connect (Kapso embedded signup) | both dashboard `Settings > Channels` and jumbo `WhatsAppCommerceScreen.tsx` |

### Events

| Capability | Where |
| --- | --- |
| Endpoint registration, `whsec_` secret | `POST /webhooks`, dashboard `create_organization_webhook` |
| HMAC-SHA256 hex of the raw body in `X-Lomi-Signature`, plus `X-Lomi-Event` | `apps/api/src/webhooks/webhook-sender.service.ts:171` |
| Envelope `{ id, event, timestamp, data, lomi_environment }` | `webhook-sender.service.ts:152` |
| Outbox plus BullMQ, 6 attempts with exponential backoff | `webhook-sender.service.ts:112` |
| Merchant-visible delivery logs and manual retry | `GET /webhooks/deliveries`, `POST /webhooks/:id/deliveries/:deliveryId/retry` |
| Docs with a TypeScript verification snippet, EN and FR | `apps/docs/content/docs/build/reliability/handling-webhooks.mdx` |

The transport is real and already better than the pitch implies.

## What is missing

This is the honest gap list. It is short, and most of it is not store code.

1. **Product import does not exist.** No CSV, no Shopify pull, no bulk anything. Products are
   created one at a time through `create_product`. The WhatsApp catalog import panel links Meta
   catalog items one by one and is not a general importer. This is the actual first-hour blocker
   in the question, and it is the only one of the five verbs that has no implementation at all.

2. **There is no template concept.** The storefront is one fixed layout. Per-merchant variation
   is `logo_url`, `description`, announcement text, and `pay_button_bg_color`. "Pick a thin
   template" is a new primitive, not a setting we already have.

3. **Payout is not an event.** The `webhook_event` enum has no payout or withdrawal member at
   all. "Every sale, refund, payout as a signed event" is currently two thirds true.

4. **Refund events only fire on π-SPI.** `REFUND_CREATED`, `REFUND_COMPLETED`, and
   `REFUND_FAILED` are declared, the listener handles them
   (`apps/api/src/webhooks/listeners/webhook.listener.ts:43`), and the CLI can trigger them for
   testing. The only real emit mapping found is π-SPI (`20250226000098_spi_core.sql:362`). A
   merchant who refunds a Wave payment appears to get no refund webhook. If that holds, it is a
   bug, not a feature request, and it is the single most load-bearing gap for an events-first
   pitch.

5. **Five declared events never fire.** `NETWORK_ENROLLMENT_CREATED`,
   `NETWORK_ENROLLMENT_COMPLETED`, `NETWORK_MEMBERSHIP_ACTIVE`, `NETWORK_MEMBERSHIP_RESTRICTED`,
   and `NETWORK_MEMBERSHIP_TERMINATED` appear in the enum and in the dashboard event picker
   (`apps/dashboard/src/components/dashboard/webhooks/types.ts:78`) with no emit site anywhere.
   Merchants can subscribe to silence. For a product whose pitch is "trust the events", that is
   worse than not offering them.

6. **No signed timestamp, so no replay window.** Delivery sends `X-Lomi-Signature` and
   `X-Lomi-Event` only. `X-Lomi-Timestamp` exists on test sends. Guidance is to dedupe on the
   payload `id`. Stripe signs a timestamp and tells you to reject old ones. If we say "closer to
   Stripe", a reviewer will check this first.

7. **Nothing points at no-code.** Docs show TypeScript and Express. There is no Make recipe, no
   n8n node, no WhatsApp bot example. The "or their cousin" audience has no entry point.

Note in passing: `organization_domains` rows insert with `payment_status = 'unpaid'` and the
dashboard does not surface that gate. Not part of this RFC, worth someone's attention.

## The three bets, restated against that inventory

**Bet 1: thin store, not a theme marketplace.** Import products, a small set of reusable
templates and components, custom domain connect, Wave checkout. Domain and Wave are done.
Import and templates are the work. The same store is reachable from mobile because jumbo links
out to `store.lomi.africa/{slug}`, not because we build a second renderer. Ceiling is set on
purpose: a fixed component set, no per-merchant CSS, no theme engine, no page builder.

**Bet 2: the innovative layer is events.** Every sale, refund, and payout arrives as a signed
event a merchant can drop into Make, n8n, or a WhatsApp bot. Gaps 3 through 7 are the whole
project. Note that the highest-value work here is closing holes in something we already ship,
not building a new subsystem, and none of it is store code. That is the part worth arguing
about: if events are the differentiator, the store may not be the first thing to build.

**Bet 3: WhatsApp connect lives on the phone.** This one is a reduction, not an addition, and it
is the most contested. Today the dashboard has the *richer* flow: connect modal, a dedicated
WhatsApp Commerce page, catalog imports, orders, template sync, phone health. Jumbo has connect,
status, and disconnect. Making the dashboard read-only ("it is on") means moving or dropping
dashboard surface that already exists and works. The argument for it is that the merchant's
WhatsApp Business number is on the phone in their hand, and a desktop connect flow that ends in
a phone confirmation is a worse version of a mobile flow. The argument against is that we would
be deleting the better implementation. Worth deciding explicitly rather than drifting.

## What this is not

No theme engine. No page builder. No per-merchant CSS or custom code. No dashboard redesign. No
second storefront renderer inside jumbo. No change to the payment path. Not a reason to unpark
the storefront ahead of payment links.

## What a reviewer is being asked

Four independent yes or no answers. Any of them can be no without killing the others.

1. Is a deliberately thin store (import plus a fixed template set) worth building as the GTM
   hero, given that domain and Wave already work?
2. Are signed events the differentiator, such that closing gaps 3 through 7 is worth doing
   whether or not the store gets built?
3. Does WhatsApp connect move to phone-only, accepting that the richer dashboard flow gets cut back?
4. Does the sequencing hold, meaning payment link first, shop and webhook only after first money?

If the answer to 2 is yes and 1 is no, that is a useful result: it says fix the events and leave
the store parked.

## How this inventory was produced

Read-only exploration of `apps/storefront`, `apps/dashboard`, `apps/api`, `apps/jumbo`, and
`apps/dashboard/supabase/migrations` at the pins listed above. Emit-site claims in gaps 3, 4, and
5 come from grepping for enqueue and notify call sites and finding none outside enum
declarations, the listener, and tests. Those are absence-of-evidence claims: confirm them against
production delivery logs before anyone builds on them. The fixes belong in `lomiafrica/api` and
`apps/dashboard/supabase/migrations`, which are separate repositories from this one, so they are
out of scope for an idea PR by construction.
