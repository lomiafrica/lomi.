import { join } from 'node:path';

export function getAppRoot(): string {
  return process.env.XRPL_APP_ROOT ?? process.cwd();
}

export function getDataDir(): string {
  return process.env.XRPL_DATA_DIR ?? join(getAppRoot(), 'data');
}

export function getKeysDir(): string {
  return process.env.XRPL_KEYS_DIR ?? join(getAppRoot(), 'keys');
}
