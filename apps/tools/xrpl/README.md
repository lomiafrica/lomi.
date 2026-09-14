# xrpl

Testnet lab from [lomi.](https://lomi.africa) for a tagged XRPL Payment.

Same contract as the Stellar lab: custodial omnibus, `DestinationTag` plus memo = `payout_id`, last mile stays Wave/MTN/SPI. Merchants never hold keys. Not wired to `apps/api`. Do not add `rail: xrpl` until a grant is real.

RippleX intake paste (gitignored): `apps/tools/stellar/.scf/grants/RIPPLEX-INTAKE-PASTE.md`

**Payout mapping:** [docs/LOMI-INTEGRATION-CONTRACT.md](./docs/LOMI-INTEGRATION-CONTRACT.md)

## Setup

```bash
pnpm install --ignore-workspace
cp .env.example .env
pnpm bootstrap
pnpm settle
pnpm proof
```

Bootstrap uses the XRPL Testnet faucet (`https://faucet.altnet.rippletest.net/accounts`). Settle submits 10 XRP omnibus → merchant with `DestinationTag` = first 32 bits of sha256(`payout_id`) and MemoData = the UUID.

Explorer: [testnet.xrpl.org](https://testnet.xrpl.org)

Current testnet accounts:

- Omnibus: `rGXEzo42vrv2skGp9KkJS4mr3u4APqSkha`
- Merchant: `rJSZYQmB7KFryR5Xs3wXV38KYnNnyX3FGN`

Settled hop: [8DD8D6B11B8E8E35176CF587764647DE825CD14D10D0FFD6B626745ACC853D4F](https://testnet.xrpl.org/transactions/8DD8D6B11B8E8E35176CF587764647DE825CD14D10D0FFD6B626745ACC853D4F)

Do not send mainnet XRP to these addresses.
