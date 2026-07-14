import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const KEYS = [
  'SUPABASE_URL',
  'SUPABASE_PUBLISHABLE_KEY',
  'DB_PUBLISHABLE_KEY',
  'SUPABASE_ANON_KEY',
  'LOMI_TEST_KEY',
  'SANDBOX_API_URL',
] as const;

/** Load edge-synthetics vars from .env / .env.local without executing the file. */
export function loadEdgeSyntheticsEnv(cwd = process.cwd()): void {
  for (const filename of ['.env.local', '.env']) {
    const path = join(cwd, filename);
    if (!existsSync(path)) continue;
    const text = readFileSync(path, 'utf8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      if (!(KEYS as readonly string[]).includes(key)) continue;
      if (process.env[key]?.trim()) continue;
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}
