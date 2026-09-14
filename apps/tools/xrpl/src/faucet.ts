import { Client } from 'xrpl';
import { XRPL_WSS } from './config.js';
import { loadWallet } from './keys.js';

export async function withClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client(XRPL_WSS);
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.disconnect();
  }
}

export async function fundIfNeeded(role: 'omnibus' | 'merchant'): Promise<void> {
  await withClient(async (client) => {
    const wallet = loadWallet(role);
    try {
      const info = await client.request({
        command: 'account_info',
        account: wallet.address,
        ledger_index: 'validated',
      });
      const drops = Number(info.result.account_data.Balance);
      if (drops > 10_000_000) return;
    } catch {
      // unfunded
    }
    await client.fundWallet(wallet);
  });
}
