# lomi. Embed Checkout

Embed hosted checkout on the merchant site with `@lomi./embed`.

## Install

```bash
npm install @lomi./embed
```

## Create a session server-side

```typescript
const session = await lomiApi.createCheckoutSession({
  success_url: 'https://your-site.com/success',
  cancel_url: 'https://your-site.com/cancel',
  amount: 10000,
  currency_code: 'XOF',
});
// Pass session.checkout_url to the browser
```

Or run `lomi checkout create` for a test URL and embed snippet.

## Modal (recommended)

```javascript
import { loadLomiCheckout } from '@lomi./embed';

loadLomiCheckout({
  checkoutUrl: session.checkout_url,
  mode: 'modal',
  onComplete: (payload) => {
    console.log(payload.transactionId);
  },
});
```

## Inline

```html
<div id="lomi-checkout" data-lomi-checkout-url="CHECKOUT_URL"></div>
<script type="module">import '@lomi./embed';</script>
```

## Rules

- Do **not** append `embedded=true` or `embed_origin`: the SDK adds them.
- Do **not** use a CDN, host `node_modules/@lomi./embed/dist/lomi.js` or use npm + bundler.
- Reconcile with webhooks; `onComplete` is UX only.
- Docs: https://docs.lomi.africa/build/accept/embed-widget
