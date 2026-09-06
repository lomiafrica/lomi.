# lomi. e-commerce extensions

Official store plugins create hosted checkout sessions and handle webhooks for you. Prefer a plugin when the merchant runs a supported platform.

## Supported platforms

| Platform | Docs | Repo |
| --- | --- | --- |
| WooCommerce | https://docs.lomi.africa/build/ecommerce-extensions/woocommerce | https://github.com/lomiafrica/woo |
| Magento 2 | https://docs.lomi.africa/build/ecommerce-extensions/magento | https://github.com/lomiafrica/magento |
| PrestaShop | https://docs.lomi.africa/build/ecommerce-extensions/prestashop | https://github.com/lomiafrica/prestashop |
| Shopify | https://docs.lomi.africa/build/ecommerce-extensions/shopify | https://github.com/lomiafrica/shopify |
| Bubble | https://docs.lomi.africa/build/ecommerce-extensions/bubble | https://github.com/lomiafrica/bubble |

Hub: https://docs.lomi.africa/build/ecommerce-extensions

## Shared contract

- **Auth**: merchant secret key (`lomi_sk_test_…` / `lomi_sk_live_…`) in `X-API-Key`
- **Create session**: `POST /checkout-sessions`
- **Confirm**: `GET /checkout-sessions/{id}` until `status` is `completed`
- **Webhooks**: `PAYMENT_SUCCEEDED`, `REFUND_COMPLETED` with `X-Lomi-Signature` (HMAC-SHA256 hex over raw body)
- **Test vs live**: the API key selects sandbox (`sandbox.api.lomi.africa`) vs live (`api.lomi.africa`)

## When not to use a plugin

- Custom site or landing page → [embed widget](https://docs.lomi.africa/build/embed-widget)
- Your own checkout UI → SDK + hosted checkout or [direct charges](https://docs.lomi.africa/build/accept/direct-charges)
- Terminal or agent workflows → CLI (`lomi checkout create`) or [MCP](https://docs.lomi.africa/build/mcp)
- Hosted product catalog without a third-party store → [Products](https://docs.lomi.africa/build/products) + store.lomi.africa

## Merchant setup checklist

1. Create API keys in [dashboard.lomi.africa](https://dashboard.lomi.africa) → Developers → API keys
2. Add webhook endpoint with signing secret → Developers → Webhooks
3. Install the platform plugin and paste test keys + webhook secret
4. Run a sandbox payment (e.g. 100 XOF) before switching to live keys
