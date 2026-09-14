import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Wallet } from 'xrpl';
import { getAppRoot, getKeysDir } from './paths.js';

export type KeyRole = 'omnibus' | 'merchant';

export type StoredKeys = {
  omnibus: { address: string; secret: string };
  merchant: { address: string; secret: string };
};

function ensureKeysDir(): string {
  const keysDir = getKeysDir();
  if (!existsSync(keysDir)) {
    mkdirSync(keysDir, { recursive: true });
  }
  return keysDir;
}

export function loadWallet(role: KeyRole): Wallet {
  const fromEnv =
    role === 'omnibus'
      ? process.env.OMNIBUS_SECRET
      : process.env.MERCHANT_SECRET;
  if (fromEnv?.trim()) {
    return Wallet.fromSeed(fromEnv.trim());
  }
  const path = join(ensureKeysDir(), `${role}.json`);
  if (!existsSync(path)) {
    throw new Error(
      `Missing ${role} keys. Run pnpm bootstrap or set ${role === 'omnibus' ? 'OMNIBUS_SECRET' : 'MERCHANT_SECRET'} in .env`,
    );
  }
  // SAFETY: written by persistStoredKeys with { secret }.
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as { secret: string };
  return Wallet.fromSeed(parsed.secret);
}

export function readStoredKeys(): StoredKeys | null {
  try {
    const omnibus = loadWallet('omnibus');
    const merchant = loadWallet('merchant');
    return {
      omnibus: { address: omnibus.address, secret: omnibus.seed ?? '' },
      merchant: { address: merchant.address, secret: merchant.seed ?? '' },
    };
  } catch {
    return null;
  }
}

export function persistStoredKeys(stored: StoredKeys): void {
  const keysDir = ensureKeysDir();
  writeFileSync(
    join(keysDir, 'omnibus.json'),
    `${JSON.stringify({ address: stored.omnibus.address, secret: stored.omnibus.secret }, null, 2)}\n`,
  );
  writeFileSync(
    join(keysDir, 'merchant.json'),
    `${JSON.stringify({ address: stored.merchant.address, secret: stored.merchant.secret }, null, 2)}\n`,
  );
  writeFileSync(
    join(getAppRoot(), '.env'),
    `OMNIBUS_SECRET=${stored.omnibus.secret}\nMERCHANT_SECRET=${stored.merchant.secret}\nXRPL_WSS=${process.env.XRPL_WSS?.trim() || 'wss://s.altnet.rippletest.net:51233'}\n`,
  );
}

export function generateAndStoreKeys(): StoredKeys {
  const omnibus = Wallet.generate();
  const merchant = Wallet.generate();
  if (!omnibus.seed || !merchant.seed) {
    throw new Error('xrpl Wallet.generate() returned no seed');
  }
  const stored: StoredKeys = {
    omnibus: { address: omnibus.address, secret: omnibus.seed },
    merchant: { address: merchant.address, secret: merchant.seed },
  };
  persistStoredKeys(stored);
  return stored;
}
