import {
  createPublicClient,
  createWalletClient,
  http,
  type Hex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arcTestnet } from './config.js';

export function publicClient() {
  return createPublicClient({
    chain: arcTestnet,
    transport: http(),
  });
}

export function walletClient(secret: Hex) {
  return createWalletClient({
    account: privateKeyToAccount(secret),
    chain: arcTestnet,
    transport: http(),
  });
}
