import './env.js';

export const XRPL_WSS =
  process.env.XRPL_WSS?.trim() || 'wss://s.altnet.rippletest.net:51233';
export const FAUCET_URL = 'https://faucet.altnet.rippletest.net/accounts';
export const EXPLORER = 'https://testnet.xrpl.org';
export const SETTLE_DROPS = '10000000'; // 10 XRP

export function explorerAccount(address: string): string {
  return `${EXPLORER}/accounts/${address}`;
}

export function explorerTx(hash: string): string {
  return `${EXPLORER}/transactions/${hash}`;
}
