#!/usr/bin/env node
/**
 * Detect authenticated-role table grant drift vs canonical RLS migration.
 *
 * Why: Dashboard PostgREST writes + RLS policies that reference sibling tables
 * fail with merchant-facing 403 / Postgres 42501 when GRANTs drift.
 *
 * Usage:
 *   node .github/scripts/check-authenticated-grants.mjs
 *   SUPABASE_DB_URL=... node .github/scripts/check-authenticated-grants.mjs
 *   node .github/scripts/check-authenticated-grants.mjs --sql
 *
 * Env:
 *   SUPABASE_DB_URL / DATABASE_URL — prefer psql against this URL (CI)
 *   ENABLE_RLS_SQL — override path to 20240828000040_enable_rls.sql
 *
 * Exit 1 = missing grants (drift). Exit 2 = infra / config error.
 * GRANTs for tables that do not exist in the target database are skipped
 * (logged as notice), not treated as drift.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveEnableRlsPath() {
  if (process.env.ENABLE_RLS_SQL) {
    return path.resolve(process.env.ENABLE_RLS_SQL);
  }

  const candidates = [
    // Monorepo CI: dashboard checked out under apps/dashboard
    path.resolve(
      __dirname,
      "../../apps/dashboard/supabase/migrations/20240828000040_enable_rls.sql",
    ),
    // Local: script copied/symlinked under apps/dashboard/src/lib/scripts
    path.resolve(
      __dirname,
      "../../../supabase/migrations/20240828000040_enable_rls.sql",
    ),
    path.resolve(
      process.cwd(),
      "supabase/migrations/20240828000040_enable_rls.sql",
    ),
    path.resolve(
      process.cwd(),
      "apps/dashboard/supabase/migrations/20240828000040_enable_rls.sql",
    ),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return candidates[0];
}

const GRANT_RE =
  /GRANT\s+((?:SELECT|INSERT|UPDATE|DELETE)(?:\s*,\s*(?:SELECT|INSERT|UPDATE|DELETE))*)\s+ON\s+(?:TABLE\s+)?(?:public\.)?([a-zA-Z0-9_]+)\s+TO\s+authenticated\b/gi;

function parseExpectedGrants(sql) {
  /** @type {Map<string, Set<string>>} */
  const byTable = new Map();
  for (const match of sql.matchAll(GRANT_RE)) {
    const privs = match[1].split(",").map((p) => p.trim().toUpperCase());
    const table = match[2].toLowerCase();
    if (!byTable.has(table)) byTable.set(table, new Set());
    for (const priv of privs) byTable.get(table).add(priv);
  }
  return byTable;
}

function expectedValuesSql(expected) {
  const values = [];
  for (const [table, privs] of [...expected.entries()].sort()) {
    for (const priv of [...privs].sort()) {
      values.push(`('${table}', '${priv}')`);
    }
  }
  return values.join(",\n    ");
}

function presentTablesCte() {
  return `
present AS (
  SELECT c.relname AS table_name
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relkind = 'r'
)`;
}

function buildAuditSql(expected) {
  return `
WITH expected(table_name, privilege_type) AS (
  VALUES
    ${expectedValuesSql(expected)}
),
${presentTablesCte().trim()},
actual AS (
  SELECT table_name, privilege_type
  FROM information_schema.role_table_grants
  WHERE table_schema = 'public'
    AND grantee = 'authenticated'
)
SELECT e.table_name, e.privilege_type AS missing_privilege
FROM expected e
INNER JOIN present p USING (table_name)
LEFT JOIN actual a USING (table_name, privilege_type)
WHERE a.privilege_type IS NULL
ORDER BY e.table_name, e.privilege_type;
`.trim();
}

function buildAbsentTablesSql(expected) {
  const values = [...expected.keys()]
    .sort()
    .map((table) => `('${table}')`)
    .join(",\n    ");
  return `
WITH expected(table_name) AS (
  VALUES
    ${values}
),
${presentTablesCte().trim()}
SELECT e.table_name
FROM expected e
WHERE NOT EXISTS (
  SELECT 1 FROM present p WHERE p.table_name = e.table_name
)
ORDER BY e.table_name;
`.trim();
}

function buildPsqlJsonAuditSql(expected) {
  return `
WITH expected(table_name, privilege_type) AS (
  VALUES
    ${expectedValuesSql(expected)}
),
${presentTablesCte().trim()},
actual AS (
  SELECT table_name, privilege_type
  FROM information_schema.role_table_grants
  WHERE table_schema = 'public'
    AND grantee = 'authenticated'
),
missing AS (
  SELECT e.table_name, e.privilege_type AS missing_privilege
  FROM expected e
  INNER JOIN present p USING (table_name)
  LEFT JOIN actual a USING (table_name, privilege_type)
  WHERE a.privilege_type IS NULL
)
SELECT COALESCE(json_agg(row_to_json(m) ORDER BY m.table_name, m.missing_privilege), '[]'::json)
FROM missing m;
`.trim();
}

