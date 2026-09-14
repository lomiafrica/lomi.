# @lomi./embed

Embed lomi. checkout on your site via iframe, modal overlay or inline container.

## Install

```bash
npm install @lomi./embed
```

## Prerequisites

Create a checkout session on your server (or use a payment link URL), then pass the returned `checkout_url` to the embed SDK:

```bash
curl -X POST https://api.lomi.africa/checkout-sessions \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "currency": "XOF", "success_url": "https://yoursite.com/success"}'
```

The SDK adds `embedded=true` and `embed_origin` automatically, do not append them yourself.

## Modal (bundler)

```javascript
import { loadLomiCheckout } from "@lomi./embed";

document.getElementById("pay").addEventListener("click", () => {
  loadLomiCheckout({
    checkoutUrl: "https://checkout.lomi.africa/checkout/cs_...",
    mode: "modal",
    onComplete: (payload) => {
      console.log("Paid:", payload.transactionId);
    },
  });
});
```

## Inline

```html
<div
  id="lomi-checkout"
  data-lomi-checkout-url="https://checkout.lomi.africa/checkout/cs_..."
></div>
<script type="module">
  import "@lomi./embed";
</script>
```

Or with session id + base URL (no full URL):

```html
<div
  id="lomi-checkout"
  data-lomi-session-id="cs_..."
  data-lomi-checkout-base-url="https://checkout.lomi.africa"
></div>
```

## Self-hosted script (no bundler)

Copy `node_modules/@lomi./embed/dist/lomi.js` to your static assets and load it:

```html
<script src="/assets/lomi.js"></script>
<script>
  window.Lomi.loadLomiCheckout({
    checkoutUrl: "https://checkout.lomi.africa/checkout/cs_...",
    mode: "modal",
    onComplete: (p) => console.log(p),
  });
</script>
```

There is no CDN, host the file yourself or use npm + your bundler.

## Options

| Option            | Required            | Description                                     |
| ----------------- | ------------------- | ----------------------------------------------- |
| `checkoutUrl`     | Preferred           | Full URL from API or payment link               |
| `sessionId`       | If no `checkoutUrl` | Checkout session id                             |
| `checkoutBaseUrl` | With `sessionId`    | Defaults to `https://checkout.lomi.africa`      |
| `publicKey`       | Optional            | Not required when using `checkoutUrl`           |
| `mode`            | No                  | `modal` (default) or `inline`                   |
| `elementId`       | Inline              | DOM id of container (default: `#lomi-checkout`) |
| `onComplete`      | No                  | Fired when payment succeeds                     |
| `onResize`        | No                  | Iframe height changes (inline)                  |
| `onError`         | No                  | Checkout errors                                 |

## Events

The iframe posts `LOMI_CHECKOUT` messages to the parent. Legacy types (`LOMI_CHECKOUT_COMPLETE`, `LOMI_RESIZE`) are also handled.

`onComplete` receives:

```typescript
{
  type: 'LOMI_CHECKOUT_COMPLETE';
  sessionId?: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
  hasDigitalDeliverables?: boolean;
}
```

Messages from origins other than the checkout host are ignored.

## Webhooks

Embed completion callbacks are for UX only. Reconcile payments with [webhooks](https://docs.lomi.africa/build/reliability).

## Sandbox / local dev

Point at a local checkout app:

```javascript
loadLomiCheckout({
  checkoutUrl: "http://localhost:3000/checkout/cs_test_...",
  mode: "modal",
});
```

Or override the base URL when using `sessionId`:

```javascript
loadLomiCheckout({
  sessionId: "cs_test_...",
  checkoutBaseUrl: "http://localhost:3000",
  mode: "inline",
  elementId: "lomi-checkout",
});
```

## Testing

Manual checklist:

1. Run checkout app locally and a merchant HTML page importing `@lomi./embed`
2. `lomi checkout create` → paste embed snippet → modal opens
3. Sandbox Wave/MTN: pay → parent receives `onComplete` with `transactionId`
4. Free checkout (zero amount): parent notified without broken redirect
5. Wrong-origin postMessages are ignored
6. `npm test` in this package; `tsc --noEmit` in checkout app

## Docs

Full guide: [Embed checkout widget](https://docs.lomi.africa/build/accept/embed-widget)

## License

MIT
