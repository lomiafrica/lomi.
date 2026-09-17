import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  PERMISSION_GROUPS,
  PERMISSION_KEYS,
  SYSTEM_ROLES,
  parsePermissionKeysFromSqlSeed,
} from "./team-rbac.js";

const here = dirname(fileURLToPath(import.meta.url));
const seedPath = join(
  here,
  "../../../apps/dashboard/supabase/migrations/20240828000006_functions_business.sql",
);

test("permission groups cover every catalog key once", () => {
  const grouped = PERMISSION_GROUPS.flatMap((group) => [...group.keys]);
  assert.deepEqual([...grouped].sort(), [...PERMISSION_KEYS].sort());
});

test("system roles only reference catalog keys", () => {
  const catalog = new Set(PERMISSION_KEYS);
  for (const role of SYSTEM_ROLES) {
    if (!role.permissions) continue;
    for (const key of role.permissions) {
      assert.equal(catalog.has(key), true, `${role.key} has unknown ${key}`);
    }
  }
});

test("SQL permission seed matches PERMISSION_KEYS", () => {
  const sql = readFileSync(seedPath, "utf8");
  const seeded = parsePermissionKeysFromSqlSeed(sql);
  assert.deepEqual([...seeded].sort(), [...PERMISSION_KEYS].sort());
});
