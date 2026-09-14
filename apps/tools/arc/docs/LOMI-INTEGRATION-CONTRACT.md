# lomi. payout mapping (Arc lab)

Mirrors [stellar LOMI-INTEGRATION-CONTRACT.md](../../stellar/docs/LOMI-INTEGRATION-CONTRACT.md). Isolated testnet only. No `apps/api`, no merchant keys, no USDC on merchant `accounts`.

| Lab | Production analogue |
| --- | --- |
| Omnibus EOA | Custodial treasury |
| Merchant EOA | Internal receive address (not a merchant wallet product) |
| Native USDC transfer, 10 units | Correspondent hop |
| Calldata = `payout_id` UUID | Stellar memo / XRPL DestinationTag |
| `data/testnet-proof.json` | Future webhook `arc_transaction_id` |
| Mock last mile | Wave / MTN / SPI |

USDC is not a merchant `currency_code` today. There is no `rail: 'arc'` on the live API.
