# Plugin downloads (docs.lomi.africa)

Merchant-facing zips served at `/downloads/*`: linked from docs, **not** from GitHub.

## woo-lomi.zip

| Field       | Value                                                                              |
| ----------- | ---------------------------------------------------------------------------------- |
| File        | `woo-lomi.zip`                                                                     |
| Version     | 1.003.1                                                                            |
| Source      | `apps/plugins/woo` after `pnpm run build && pnpm run i18n && ./scripts/release.sh` |
| Docs button | [WooCommerce guide](/build/ecommerce-extensions/woocommerce)                       |

### Verify before opening a docs PR

From `apps/docs`:

```bash
pnpm lint && pnpm docs:drift && pnpm screenshots:verify
```

`screenshots:verify` checks that each docs WebP is 1280×720.

```bash
cd apps/plugins/woo
pnpm install --frozen-lockfile
pnpm run build && pnpm run i18n
./scripts/release.sh
cp dist/woo-lomi.zip ../../docs/public/downloads/woo-lomi.zip
```

Or after CI tag `woo-v*` on the monorepo, copy the release asset here so merchants always download from docs.

### CI (future)

On `woo-v*` release, upload the same artifact to docs CDN / `public/downloads/`.
