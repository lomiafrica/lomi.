import { defineChain, parseUnits } from 'viem';
import './env.js';

export const SETTLE_USDC = 10n;
export const SETTLE_NATIVE = parseUnits('10', 18);
export const FAUCET_URL = 'https://faucet.circle.com';
export const EXPLORER = 'https://testnet.arcscan.app';

export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        process.env.ARC_RPC_URL?.trim() || 'https://rpc.testnet.arc.network',
      ],
    },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: EXPLORER },
  },
  testnet: true,
});

export function explorerAccount(address: string): string {
  return `${EXPLORER}/address/${address}`;
}

export function explorerTx(hash: string): string {
  return `${EXPLORER}/tx/${hash}`;
}
