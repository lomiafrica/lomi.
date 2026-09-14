import { join } from 'node:path';

export function getAppRoot(): string {
  return process.env.ARC_APP_ROOT ?? process.cwd();
}

export function getDataDir(): string {
  return process.env.ARC_DATA_DIR ?? join(getAppRoot(), 'data');
}

export function getKeysDir(): string {
  return process.env.ARC_KEYS_DIR ?? join(getAppRoot(), 'keys');
}
