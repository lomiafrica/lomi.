# Asset and attack-surface inventory

Canonical inventory for penetration testing and PCI scoping. Production URLs are the default test targets unless rules of engagement specify sandbox only.

## Tier 0 — CDE and security-impacting (test first)

| Asset | Host / URL | Stack | Notes |
| --- | --- | --- | --- |
| Merchant API | `api.lomi.africa`, `sandbox.api.lomi.africa` | NestJS on Railway | Webhooks, checkout, provisioning, partners, OAuth |
| Hosted checkout | `checkout.lomi.africa` (+ merchant CNAMEs) | Next.js on Vercel | Stripe Elements + GIM plain fields (pre-live) |
| Storefront | `store.lomi.africa` | Next.js on Vercel | Same payment stack as checkout |
| Supabase | `mdswvokxrnfggrujsfjd.supabase.co` | Postgres, Auth, PostgREST, Storage | No product Edge Functions; HTTP is Nest |
| MCP server | `mcp.lomi.africa` | Node on Railway | ~22 merchant resource tools + search; OAuth resource server |
| Admin | `admin.lomi.africa` | Vite SPA on Vercel | Platform admin; `@lomi.africa` gate |
| Dashboard | `dashboard.lomi.africa` | Vite SPA on Vercel | Merchant auth + PostgREST RPCs |

## Tier 1 — integrations and privileged clients

| Asset | Host / URL | Notes |
| --- | --- | --- |
| Customer portal | `customers.lomi.africa` | Portal session tokens |
| CLI | `lomi` binary | Device flow via Nest `/cli-auth` |
| SDKs / embed | npm `@lomi./sdk`, embed widget | Merchant sites |
| MPOS (jumbo) | iOS/Android | Stripe Terminal + API |
| E-commerce plugins | Woo, Shopify custom install (`connect.lomi.africa`; leftover `shopify.lomi.africa` Vercel CNAME is not the install host), etc. | Separate deploy repos |

## Tier 2 — public, usually outside CDE

| Asset | Host / URL | Notes |
| --- | --- | --- |
| Website | `lomi.africa` | Sanity CMS; agent discovery (`openapi.json`, `.well-known`) |
| Docs | `docs.lomi.africa` | `/api/proxy` → sandbox API only |

## Infrastructure dependencies

| System | Role |
| --- | --- |
| Railway | API, MCP |
| Vercel | Web apps |
| Supabase | Database, auth, storage |
| Upstash Redis | BullMQ (webhooks, metering) |
| Stripe | Card tokenization (live rail) |
| GIM / PaySky | Card acquiring (pre-live; UAT URL in code) |
| Wave, MTN, SPI | Mobile money |

## Out of scope unless explicitly authorized

- Third-party provider production consoles (Stripe Dashboard, PaySky, Wave, MTN)
- Merchant-owned origins and plugin installs on merchant infrastructure
- Denial-of-service or destructive database operations on production
