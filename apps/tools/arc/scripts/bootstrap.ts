import { formatUnits } from 'viem';
import { explorerAccount, FAUCET_URL } from '../src/config.js';
import { loadDotenv } from '../src/env.js';
import {
  generateAndStoreKeys,
  persistStoredKeys,
  readStoredKeys,
} from '../src/keys.js';
import { publicClient } from '../src/client.js';
import { writeTestnetProof } from '../src/proof.js';

loadDotenv();

async function main() {
  const existing = readStoredKeys();
  const keys = existing ?? generateAndStoreKeys();
  if (existing) {
    persistStoredKeys(existing);
    console.log('Reusing keys.');
  } else {
    console.log('New keys in keys/ and .env.');
  }

  console.log('');
  console.log('Omnibus', keys.omnibus.address);
  console.log(explorerAccount(keys.omnibus.address));
  console.log('Merchant', keys.merchant.address);
  console.log(explorerAccount(keys.merchant.address));

  writeTestnetProof({
    status: 'pending',
    omnibusAddress: keys.omnibus.address,
    merchantAddress: keys.merchant.address,
    faucetUrl: FAUCET_URL,
  });

  const client = publicClient();
  const balance = await client.getBalance({ address: keys.omnibus.address });
  console.log('');
  console.log(`Native USDC ${formatUnits(balance, 18)}`);
  if (balance === 0n) {
    console.log('');
    console.log(`Fund 20 USDC at ${FAUCET_URL}`);
    console.log('Network: Arc Testnet. Token: USDC.');
    console.log(keys.omnibus.address);
    console.log('Then: pnpm settle');
    return;
  }
  console.log('Then: pnpm settle');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
