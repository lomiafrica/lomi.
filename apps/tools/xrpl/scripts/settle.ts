import { loadDotenv } from '../src/env.js';
import { settleOnce } from '../src/settle.js';

loadDotenv();

async function main() {
  const result = await settleOnce();
  console.log(result.payoutId);
  console.log(`DestinationTag ${result.destinationTag}`);
  console.log(result.explorer);
  console.log('Then: pnpm proof');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
