import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.env.ZCASH_APP_ROOT ?? process.cwd();
const DATA = join(ROOT, 'data');

export type HopProof = {
  status: 'pending' | 'shielded';
  reason: string;
  officialApply: string;
  neverUse: string;
  updatedAt: string;
  txid?: string;
};

function whichCli(): string | null {
  const fromEnv = process.env.ZCASH_CLI?.trim();
  if (fromEnv) return fromEnv;
  for (const name of ['zcash-cli', 'zcashd-cli']) {
    const found = spawnSync('which', [name], { encoding: 'utf8' });
    if (found.status === 0 && found.stdout.trim()) return found.stdout.trim();
  }
  return null;
}

function writeProof(proof: HopProof): void {
  mkdirSync(DATA, { recursive: true });
  writeFileSync(
    join(DATA, 'testnet-proof.json'),
    `${JSON.stringify(proof, null, 2)}\n`,
  );
}

export function runHop(): HopProof {
  const officialApply =
    'https://github.com/ZcashCommunityGrants/zcashcommunitygrants/issues/new?template=grant_application.yaml';
  const neverUse = 'https://zcashgranthub.vercel.app/apply';
  const cli = whichCli();
  if (!cli) {
    const proof: HopProof = {
      status: 'pending',
      reason:
        'No zcash-cli on PATH. Shielded testnet hop not run. Do not file ZCG until pnpm hop writes status=shielded.',
      officialApply,
      neverUse,
      updatedAt: new Date().toISOString(),
    };
    writeProof(proof);
    return proof;
  }

  const ping = spawnSync(cli, ['-testnet', 'getinfo'], { encoding: 'utf8' });
  if (ping.status !== 0) {
    const proof: HopProof = {
      status: 'pending',
      reason: `zcash-cli present (${cli}) but testnet RPC failed: ${ping.stderr || ping.stdout}`.trim(),
      officialApply,
      neverUse,
      updatedAt: new Date().toISOString(),
    };
    writeProof(proof);
    return proof;
  }

  const proof: HopProof = {
    status: 'pending',
    reason:
      'zcash-cli is reachable but this lab does not auto-send shielded funds. Receive on a unified testnet address, send a memo=payout_id hop, then record txid here.',
    officialApply,
    neverUse,
    updatedAt: new Date().toISOString(),
  };
  writeProof(proof);
  return proof;
}
