import { formatUnits, parseGwei, stringToHex } from 'viem';
import { randomUUID } from 'node:crypto';
import { explorerTx, FAUCET_URL, SETTLE_NATIVE } from './config.js';
import { publicClient, walletClient } from './client.js';
import { loadAccount, loadSecret } from './keys.js';
import { writeTestnetProof } from './proof.js';

export class UnderfundedError extends Error {
  readonly address: string;
  constructor(address: string, balanceUsdc: string) {
    super(
      `Omnibus has ${balanceUsdc} USDC. Fund 20 USDC at ${FAUCET_URL} (Arc Testnet + USDC) for ${address}`,
    );
    this.address = address;
  }
}

export async function settleOnce(): Promise<{
  payoutId: string;
  hash: `0x${string}`;
  explorer: string;
}> {
  const omnibus = loadAccount('omnibus');
  const merchant = loadAccount('merchant');
  const client = publicClient();
  const balance = await client.getBalance({ address: omnibus.address });
  if (balance < SETTLE_NATIVE) {
    throw new UnderfundedError(
      omnibus.address,
      formatUnits(balance, 18),
    );
  }

  const payoutId = randomUUID();
  const wallet = walletClient(loadSecret('omnibus'));
  const hash = await wallet.sendTransaction({
    to: merchant.address,
    value: SETTLE_NATIVE,
    data: stringToHex(payoutId),
    maxFeePerGas: parseGwei('20'),
    maxPriorityFeePerGas: parseGwei('1'),
  });
  await client.waitForTransactionReceipt({ hash });
  writeTestnetProof({
    status: 'settled',
    omnibusAddress: omnibus.address,
    merchantAddress: merchant.address,
    payoutId,
    settlementTx: hash,
    faucetUrl: FAUCET_URL,
  });
  return { payoutId, hash, explorer: explorerTx(hash) };
}
