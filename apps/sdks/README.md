# lomi. SDKs

Official SDKs mirror the **same public merchant routes** as documented: they are generated from [`apps/docs/openapi.json`](../docs/openapi.json) and the strict allowlist [`apps/docs/lib/scripts/manual-api/_expected-public-operations.json`](../docs/lib/scripts/manual-api/_expected-public-operations.json).

| Language/Framework      | Package                             | Installation                               | Directory                     |
| ----------------------- | ----------------------------------- | ------------------------------------------ | ----------------------------- |
| **TypeScript**          | `@lomi./sdk`                        | `npm install @lomi./sdk`                   | [`ts/`](./ts)                 |
| **Embedded Checkout**   | `@lomi./embed`                      | `npm install @lomi./embed`                 | [`embed/`](./embed)           |
| **Python**              | `lomi-sdk`                          | `pip install lomi-sdk`                     | [`python/`](./python)         |
| **Go**                  | `github.com/lomiafrica/lomi-go-sdk` | `go get github.com/lomiafrica/lomi-go-sdk` | [`go/`](./go)                 |
| **PI-SPI (TypeScript)** | `pi-spi-sdk`                        | `npm install pi-spi-sdk`                   | [`pi-spi-sdk/`](./pi-spi-sdk) |

### PHP SDK

Due to our monorepo structure, the PHP SDK is **not available on Packagist**. Install directly from GitHub:

```json
{
  "repositories": [
    {
      "type": "vcs",
      "url": "https://github.com/lomiafrica/lomi./"
    }
  ],
  "require": {
    "lomi/lomi-sdk": "dev-main#apps/sdks/php"
  }
}
```

Then run: `composer install`

## Quick Start

### TypeScript / JavaScript

```typescript
import { LomiSDK } from '@lomi./sdk';

const lomi = new LomiSDK({
  apiKey: 'your-api-key',
  environment: 'live' // or 'test' for sandbox
});

// List customers
const customers = await lomi.customers.list();

// Create checkout session
const session = await lomi.checkoutSessions.create({...});

// Get transactions
const transactions = await lomi.transactions.list();
```

### Python

```python
from lomi import LomiClient

client = LomiClient(api_key='your-api-key')

# List customers (optional filters)
customers = client.customers.list(params={"page": "1"})

# Checkout sessions (snake_case client attributes)
sessions = client.checkout_sessions.list()

# Wave charge
result = client.charges.create_wave_charge(body={"amount": 5000})
```

### Go

```go
import lomi "github.com/lomiafrica/lomi-go-sdk"

client := lomi.NewClient("your-api-key")

customers, err := client.Customers.List(map[string]string{"page": "1"})
if err != nil {
	panic(err)
}
txn, err := client.Transactions.Get("txn_id")
_, _ = txn, err

_, err = client.Charges.CreateWaveCharge(map[string]interface{}{
	"amount": 1000,
})
```

### PHP

```php
use Lomi\LomiClient;

$client = new LomiClient('your-api-key');

$session = $client->checkoutSessions->create(['amount' => 5000]);
$charge = $client->charges->createCardCharge(['amount' => 1000, 'currency_code' => 'XOF']);
```

## Available services

All SDKs provide access to these services:

- `accounts` - Balance and account operations
- `charges` - Wave, MTN, and embedded card charges (`/charge/*`)
- `organizations` - Organization metrics (MRR, ARR, etc.)
- `customers` - Customer management
- `paymentRequests` - Payment requests
- `transactions` - Transaction history
- `refunds` - Refund processing
- `products` - Product catalog
- `subscriptions` - Subscription billing
- `coupons` - Coupon management
- `checkoutSessions` - Checkout creation
- `paymentLinks` - Payment links
- `payouts` - Payouts (self withdrawals and beneficiary payouts via `destination`)
- `merchants` - Partner/sub-merchant metrics
- `providers` - Enabled payment providers
- `usage` - Usage events, entitlements, and metered billing
- `webhooks` - Webhook configuration and delivery logs

## Documentation

For comprehensive API documentation and guides, visit [docs.lomi.africa](https://docs.lomi.africa)

## License

MIT - see [LICENSE](./LICENSE) for details.

## Support

- **Email:** hello@lomi.africa
- **Docs:** https://docs.lomi.africa
- **Discord:** https://discord.gg/yb4FnBmh
