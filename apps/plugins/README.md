# lomi. Plugins

Welcome to the central folder for **lomi.** payment plugins inside the [lomi. monorepo](https://github.com/lomiafrica/lomi.).

This is the entry point for e-commerce integrations (WooCommerce, PrestaShop, Magento, Shopify, etc.) and reference apps that demonstrate the lomi. API.

## Repository layout

### Platform plugins (Git submodules)

Each platform plugin is its own repository, registered as a submodule under `apps/plugins/` in the root monorepo:

| Directory | Platform | Submodule repo | Access |
| --- | --- | --- | --- |
| [woo](./woo) | WooCommerce | [lomiafrica/woo](https://github.com/lomiafrica/woo) | Public |
| [prestashop](./prestashop) | PrestaShop | [lomiafrica/prestashop](https://github.com/lomiafrica/prestashop) | Public |
| [magento](./magento) | Adobe Commerce (Magento 2) | [lomiafrica/magento](https://github.com/lomiafrica/magento) | Public |
| [shopify](./shopify) | Shopify | [lomiafrica/shopify](https://github.com/lomiafrica/shopify) | Private (org access required) |
| [bubble](./bubble) | Bubble.io | [lomiafrica/bubble](https://github.com/lomiafrica/bubble) | Private (org access required) |

Initialize a plugin from the monorepo root, for example:

```bash
git submodule update --init apps/plugins/woo
```

### Integration references

Runnable examples for merchants and partners live under [`references/`](./references):

- **[direct-charge-integration-reference](./references/direct-charge-integration-reference)**: Direct charges (`POST /charge/*`) with Payment Elements for cards.
- **[payment-integration-sdk-reference](./references/payment-integration-sdk-reference)**: Hosted checkout sessions with `@lomi./sdk` and `@lomi./embed`.

### Local dev stacks (per platform repo)

Each platform keeps its own Docker/dev tooling in its submodule — not in this folder:

| Platform | Dev stack | Merchant docs |
| --- | --- | --- |
| WooCommerce | [woo/dev](./woo/dev/docker-compose.yml) | [docs.lomi.africa](https://docs.lomi.africa/build/ecommerce-extensions/woocommerce) |
| PrestaShop | [prestashop/docker-compose.yml](./prestashop/docker-compose.yml) | [docs.lomi.africa](https://docs.lomi.africa/build/ecommerce-extensions/prestashop) |
| Magento | [magento/dev](./magento/dev) | [docs.lomi.africa](https://docs.lomi.africa/build/ecommerce-extensions/magento) |
| Shopify | [shopify](./shopify) README | [docs.lomi.africa](https://docs.lomi.africa/build/ecommerce-extensions/shopify) |

Use **lomi. sandbox** keys and a **Cloudflare Tunnel** (or ngrok) for webhook testing. Never commit API keys or webhook secrets.

## Installation and cloning

Clone the lomi. monorepo and initialize the plugin submodules you need:

```bash
git clone https://github.com/lomiafrica/lomi./
cd lomi.
git submodule update --init apps/plugins/woo apps/plugins/prestashop apps/plugins/magento
```

For all platform plugins (including private repos you have access to):

```bash
git submodule update --init apps/plugins/woo apps/plugins/prestashop apps/plugins/magento apps/plugins/shopify apps/plugins/bubble
```

If a submodule fails with "repository not found", that platform repo is private — request access from the lomi. team or configure `REPO_CHECKOUT_PAT` in CI. WooCommerce, PrestaShop, and Magento submodules are public.

### Bubble / Shopify (private submodules)

| Check | When submodule missing | When checked out |
| --- | --- | --- |
| `verify-lomi-plugins.sh` | Skips Bubble/Shopify sections | Full parity |
| `test_bubble_json.mjs` | Skips with message | Parses all `*.json` |
| `app-ci-bubble.yml` | Warns and skips job steps | Parity + embed build + optional API smoke |
| API smoke (`smoke-test.mjs`) | N/A | Runs when `LOMI_SECRET_KEY` secret is set; otherwise prints skip message |

PRs that only touch public plugin submodules do not require Bubble checkout. Bubble-specific CI runs on `apps/plugins/bubble/**` changes via `.github/workflows/app-ci-bubble.yml`.

## Automated tests

- **[E2E.md](./E2E.md)**: Manual fresh-install matrix (dashboard credentials only).
- **[scripts/run-plugin-tests.sh](./scripts/run-plugin-tests.sh)**: CI suite — static parity, webhook contract, Bubble JSON, Woo build + release zip.
- **[scripts/verify-lomi-plugins.sh](./scripts/verify-lomi-plugins.sh)**: Static compliance gate (step 1 of `run-plugin-tests.sh`).
- **[scripts/scan_broken_images.py](./scripts/scan_broken_images.py)**: Scans Magento, PrestaShop, and Woo for broken image path references.
- **[scripts/check-ecommerce-hosts.sh](./scripts/check-ecommerce-hosts.sh)**: Live host probe (API, docs Woo zip, plugin GitHub pages). Shopify `/health` is a warning until `connect.lomi.africa` is live; pass `--strict-shopify` after DNS + Vercel.

```bash
cd apps/plugins
./scripts/run-plugin-tests.sh          # full suite
./scripts/run-plugin-tests.sh --fast   # static checks only
```

Requires Node 22+, pnpm 9+, `unzip`.

## Contributing

- **Platform plugin changes**: work inside the relevant submodule, push to that submodule's repo, then update the submodule pointer in the monorepo root if needed.
- **Reference app or shared script changes**: edit files under `references/` or `scripts/`.
- Run `./scripts/run-plugin-tests.sh` before opening a PR (`--fast` if Woo assets are unchanged).

## License

Licensing is per platform. Check each submodule's README and license files (for example, Magento includes a root `LICENSE`). Reference projects in this repo follow the license stated in their respective directories.
