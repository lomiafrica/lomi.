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

In scope: lomi.-operated services (API, checkout, dashboard, admin, MCP, Supabase Postgres/Auth/Storage, customer portal, docs, website).

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

## Recognition

We thank researchers who help keep lomi. and our merchants safe. Coordinated disclosure may be acknowledged in release notes with permission.
