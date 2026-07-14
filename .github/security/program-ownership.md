# Security program ownership

## Roles

| Role | Responsibility | Default assignee |
| --- | --- | --- |
| **Program owner** | Scope, RoE sign-off, external assessor liaison | Engineering lead (fill name) |
| **Technical pentest lead** | Executes or coordinates sandbox/live tests | Security-minded engineer (fill name) |
| **PCI compliance coordinator** | SAQ/ROC evidence, provider AOCs, ASV schedule | Finance / ops delegate (fill name) |
| **Remediation owner** | Tracks findings to closure | Same as program owner |

## Internal vs third-party penetration test

PCI DSS requires **organizational independence**: testers must not manage the systems they assess.

| Approach | When to use |
| --- | --- |
| **Third-party firm** | Preferred for PCI-recognized annual external test (Req 11.4.3) and first full-scope engagement |
| **Internal team** | Acceptable if testers are separate from day-to-day operation of target systems (e.g. dedicated security engineer or rotated squad); document independence in the report |
| **Hybrid** | Internal continuous testing (synthetics, security CI) + annual third-party external test |

**Recommendation for lomi. (2026-07):**

1. **Now:** Internal team runs sandbox checklist ([sandbox-pentest-runbook.md](./sandbox-pentest-runbook.md)) and automated suites (`pnpm synthetics`, `pnpm synthetics:edge`, security CI).
2. **Within 90 days:** Engage a PCI-experienced third party for external web/API pentest covering Tier 0.
3. **Parallel:** QSA gap analysis for SAQ D vs ROC ([pci-external-track.md](./pci-external-track.md)).

## Meeting cadence

- **Weekly** (during active pentest/remediation): 30 min standup — open findings, blockers.
- **Quarterly:** ASV scan review, advisor triage, dependency audit summary.
- **Annually:** Full pentest + segmentation test + PCI validation refresh.

## Related automation

| Check | Location |
| --- | --- |
| API synthetics | `.github/workflows/app-synthetics-api.yml` |
| Edge synthetics | `.github/workflows/app-synthetics-edge.yml` |
| Supabase grants | `.github/workflows/app-check-supabase-grants.yml` |
| Security CI | `.github/workflows/app-security-*.yml` |
