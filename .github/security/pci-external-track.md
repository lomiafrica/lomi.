# PCI external validation track

Procurement and liaison checklist. Items marked **owner action** require humans outside the repo.

## 1. Confirm validation route (owner action)

| Question | Who to ask | Notes |
| --- | --- | --- |
| SAQ D for Service Providers vs QSA-led ROC? | Acquirer / payment brands | Service providers use SAQ D only when eligible; high volume may require ROC |
| Merchant-of-record for Stripe card volume | Finance + Stripe account team | Affects shared responsibility matrix |
| GIM/PaySky AOC when keys issued | GIM relationship owner | Required before GIM go-live ([gim-go-live-gate.md](./gim-go-live-gate.md)) |

Record answers in the program tracker (date, contact, decision).

## 2. QSA engagement (owner action)

- [ ] Shortlist 2–3 PCI QSA firms with fintech / payment platform experience
- [ ] Scope workshop using [cde-data-flows.md](./cde-data-flows.md) and [asset-inventory.md](./asset-inventory.md)
- [ ] Gap analysis against PCI DSS v4.0.1 (all requirements; mark N/A with justification)
- [ ] Deliverable: written scope confirmation (CDE boundaries, segmentation, TPSPs)

## 3. Approved Scanning Vendor (owner action)

PCI DSS Req **11.3.2**: quarterly external vulnerability scans by a [PCI SSC ASV](https://www.pcisecuritystandards.org/assessors_and_solutions/approved_scanning_vendors/).

- [ ] Select ASV vendor
- [ ] Register in-scope external IPs/hostnames (API, checkout, MCP, web apps per RoE)
- [ ] Schedule first scan after sandbox remediation sprint
- [ ] Store passing scan reports (12-month rolling + post-change rescans)

## 4. Third-party service provider (TPSP) evidence

| Provider | Artifact | Status |
| --- | --- | --- |
| Stripe | AOC / responsibility matrix | Collect from Stripe Dashboard / account team |
| GIM / PaySky | AOC + production endpoint confirmation | Pending keys |
| Supabase | SOC 2 / security pack | Vendor trust center |
| Railway / Vercel | SOC 2 / security pack | Vendor trust center |

Maintain under `.github/security/evidence/` (gitignored if sensitive) or secure vault.

## 5. Internal automation (in repo)

| Control | Location |
| --- | --- |
| Dependency audit | `.github/workflows/app-security-audit.yml` |
| Secret scan | `.github/workflows/app-security-gitleaks.yml` |
| SAST | `.github/workflows/app-security-codeql.yml` |
| API + edge synthetics | `app-synthetics-api.yml`, `app-synthetics-edge.yml` |
| Admin RPC drift | `app-check-supabase-admin-rpc.yml` |

## 6. Timeline (suggested)

| Week | Milestone |
| --- | --- |
| 0 | RoE signed; internal security CI green |
| 1–2 | QSA scoping call; ASV vendor selected |
| 2–4 | Sandbox pentest ([sandbox-pentest-runbook.md](./sandbox-pentest-runbook.md)); remediate P1 |
| 4–6 | Third-party external pentest (Tier 0) |
| 6+ | SAQ D draft or ROC fieldwork; first ASV quarter closed |
