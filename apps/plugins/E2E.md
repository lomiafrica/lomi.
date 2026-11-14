# Plugin E2E manual test matrix

Fresh-install checklist for each platform plugin using **only** credentials from [dashboard.lomi.africa](https://dashboard.lomi.africa) (test secret key + webhook signing secret).

Run static checks first:

```bash
cd apps/plugins
./scripts/verify-lomi-plugins.sh
```

## Shared prerequisites

| Item | Source |
| --- | --- |
| Test secret key | Dashboard → Developers → API keys (`lomi_sk_test_…`) |
| Webhook signing secret | Dashboard → Developers → Webhooks (`whsec_…`) |
| Sandbox API | `https://sandbox.api.lomi.africa` (selected by test key) |
| Webhook events | `PAYMENT_SUCCEEDED`, `REFUND_COMPLETED` |

## WooCommerce

1. Install and activate **lomi. for WooCommerce** ([docs](https://docs.lomi.africa/build/ecommerce-extensions/woocommerce)).
2. **WooCommerce → Settings → Payments → lomi.**: enable, **Test mode** on, paste test key + test webhook secret.
3. Confirm **Setup health**: API key configured, `GET /me` succeeded, currency XOF/USD/EUR.
4. Copy webhook URL into dashboard; enable events; paste signing secret back into WooCommerce.
5. Place a sandbox order (e.g. 100 XOF); complete payment on hosted checkout.
6. Order status **Processing** or **Completed**; webhook delivery visible in dashboard.

## Magento 2

1. Install **Lomi_Payments** ([docs](https://docs.lomi.africa/build/ecommerce-extensions/magento)).
2. **Stores → Configuration → Sales → Payment Methods → lomi.**: enable, **Test mode** on, paste test/live keys and webhook secrets.
3. Confirm **Setup health** panel: API connection `GET /me` succeeded.
4. Register webhook URL (`/lomi/payment/webhook`) in dashboard.
5. Place test order; pay on hosted checkout; order moves to paid state.

## PrestaShop

1. Upload and enable the **lomi.** module ([docs](https://docs.lomi.africa/build/ecommerce-extensions/prestashop)).
2. **Modules → lomi. → Configure**: **Test mode** on, paste test key + webhook secret.
3. Confirm **Setup health** panel (API key, currency, `GET /me`, webhook URL).
4. Create dashboard webhook with module URL; enable `PAYMENT_SUCCEEDED`.
5. Checkout with **Pay with lomi.**; confirm order after sandbox payment.

## Shopify

1. Install via dashboard → **Payment channels → Integrations** ([docs](https://docs.lomi.africa/build/ecommerce-extensions/shopify)).
2. App **Settings**: paste **test** secret key + matching webhook secret.
3. Confirm **Setup health**: test mode (sandbox), `GET /me` succeeded.
4. Add **Pay with lomi.** block on cart theme.
5. Cart pay → hosted checkout → draft order completed on `PAYMENT_SUCCEEDED`.

## Bubble

1. Install **lomi.** plugin in Bubble editor ([docs](https://docs.lomi.africa/build/ecommerce-extensions/bubble)).
2. **Plugins → lomi.**: Development API key + webhook secret (test values).
3. Run **Test API connection** action: `ok` true, `environment` test, `webhook_secret_configured` true.
4. On **Create checkout session**, set `bubble_thing_type` (e.g. `Order`) and `bubble_thing_id` (unique Thing id). These land in session `metadata` so webhooks can update the correct record.
5. Create checkout session and complete sandbox payment; mark Thing paid on `PAYMENT_SUCCEEDED` (idempotent: safe if webhook retries).

**Metadata contract:** `bubble_thing_id`, `bubble_thing_type`, and `bubble_page` are stored on every session. Webhook handlers should read them from parsed metadata and only update the Thing when status is not already paid.

## Pass criteria

- Setup health (or Bubble test connection) green for API key and `GET /me`
- Test payment completes on hosted checkout
- Store/order state updates without manual API calls
- Misconfigured key shows actionable error (not raw HTTP status only)

## Troubleshooting

- **401 on API**: wrong key for environment; use test key with test mode / Development keys in Bubble.
- **Webhook not firing**: URL mismatch, wrong signing secret, or missing `PAYMENT_SUCCEEDED` subscription.
- **Currency errors**: shop currency must be XOF, USD, EUR, GBP, CAD, XAF, GHS, KES, MAD, or ZAR.

Docs hub: [E-commerce extensions](https://docs.lomi.africa/build/ecommerce-extensions)
