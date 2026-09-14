import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getDataDir } from './paths.js';

export type TestnetProofFile = {
  status: 'pending' | 'settled';
  omnibusAddress: string;
  merchantAddress: string;
  payoutId?: string;
  settlementTx?: string;
  faucetUrl: string;
  updatedAt: string;
};

const PROOF_PATH = () => join(getDataDir(), 'testnet-proof.json');

export function readTestnetProof(): TestnetProofFile | null {
  try {
    const raw = readFileSync(PROOF_PATH(), 'utf8');
    // SAFETY: written by writeTestnetProof below.
    return JSON.parse(raw) as TestnetProofFile;
  } catch {
    return null;
  }
}

export function writeTestnetProof(
  patch: Omit<TestnetProofFile, 'updatedAt'> & { updatedAt?: string },
): TestnetProofFile {
  const next: TestnetProofFile = {
    ...patch,
    updatedAt: patch.updatedAt ?? new Date().toISOString(),
  };
  mkdirSync(getDataDir(), { recursive: true });
  writeFileSync(PROOF_PATH(), `${JSON.stringify(next, null, 2)}\n`);
  return next;
}
