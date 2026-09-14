import { explorerAccount, explorerTx } from '../src/config.js';
import { loadDotenv } from '../src/env.js';
import { readTestnetProof } from '../src/proof.js';

loadDotenv();

function main() {
  const proof = readTestnetProof();
  if (!proof) {
    console.log('No proof yet. Run pnpm bootstrap.');
    process.exit(1);
  }
  console.log(proof.status);
  console.log(explorerAccount(proof.omnibusAddress));
  console.log(explorerAccount(proof.merchantAddress));
  if (proof.settlementTx) {
    console.log(explorerTx(proof.settlementTx));
    if (proof.payoutId) console.log(proof.payoutId);
    if (proof.destinationTag != null) {
      console.log(`DestinationTag ${proof.destinationTag}`);
    }
    return;
  }
  console.log('PENDING settle. Run pnpm settle.');
  process.exitCode = 1;
}

main();