function buildPsqlJsonAbsentTablesSql(expected) {
  const values = [...expected.keys()]
    .sort()
    .map((table) => `('${table}')`)
    .join(",\n    ");
  return `
WITH expected(table_name) AS (
  VALUES
    ${values}
),
${presentTablesCte().trim()}
SELECT COALESCE(json_agg(e.table_name ORDER BY e.table_name), '[]'::json)
FROM expected e
WHERE NOT EXISTS (
  SELECT 1 FROM present p WHERE p.table_name = e.table_name
);
`.trim();
}

function parseJsonRows(out) {
  const trimmed = out.trim();
  if (!trimmed) return [];
  const parsed = JSON.parse(trimmed);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.rows)) return parsed.rows;
  return [];
}

function runLinkedQuery(sql, dashboardRoot) {
  const tmpDir = path.join(dashboardRoot, "supabase/.temp");
  fs.mkdirSync(tmpDir, { recursive: true });
  const tmp = path.join(tmpDir, "grants-audit.sql");
  fs.writeFileSync(tmp, sql, "utf8");
  try {
    const out = execFileSync(
      "supabase",
      ["db", "query", "--linked", "-f", tmp, "-o", "json"],
      {
        cwd: dashboardRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    return parseJsonRows(out);
  } finally {
    try {
      fs.unlinkSync(tmp);
    } catch {
      // ignore
    }
  }
}

function runPsqlQuery(sql, databaseUrl) {
  const result = spawnSync(
    "psql",
    [databaseUrl, "-v", "ON_ERROR_STOP=1", "-tA", "-c", sql],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "psql failed");
  }
  return parseJsonRows(result.stdout);
}

function main() {
  const enableRlsPath = resolveEnableRlsPath();
  if (!fs.existsSync(enableRlsPath)) {
    console.error(`Missing enable_rls migration at ${enableRlsPath}`);
    process.exit(2);
  }

  const sqlText = fs.readFileSync(enableRlsPath, "utf8");
  const expected = parseExpectedGrants(sqlText);
  if (expected.size === 0) {
    console.error(`No authenticated GRANTs parsed from ${enableRlsPath}`);
    process.exit(2);
  }

  const auditSql = buildAuditSql(expected);
  if (process.argv.includes("--sql")) {
    console.log(auditSql);
    console.log("\n-- tables named in GRANTs but not present in the database --");
    console.log(buildAbsentTablesSql(expected));
    return;
  }

  const databaseUrl =
    process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || "";
  const dashboardRoot = path.resolve(path.dirname(enableRlsPath), "../..");

  let rows;
  let absentTables = [];
  try {
    if (databaseUrl) {
      rows = runPsqlQuery(buildPsqlJsonAuditSql(expected), databaseUrl);
      absentTables = runPsqlQuery(
        buildPsqlJsonAbsentTablesSql(expected),
        databaseUrl,
      );
    } else {
      rows = runLinkedQuery(auditSql, dashboardRoot);
      absentTables = runLinkedQuery(
        buildAbsentTablesSql(expected),
        dashboardRoot,
      );
    }
  } catch (err) {
    console.error(
      "Failed to run grant audit. Set SUPABASE_DB_URL for psql, use --sql, or ensure `supabase db query --linked` works.",
    );
    console.error(err instanceof Error ? err.message : err);
    process.exit(2);
  }

  if (!Array.isArray(rows)) rows = [];
  if (!Array.isArray(absentTables)) absentTables = [];
  const absentNames = absentTables.map((row) =>
    Object.prototype.toString.call(row) === "[object String]"
      ? row
      : row.table_name,
  );

  if (absentNames.length > 0) {
    console.log(
      `notice: skipping ${absentNames.length} expected table(s) not present in the database:`,
    );
    for (const name of absentNames) {
      console.log(`  - ${name}`);
    }
  }

  const presentCount = expected.size - absentNames.length;
  if (rows.length === 0) {
    console.log(
      `OK: authenticated grants match ${presentCount} present tables from ${path.basename(enableRlsPath)}`,
    );
    process.exit(0);
  }

  console.error(
    `FAIL: ${rows.length} missing authenticated grant(s) vs ${path.basename(enableRlsPath)}:`,
  );
  for (const row of rows) {
    console.error(`  - ${row.table_name}.${row.missing_privilege}`);
  }
  process.exit(1);
}

main();
