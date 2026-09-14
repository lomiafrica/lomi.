import { explorerAccount } from '../src/config.js';
import { loadDotenv } from '../src/env.js';
import { fundIfNeeded } from '../src/faucet.js';
import {
  generateAndStoreKeys,
  persistStoredKeys,
  readStoredKeys,
} from '../src/keys.js';
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

  await fundIfNeeded('omnibus');
  await fundIfNeeded('merchant');

  writeTestnetProof({
    status: 'pending',
    omnibusAddress: keys.omnibus.address,
    merchantAddress: keys.merchant.address,
  });

  console.log('');
  console.log('Omnibus', keys.omnibus.address);
  console.log(explorerAccount(keys.omnibus.address));
  console.log('Merchant', keys.merchant.address);
  console.log(explorerAccount(keys.merchant.address));
  console.log('Then: pnpm settle');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
