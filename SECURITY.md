# Security Policy

## Reporting a vulnerability

If you believe you have found a security vulnerability in lomi., please **responsibly disclose** it. Do not open a public GitHub issue for security reports.

**Preferred channel:** [GitHub Security Advisory](https://github.com/lomiafrica/lomi./security/advisories/new) (private).

**Include:**

- Description and impact
- Steps to reproduce
- Affected URLs or components (e.g. `api.lomi.africa`, checkout, dashboard)
- Proof of concept if available (no real customer payment data)

We aim to acknowledge reports within **3 business days** and provide a remediation timeline based on severity.

## Scope

In scope: lomi.-operated services (API, checkout, dashboard, admin, MCP, Supabase edge functions, customer portal, docs, website).

Out of scope unless explicitly agreed:

- Third-party provider consoles and infrastructure
- Merchant-customized plugin deployments on merchant infrastructure
- Social engineering and physical attacks
- Denial-of-service without prior written authorization

## Safe harbor

We support good-faith research that follows this policy. Do not access, modify, or delete data belonging to other users. Use sandbox environments and test accounts where possible.

## Severity and response targets

| Severity | Examples | Target |
| --- | --- | --- |
| Critical | Auth bypass on admin/provisioning, exposure of sensitive payment data | Mitigation ASAP, update within 7 days |
| High | Tenant isolation flaw, webhook signature bypass | Fix within 30 days |
| Medium | XSS with limited impact, misconfiguration | Fix within 90 days |
| Low | Informational | Best-effort backlog |

## Incident response (internal)

1. **Detect** — Monitoring, synthetics, advisor alerts, or researcher report.
2. **Triage** — Program owner assigns severity and comms lead.
3. **Contain** — Revoke keys, disable feature flags, block routes if needed.
4. **Eradicate** — Patch, migration, config fix with regression tests.
5. **Recover** — Restore service; verify with retest.
6. **Learn** — Post-incident note; update runbooks and CI checks.

## Security program (internal)

Operational docs for testing and compliance readiness live under [`.github/security/`](.github/security/README.md). Automated controls: CodeQL, gitleaks, dependency audit, API/edge synthetics, and Supabase grant/RPC drift checks (see `.github/workflows/app-security-*.yml`).

## Recognition

We thank researchers who help keep lomi. and our merchants safe. Coordinated disclosure may be acknowledged in release notes with permission.
