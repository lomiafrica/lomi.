# arc

Testnet lab from [lomi.](https://lomi.africa) for a custodial USDC hop on Circle Arc.

Same contract as the Stellar lab: omnibus wallet, `payout_id` in tx data, last mile stays Wave/MTN/SPI. Merchants never hold keys. Not wired to `apps/api`. Do not add `rail: arc` until a grant is real.

Circle 1-pager (gitignored, portal closed): `apps/tools/stellar/.scf/grants/CIRCLE-ARC-ONEPAGER.md`

**Payout mapping:** [docs/LOMI-INTEGRATION-CONTRACT.md](./docs/LOMI-INTEGRATION-CONTRACT.md)

## Setup

```bash
pnpm install --ignore-workspace
cp .env.example .env
pnpm bootstrap
```

Circle faucet needs a human (reCAPTCHA): [faucet.circle.com](https://faucet.circle.com) → Arc Testnet → USDC → omnibus address (printed by bootstrap). Then:

```bash
pnpm settle
pnpm proof
```

Chain `5042002`. RPC `https://rpc.testnet.arc.network`. Explorer [testnet.arcscan.app](https://testnet.arcscan.app). Native gas is USDC (18 decimals). Hop is 10 native USDC with `payout_id` in calldata.

Current testnet accounts (faucet still required):

- Omnibus: `0xA4a07c023C9f412b4F991dC5AFba9137D856529B`
- Merchant: `0xbff6064594AB0D037214C22cfdf708d962d6f365`

Do not send mainnet USDC to these addresses.
