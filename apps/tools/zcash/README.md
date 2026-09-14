# zcash

Sanity check for a **shielded** Zcash testnet hop before any ZCG filing.

Official apply (GitHub issue, then forum):

- https://zcashcommunitygrants.org/
- https://github.com/ZcashCommunityGrants/zcashcommunitygrants/issues/new?template=grant_application.yaml
- https://forum.zcashcommunity.com/c/grants/33

**Never** log into https://zcashgranthub.vercel.app (community wrapper, not the committee door).

This lab does not talk to `apps/api`. Do not add a ZEC rail until a grant is real and a shielded hop is in `data/testnet-proof.json` with `status: shielded`.

## Setup

```bash
pnpm install --ignore-workspace
pnpm hop
```

`pnpm hop` looks for `zcash-cli` (or `ZCASH_CLI`). If it is missing or testnet RPC is down, proof stays `pending` and you **do not file**.

Drafts to paste (gitignored): `apps/tools/stellar/.scf/grants/ZCG-GITHUB-PASTE.md` and `ZCG-FORUM-PASTE.md`.
