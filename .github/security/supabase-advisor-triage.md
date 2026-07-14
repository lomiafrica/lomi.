# Supabase security advisor triage

Read-only advisor pull against production (`mdswvokxrnfggrujsfjd`) on 2026-07-14 flagged **`anon_security_definer_function_executable`** warnings for platform admin RPCs (e.g. `admin_create_partner`).

## Root cause

PostgreSQL default privileges and Supabase defaults can leave `EXECUTE` on `PUBLIC` / `anon` for `SECURITY DEFINER` functions in `public`. Those functions bypass RLS when invoked via PostgREST `/rest/v1/rpc/...`.

## Canonical remediation (in repo)

Migration [20250226000108_settlements_api.sql](../../apps/dashboard/supabase/migrations/20250226000108_settlements_api.sql) ends with a **security hardening** block that:

1. `REVOKE EXECUTE ... FROM PUBLIC, anon` on all `admin_%` and `get_admin_%` SECURITY DEFINER functions.
2. Re-grants `authenticated` and `service_role` (except service-role-only payout helpers).
3. Injects `is_platform_admin()` guards on unguarded plpgsql admin functions.
4. Revokes anon/PUBLIC on other SECDEF functions and restores checkout allowlist.

**Action:** Ensure this migration is applied in production (via normal migration deploy or `run_to_prod.sql` if hotfixing).

## Ongoing verification

| Check | Location |
| --- | --- |
| Admin RPC anon execute drift | `.github/scripts/check-anon-admin-rpc-execute.mjs` |
| CI schedule | `.github/workflows/app-check-supabase-admin-rpc.yml` |
| Authenticated table GRANTs | `.github/scripts/check-authenticated-grants.mjs` |

## Residual advisor categories (triage backlog)

After applying `20250226000108`, re-run Supabase MCP `get_advisors` (type `security`) and address any remaining:

- `authenticated_security_definer_function_executable` — intentional only when merchant-authenticated RPCs are required; document each exception.
- `security_definer_view` — prefer `security_invoker = true` on new views.
- `function_search_path_mutable` — set `search_path = public, pg_temp` on SECDEF functions.
- `rls_disabled_in_public` — enable RLS on exposed tables.

Record closure in this file when each category reaches zero warnings in prod.
