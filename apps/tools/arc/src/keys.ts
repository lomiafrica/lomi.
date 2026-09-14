import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import type { Address, Hex } from 'viem';
import { getAppRoot, getKeysDir } from './paths.js';

export type KeyRole = 'omnibus' | 'merchant';

export type StoredKeys = {
  omnibus: { address: Address; secret: Hex };
  merchant: { address: Address; secret: Hex };
};

function ensureKeysDir(): string {
  const keysDir = getKeysDir();
  if (!existsSync(keysDir)) {
    mkdirSync(keysDir, { recursive: true });
  }
  return keysDir;
}

function normalizeSecret(raw: string): Hex {
  const trimmed = raw.trim();
  const hex = trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`;
  return hex as Hex;
}

export function loadSecret(role: KeyRole): Hex {
  const fromEnv =
    role === 'omnibus'
      ? process.env.OMNIBUS_SECRET
      : process.env.MERCHANT_SECRET;
  if (fromEnv?.trim()) {
    return normalizeSecret(fromEnv);
  }
  const path = join(ensureKeysDir(), `${role}.json`);
  if (!existsSync(path)) {
    throw new Error(
      `Missing ${role} keys. Run pnpm bootstrap or set ${role === 'omnibus' ? 'OMNIBUS_SECRET' : 'MERCHANT_SECRET'} in .env`,
    );
  }
  // SAFETY: written by persistStoredKeys with { secret }.
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as { secret: string };
  return normalizeSecret(parsed.secret);
}

export function loadAccount(role: KeyRole) {
  return privateKeyToAccount(loadSecret(role));
}

export function readStoredKeys(): StoredKeys | null {
  try {
    const omnibus = loadAccount('omnibus');
    const merchant = loadAccount('merchant');
    return {
      omnibus: { address: omnibus.address, secret: loadSecret('omnibus') },
      merchant: { address: merchant.address, secret: loadSecret('merchant') },
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
    `OMNIBUS_SECRET=${stored.omnibus.secret}\nMERCHANT_SECRET=${stored.merchant.secret}\nARC_RPC_URL=${process.env.ARC_RPC_URL?.trim() || 'https://rpc.testnet.arc.network'}\n`,
  );
}

export function generateAndStoreKeys(): StoredKeys {
  const omnibusSecret = generatePrivateKey();
  const merchantSecret = generatePrivateKey();
  const stored: StoredKeys = {
    omnibus: {
      address: privateKeyToAccount(omnibusSecret).address,
      secret: omnibusSecret,
    },
    merchant: {
      address: privateKeyToAccount(merchantSecret).address,
      secret: merchantSecret,
    },
  };
  persistStoredKeys(stored);
  return stored;
}
