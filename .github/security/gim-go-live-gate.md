# GIM Pay and direct card rails — go-live gate

GIM is **code-complete** but **not production-enabled** (no acquirer keys; UAT endpoint default). Do **not** set `LOMI_DIRECT_SWITCH_CHARGES_ENABLED` or expose GIM in checkout for live merchants until every item below is checked.

## Preconditions

| # | Gate | Evidence |
| --- | --- | --- |
| G1 | **Logging redaction** for `/checkout/v1/gim` and `/charge/switch` in `api-log-payload.ts` | Unit tests green |
| G2 | **Sandbox pentest** of GIM reject and happy paths | [sandbox-pentest-runbook.md](./sandbox-pentest-runbook.md) signed; no open Critical/High |
| G3 | **Provider AOC** from GIM/PaySky for production endpoint | File in compliance vault |
| G4 | **CDE boundary** documented and QSA-reviewed | [cde-data-flows.md](./cde-data-flows.md) + QSA sign-off |
| G5 | **Production acquirer config** (`GIM_*` secrets, non-UAT URL) in Railway only | Infra change ticket |
| G6 | **PAN/CVV never persisted** — DB review `gim_payments` | Migration + spot check |
| G7 | **Error paths** do not echo PAN/CVV | `security-sandbox` synthetics + manual trace |
| G8 | **Infrastructure logging** review (Railway/Vercel/Supabase) — no raw body logging | Vendor config attestation |
| G9 | **Merchant communication** — contracts state PCI allocation when GIM rail offered | Legal sign-off |
| G10 | **Feature flag** rollout plan — enable per org after soak | Dashboard payment method settings |

## Enablement order

1. Deploy API + checkout with GIM **hidden** by default (`organization_payment_method_settings`).
2. Internal dogfood org only in sandbox; then single live pilot merchant.
3. Run ASV scan on checkout/API external surfaces after enablement.
4. Schedule segmentation test if CDE network boundaries changed.

## Rollback

- Hide GIM payment method for all orgs via admin/fees tooling.
- Remove `GIM_*` production secrets from API (reverts to unavailable).
- Keep `LOMI_DIRECT_SWITCH_CHARGES_ENABLED` unset (503).

## Related code

| Area | Path |
| --- | --- |
| Hosted GIM pay API | `apps/api/src/checkout/checkout-gim.controller.ts` |
| GIM client | `apps/api/src/core/gim/gim-client.service.ts` |
| Checkout UI | `apps/checkout/.../gim-card-information-section.tsx` |
| Direct switch guard | `apps/api/src/core/charges/direct-card-charge-guard.ts` |
| Config | `apps/api/src/core/gim/gim-config.ts` |
