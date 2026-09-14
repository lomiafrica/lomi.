import { loadDotenv } from '../src/env.js';
import { UnderfundedError, settleOnce } from '../src/settle.js';

loadDotenv();

async function main() {
  const result = await settleOnce();
  console.log(result.payoutId);
  console.log(result.explorer);
  console.log('Then: pnpm proof');
}

main().catch((err) => {
  if (err instanceof UnderfundedError) {
    console.error(err.message);
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});
