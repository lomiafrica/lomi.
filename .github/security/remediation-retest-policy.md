# Remediation and retest policy

PCI DSS Req **11.4.4** requires correcting exploitable vulnerabilities found during penetration testing and confirming fixes.

## Severity and SLA (internal targets)

| Severity | Definition | Target fix | Retest |
| --- | --- | --- | --- |
| **Critical** | Confirmed CDE breach path, auth bypass, or PAN/CVV leak | 7 days | Before prod deploy |
| **High** | Exploitable with low complexity; no direct PAN leak | 30 days | Within same engagement or next sprint |
| **Medium** | Conditional exploit or defense-in-depth gap | 90 days | Next quarterly review |
| **Low** | Informational, hardening | Backlog | Optional |

## Workflow

1. **Triage** — Program owner assigns ID, severity, owner, and target date within 2 business days of report.
2. **Fix** — PR linked to finding ID; include regression test when applicable.
3. **Verify** — Original tester (or independent reviewer) reproduces fix in sandbox; attach evidence (screenshot, HTTP trace redacted, CI run).
4. **Close** — Update tracker; for PCI evidence, store retest memo with date and tester name.

## Change-triggered retest

Re-run **focused** pentest or automated security suite when any of the following ship to production:

- New or materially changed **card data path** (GIM enablement, direct charges unmuted)
- New **public unauthenticated** API or edge function
- **Auth model** change (OAuth, API key format, RLS overhaul)
- **Admin / provisioning / partner** surface expansion
- **Third-party webhook** integration added

Minimum automated gate: `pnpm synthetics:sandbox`, `pnpm synthetics:edge`, and relevant unit tests in the same PR.

## Evidence storage

| Artifact | Location |
| --- | --- |
| Finding tracker | GitHub Security Advisories / private project board |
| Retest notes | `.github/security/evidence/retest/` (gitignored) or compliance vault |
| CI proof | GitHub Actions run URLs linked from tracker |

## Regression tests added in this program

| Finding area | Test |
| --- | --- |
| API log PAN/CVV redaction | `api-log-payload.spec.ts` |
| Merchant error leaks | `synthetics/assert.ts` + `security-sandbox.ts` |
| Admin RPC anon execute | `check-anon-admin-rpc-execute.mjs` |
| Muted direct charges | `synthetics/checks/sandbox.ts` |
