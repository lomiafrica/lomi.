#!/usr/bin/env node
/**
 * Fail when anon or PUBLIC can EXECUTE platform admin SECURITY DEFINER RPCs.
 *
 * Canonical fix: apps/dashboard/supabase/migrations/20250226000108_settlements_api.sql
 * (security hardening block at end of file).
 *
 * Usage:
 *   SUPABASE_DB_URL=... node .github/scripts/check-anon-admin-rpc-execute.mjs
 *
 * Exit 1 = drift (anon/PUBLIC can execute admin RPC). Exit 2 = infra error.
 */
import { spawnSync } from "node:child_process";

const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!dbUrl) {
  console.error(
    "::error::SUPABASE_DB_URL or DATABASE_URL is required for admin RPC execute check",
  );
  process.exit(2);
}

const sql = `
SELECT
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS args,
  CASE WHEN pg_catalog.has_function_privilege('anon', p.oid, 'EXECUTE') THEN 'anon' END AS anon_exec,
  CASE WHEN pg_catalog.has_function_privilege('public', p.oid, 'EXECUTE') THEN 'public' END AS public_exec
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prosecdef
  AND (
    p.proname LIKE 'admin\\_%' ESCAPE '\\'
    OR p.proname LIKE 'get\\_admin\\_%' ESCAPE '\\'
  )
  AND (
    pg_catalog.has_function_privilege('anon', p.oid, 'EXECUTE')
    OR pg_catalog.has_function_privilege('public', p.oid, 'EXECUTE')
  )
ORDER BY 1, 2;
`;

const result = spawnSync(
  "psql",
  [dbUrl, "-v", "ON_ERROR_STOP=1", "-t", "-A", "-F", "|", "-c", sql],
  { encoding: "utf8" },
);

if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(2);
}

const lines = (result.stdout || "")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

if (lines.length === 0) {
  console.log("OK: no admin/get_admin SECURITY DEFINER RPCs executable by anon or PUBLIC");
  process.exit(0);
}

console.error("::error::Admin RPC EXECUTE drift detected (anon/PUBLIC should be revoked):");
for (const line of lines) {
  const [name, args, anonExec, publicExec] = line.split("|");
  const roles = [anonExec, publicExec].filter(Boolean).join(", ");
  console.error(`  - ${name}(${args}) — ${roles}`);
}
process.exit(1);
