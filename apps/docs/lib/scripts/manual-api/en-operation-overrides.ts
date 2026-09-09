/* @proprietary license */

/**
 * English summary/body for hand-authored REST MDX (`*.mdx` without `.fr`).
 * OpenAPI summaries/descriptions are often French-only; `.fr.mdx` stays the source from spec.
 *
 * Style guide: `DOC-STYLE-CONTRACT.md`
 */
export type EnOperationOverride = {
  /** First line under Overview (+ YAML title when bootstrapping EN pages) */
  summary: string;
  /** Optional paragraph after the summary (YAML description uses summary if omitted here) */
  body?: string;
  /** Job-to-be-done: when an integrator should choose this endpoint */
  whenToUse?: string;
  /** Async behavior, retries, provider or compliance caveats */
  caveats?: string;
  /** Markdown links to related guides or REST pages (trusted repo content) */
  related?: string;
  /** English request-body intro when OpenAPI description is French-only */
  requestBodyIntro?: string;
};

/** Full coverage for all public merchant operations in `openapi.json` (enforced by verify script). */
export const EN_OPERATION_COPY = {
  AccountsController_checkAvailableBalance: {
    summary: 'Check available balance',
    body: 'Checks whether sufficient funds exist in the requested currency before you move money out or reserve balance.',
    whenToUse:
      'Call before initiating a payout, beneficiary payout, or any flow where you must guarantee spendable balance.',
    related:
      '[Account balances](/api/balances/AccountsController_getBalance) · [Payouts](/api/payouts/PayoutsUnifiedController_create)',
  },
  AccountsController_getBalance: {
    summary: 'Account balances',
    body: 'Returns current balances across currencies; optionally filter to one currency for simpler UI.',
    whenToUse:
      'Use for wallet surfaces, “available funds” displays, or pre-checking balances without fetching every account object.',
  },
  AccountsController_getBalanceBreakdown: {
    summary: 'Balance breakdown',
    body: 'Returns balance components (available, pending, totals) and may convert amounts into a target currency for reporting.',
    whenToUse:
      'Use when finance or support teams need a split between pending and available, not just a single number.',
  },
  ChargesController_createWaveCharge: {
    summary: 'Create direct mobile-money charge',
    body: 'Starts a payer-facing mobile-money charge on a supported rail; the response includes the next step for the customer. Check **`next_action`** (`redirect` with `url`) in addition to `wave_launch_url` / `checkout_url`.',
    whenToUse:
      'Use for server-initiated mobile-money collection when you are **not** using a hosted checkout session.',
    caveats:
      'Follow the provider instructions in the response; UX is rail-specific (USSD, app redirect, etc.).',
    related:
      '[Mobile money](/build/mobile-money) · [Direct charges](/build/accept/direct-charges) · [Create checkout session](/api/checkout-sessions/CheckoutSessionsController_create) · [Transactions](/api/transactions/TransactionsController_findAll)',
  },
  ChargesController_createMtnCharge: {
    summary: 'Create MTN charge',
    body: 'Starts a payer-facing MTN RequestToPay charge. With a **test** API key the transaction completes in the ledger without calling the MTN sandbox. Responses include **`next_action`** (`await_webhook` with `status`) alongside `data.status`.',
    whenToUse:
      'Use for server-initiated MTN collection when you are **not** using a hosted checkout session.',
    caveats:
      'Live charges require MTN connected for your organization and a valid MSISDN. Refunds on live MTN payments use the Disbursement refund API via [Create refund](/api/refunds/RefundsController_create).',
    related:
      '[Mobile money](/build/mobile-money) · [Direct charges](/build/accept/direct-charges) · [Create Wave charge](/api/charge/ChargesController_createWaveCharge) · [Create refund](/api/refunds/RefundsController_create) · [Transactions](/api/transactions/TransactionsController_findAll)',
  },
  CheckoutSessionsController_create: {
    summary: 'Create checkout session',
    body: 'Creates a hosted checkout session so the buyer completes payment on the hosted checkout experience. Sessions expire; create a fresh session if the link lapses.',
    requestBodyIntro:
      'Session payload: provide `amount` (and optional product fields) or `line_items` for a multi-product cart.',
    whenToUse:
      'Use for e-commerce, invoices, or any flow where you want lomi. to host payment collection and return the customer to your site.',
    caveats:
      'Prefer checkout sessions over ad-hoc charges when you need a consistent buyer experience across payment methods. For pay_what_you_want products, amount must fall within the linked price minimum_amount and maximum_amount bounds (unit × quantity).',
    related:
      '[Payment links](/api/payment-links/PaymentLinksController_create) · [Retrieve checkout session](/api/checkout-sessions/CheckoutSessionsController_findOne)',
  },
  CheckoutSessionsController_findAll: {
    summary: 'List checkout sessions',
    body: 'Lists checkout sessions with filters for status, time range, and pagination per your integration needs.',
    whenToUse:
      'Use for reconciliation, support tools, or exporting recent checkout attempts.',
    related:
      '[Retrieve checkout session](/api/checkout-sessions/CheckoutSessionsController_findOne)',
  },
  CheckoutSessionsController_findOne: {
    summary: 'Retrieve checkout session',
    body: 'Returns session details including status and associated customer and line items where applicable.',
    whenToUse:
      'Poll or display after redirect from checkout, or when handling async notifications keyed by session ID.',
    related:
      '[List transactions](/api/transactions/TransactionsController_findAll)',
  },
  CustomersController_create: {
    summary: 'Create a customer',
    body: 'Creates a customer record scoped to your organization for repeat purchases and reporting.',
    whenToUse:
      'Use when you have stable customer identity in your system and want card-on-file, subscriptions, or clean transaction history.',
    related:
      '[List customers](/api/customers/CustomersController_findAll) · [Update customer](/api/customers/CustomersController_update)',
  },
  CustomersController_findAll: {
    summary: 'List customers',
    body: 'Returns a paginated customer directory with optional filters such as search text and activity.',
    whenToUse:
      'Use for CRM-style search, back-office lists, and exporting buyer records.',
  },
  CustomersController_findOne: {
    summary: 'Retrieve a customer',
    body: 'Returns one customer by ID. Responds with **404** if the record is unknown or not visible to this API key.',
    whenToUse:
      'Use on profile pages or before updating a customer or creating a subscription.',
    related:
      '[Customer transactions](/api/customers/CustomersController_getTransactions)',
  },
  CustomersController_getTransactions: {
    summary: 'List customer transactions',
    body: 'Returns transactions linked to a single customer ID for statements and dispute handling.',
    whenToUse:
      'Use on customer detail pages or when answering support questions tied to one buyer.',
    related:
      '[List transactions](/api/transactions/TransactionsController_findAll)',
  },
  CustomersController_remove: {
    summary: 'Remove a customer',
    body: 'Stops returning the customer in list and detail views for your organization.',
    whenToUse:
      'Use for GDPR-style deletion requests or when you must disable a buyer record from merchant-facing APIs.',
    caveats:
      'Behavior follows platform rules for retained financial records; confirm with your compliance team for legal holds.',
  },
  CustomersController_update: {
    summary: 'Update a customer',
    body: 'Partial update; send only fields that change (email, phone, metadata, etc.).',
    whenToUse:
      'Use when buyers edit their profile or when syncing CRM changes into lomi.',
  },
  CustomersController_createPortalSession: {
    summary: 'Create customer portal session',
    body: 'Returns a short-lived URL so the customer can manage subscriptions and payment methods in the hosted portal.',
    whenToUse:
      'Use from your app when a logged-in buyer opens “Manage billing” without building portal UI yourself.',
    related:
      '[Portal audit log](/api/customers/CustomersController_getPortalAudit) · [List subscriptions](/api/subscriptions/SubscriptionsController_findAll)',
  },
  CustomersController_getPortalAudit: {
    summary: 'Customer portal audit log',
    body: 'Returns portal activity for a customer (sign-ins, subscription changes, etc.) for support and compliance.',
    whenToUse:
      'Use when investigating billing disputes or verifying what the customer changed in the portal.',
    related:
      '[Create portal session](/api/customers/CustomersController_createPortalSession)',
  },
  DiscountCouponsController_create: {
    summary: 'Create discount coupon',
    body: 'Creates a coupon with scope and redemption rules for use at checkout or payment links.',
    whenToUse: 'Use when launching promotions or segment-specific discounts.',
    related:
      '[List coupons](/api/coupons/DiscountCouponsController_findAll) · [Checkout session](/api/checkout-sessions/CheckoutSessionsController_create)',
  },
  DiscountCouponsController_findAll: {
    summary: 'List discount coupons',
    body: 'Returns coupons configured for your organization.',
    whenToUse: 'Use to populate an admin UI or audit active promotions.',
  },
  DiscountCouponsController_findOne: {
    summary: 'Retrieve discount coupon',
    body: 'Returns one coupon definition by ID including constraints and redemption settings.',
    whenToUse:
      'Use before editing copy or validating a code’s rules in your own checkout.',
  },
  DiscountCouponsController_getPerformance: {
    summary: 'Coupon performance metrics',
    body: 'Returns usage and performance metrics for a coupon (redemptions, revenue impact) for reporting.',
    whenToUse: 'Use in marketing dashboards to measure campaign effectiveness.',
    related:
      '[Retrieve coupon](/api/coupons/DiscountCouponsController_findOne)',
  },
  DisputesController_findAll: {
    summary: 'List disputes',
    body: 'Returns card payment disputes for your organization with optional status and date filters.',
    whenToUse:
      'Use for support queues, reconciliation, and automation on `DISPUTE_*` webhooks.',
    related:
      '[Get dispute](/api/disputes/DisputesController_findOne) · [Disputes guide](/build/money/disputes)',
  },
  DisputesController_findOne: {
    summary: 'Get dispute',
    body: 'Returns a single dispute by ID, including linked transaction and customer snapshot fields.',
    whenToUse:
      'Use after `DISPUTE_CREATED` or when drilling into a row from the disputes list.',
    related:
      '[List disputes](/api/disputes/DisputesController_findAll) · [Disputes guide](/build/money/disputes)',
  },
  ChargesController_createCardCharge: {
    summary: 'Create embedded card charge',
    body: 'Creates a card charge for embedded checkout and returns `client_secret` for client-side confirmation.',
    whenToUse:
      'Use for in-app card entry where you own the product UI and tokenization flow.',
    caveats:
      'Never log or expose `client_secret` publicly; treat it like a short-lived capability for the client SDK.',
    related:
      '[Create checkout session](/api/checkout-sessions/CheckoutSessionsController_create) if you prefer hosted card collection.',
  },
  ChargesController_createSwitchCharge: {
    summary: 'Create Switch charge',
    body: 'Authorizes a card from server-supplied credentials and routes it across acquiring rails. May return a 3DS redirect URL or signal `retry_other_rail` to fall back to another rail.',
    whenToUse:
      'Use when your integration is PCI-DSS compliant and submits card credentials server-side, rather than collecting cards through hosted checkout or embedded Payment Elements.',
    caveats:
      'Submitting raw card credentials requires a PCI-DSS-compliant integration. Follow `next_action` for 3DS redirects and `retry_other_rail` when the primary rail declines.',
    related:
      '[Create card charge](/api/charge/ChargesController_createCardCharge) · [Direct charges](/build/accept/direct-charges)',
  },
  ChargesController_getCardCharge: {
    summary: 'Get embedded card charge',
    body: 'Retrieves card charge status and linked transaction when present.',
    whenToUse: 'Use after client confirmation to poll status.',
    related:
      '[Create card charge](/api/charge/ChargesController_createCardCharge)',
  },
  ChargesController_cancelCardCharge: {
    summary: 'Cancel embedded card charge',
    body: 'Cancels a card charge before completion.',
    whenToUse: 'Use when the buyer abandons checkout.',
    related:
      '[Create card charge](/api/charge/ChargesController_createCardCharge)',
  },
  PaymentLinksController_create: {
    summary: 'Create payment link',
    body: 'Creates a shareable link: product-backed links pull catalog amounts; instant links collect a fixed amount you specify.',
    whenToUse:
      'Use for invoices, social selling, or lightweight payment pages without building full checkout.',
    related:
      '[List payment links](/api/payment-links/PaymentLinksController_findAll) · [Checkout sessions](/api/checkout-sessions/CheckoutSessionsController_create)',
  },
  PaymentLinksController_findAll: {
    summary: 'List payment links',
    body: 'Returns payment links with optional filters for state and purpose.',
    whenToUse:
      'Use to audit which links are still active and their target amounts or products.',
  },
  PaymentLinksController_findOne: {
    summary: 'Retrieve payment link',
    body: 'Returns URLs, visibility, and status for a single link.',
    whenToUse: 'Use before resharing a link or embedding it in messaging.',
  },
  PaymentRequestsController_create: {
    summary: 'Create payment request',
    body: 'Creates a payer-facing request with amount, expiry, and metadata for reconciliation.',
    whenToUse:
      'Use for “pay this invoice” or POS-style requests where the payer confirms on their device.',
    related:
      '[Retrieve payment request](/api/payment-requests/PaymentRequestsController_findOne) · [Transactions](/api/transactions/TransactionsController_findAll)',
  },
  PaymentRequestsController_findAll: {
    summary: 'List payment requests',
    body: 'Returns a paginated ledger of requests with optional filters for status or references.',
    whenToUse: 'Use for finance teams tracking outstanding requests.',
  },
  PaymentRequestsController_findOne: {
    summary: 'Retrieve payment request',
    body: 'Returns the latest state, amounts, and payer reference data for one request.',
    whenToUse: 'Use on status pages and after callbacks keyed by request ID.',
  },
  PayoutsUnifiedController_create: {
    summary: 'Create payout',
    body: 'Withdraw to a registered payout method (self) or pay a beneficiary on mobile rails (wave/SPI).',
    whenToUse: 'Use for treasury movements from your lomi. balance.',
    caveats:
      'Self payouts require payout_method_id; beneficiary wave requires recipient.name and recipient.phone (any mobile number, not payout_method_id). Wave rails (self or beneficiary) return 400 on test API keys; live keys only. MTN returns 400 until supported.',
    related:
      '[List payouts](/api/payouts/PayoutsUnifiedController_findAll) · [Check available balance](/api/balances/AccountsController_checkAvailableBalance)',
  },
  PayoutsUnifiedController_findAll: {
    summary: 'List payouts',
    body: 'Returns withdrawals and beneficiary payouts with a kind discriminator.',
    whenToUse: 'Use for reconciliation and support.',
    related: '[Get payout](/api/payouts/PayoutsUnifiedController_findOne)',
  },
  PayoutsUnifiedController_findOne: {
    summary: 'Get payout',
    body: 'Returns a single payout by ID scoped to your organization.',
    whenToUse: 'Use after create or from webhooks.',
    related: '[Create payout](/api/payouts/PayoutsUnifiedController_create)',
  },
  ProductsController_addPrice: {
    summary: 'Add product price',
    body: 'Adds another price point to an existing product (currency, billing cadence, or amount variants).',
    whenToUse:
      'Use when expanding to new markets or adding a second billing option to the same product.',
    related: '[Retrieve product](/api/products/ProductsController_findOne)',
  },
  ProductsController_create: {
    summary: 'Create product',
    body: 'Creates a catalog product with at least one price in a single request. Supports pay_what_you_want via pricing_model and minimum_amount/maximum_amount on nested prices.',
    whenToUse:
      'Use when onboarding catalog data for checkout, subscriptions, or payment links backed by SKUs.',
    related:
      '[List products](/api/products/ProductsController_findAll) · [Payment links](/api/payment-links/PaymentLinksController_create)',
  },
  ProductsController_findAll: {
    summary: 'List products',
    body: 'Returns catalog products with embedded price options.',
    whenToUse:
      'Use to populate storefront admins or pick line items programmatically.',
  },
  ProductsController_findOne: {
    summary: 'Retrieve product',
    body: 'Returns a single product by ID including prices. Responds with **404** when unknown or inaccessible.',
    whenToUse:
      'Use before checkout composition or when validating a stored product ID.',
  },
  ProductsController_setDefaultPrice: {
    summary: 'Set default price',
    body: 'Marks which price lomi. uses when a flow does not specify an explicit price ID.',
    whenToUse:
      'Use after adding multiple prices so checkout and links have a clear fallback.',
    related: '[Add product price](/api/products/ProductsController_addPrice)',
  },
  RefundsController_create: {
    summary: 'Create refund',
    body: 'Refunds a **completed** transaction on **card**, **Wave**, or **MTN**. Merchant balance updates immediately when the refund is recorded.',
    whenToUse:
      'Use for buyer reversals on eligible completed transactions; supports full and partial amounts.',
    caveats:
      '**Card:** customer credit on the card network is completed separately by operations. **Wave partial:** requires a customer phone on file (beneficiary payout). **MTN live:** the original payment must have a provider reference (RequestToPay UUID stored as `provider_checkout_id`); lomi. calls the MTN Disbursement refund API and polls until completion. **MTN test:** ledger-only; no MTN API call. Partial MTN refunds also require a customer phone on file. For subscription-linked payments, pass optional `subscription_action`: `default` (cancel on initial full refund, pause on renewal full refund), `cancel`, `pause`, or `none`. Partial refunds never change the subscription unless the cumulative refund reaches the full transaction amount.',
    related:
      '[List refunds](/api/refunds/RefundsController_findAll) · [Retrieve transaction](/api/transactions/TransactionsController_findOne) · [Refunds guide](/build/money/refunds)',
  },
  RefundsController_findAll: {
    summary: 'List refunds',
    body: 'Returns refunds for your organization with optional status and date filters.',
    whenToUse: 'Use for reconciliation, support, and dashboards.',
    related: '[Get refund](/api/refunds/RefundsController_findOne)',
  },
  RefundsController_findOne: {
    summary: 'Get refund',
    body: 'Returns a single refund by ID scoped to your organization.',
    whenToUse:
      'Use after create or from webhook-driven flows to confirm refund details.',
    related: '[Create refund](/api/refunds/RefundsController_create)',
  },
  OrganizationsController_getRadarSettings: {
    summary: 'Get Radar settings',
    body: 'Returns whether lomi. Radar screening is enabled for the organization, the monitor/block mode, and card-network passthrough preferences.',
    whenToUse:
      'Use before toggling Radar in your own settings UI or to confirm org configuration in support tools.',
    related:
      '[Update Radar settings](/api/organizations/OrganizationsController_updateRadarSettings) · [lomi. Radar guide](/build/money/radar)',
  },
  OrganizationsController_updateRadarSettings: {
    summary: 'Update Radar settings',
    body: 'Enables or disables Radar screening and updates monitor/block mode or card-network passthrough for the organization.',
    whenToUse:
      'Use when onboarding merchants to fraud screening or changing how risky charges are handled.',
    caveats:
      'Radar is opt-in. When `mode` is `block`, charges that hit block rules are rejected before completion.',
    related:
      '[Get Radar settings](/api/organizations/OrganizationsController_getRadarSettings) · [List risk assessments](/api/risk-assessments/RadarController_listAssessments)',
  },
  RadarController_listAssessments: {
    summary: 'List risk assessments',
    body: 'Returns Radar screening results for incoming charges with optional filters for decision, rail, and date range.',
    whenToUse:
      'Use for fraud review queues, exports, and correlating `PAYMENT_RISK_*` webhook payloads.',
    related:
      '[Get risk assessment](/api/risk-assessments/RadarController_findOne) · [lomi. Radar guide](/build/money/radar)',
  },
  RadarController_findOne: {
    summary: 'Get risk assessment',
    body: 'Returns one Radar assessment by ID, including decision, score, and triggered rule signals.',
    whenToUse:
      'Use when handling `PAYMENT_RISK_FLAGGED` or `PAYMENT_RISK_BLOCKED` webhooks keyed by assessment ID.',
    related:
      '[List risk assessments](/api/risk-assessments/RadarController_listAssessments)',
  },
  SettlementsController_findAll: {
    summary: 'List settlement periods',
    body: 'Returns completed payment totals grouped by availability date (UTC) and currency. Each `settlement_id` uses `{currency}:{YYYY-MM-DD}`.',
    whenToUse:
      'Use for accounting reconciliation before requesting payouts or exporting withdrawable totals by day.',
    related:
      '[List settlement transactions](/api/settlements/SettlementsController_findTransactions) · [Request instant settlement](/api/settlements/SettlementsController_createInstant)',
  },
  SettlementsController_createInstant: {
    summary: 'Request an instant settlement (Nitro)',
    body: 'Rail mode records a Nitro fee on an existing payout. Advance mode unlocks held card funds up to the organization cap. Requires `Idempotency-Key`. Advance stays off until ops approves a limit.',
    whenToUse:
      'Use after creating a Wave or SPI payout (rail) or to release held card balance (advance) when Nitro is enabled for the organization.',
    caveats:
      'Rail requires `payout_id`. Advance is live-only, excludes disputed transactions, and fails when the org cap is exceeded. Not a loan and not insurance.',
    related:
      '[Get instant settlement](/api/settlements/SettlementsController_getInstant) · [Create payout](/api/payouts/PayoutsUnifiedController_create)',
  },
  SettlementsController_getInstant: {
    summary: 'Get an instant settlement (Nitro request)',
    body: 'Returns one Nitro instant-settlement request by UUID, scoped to this API key organization.',
    whenToUse:
      'Use after `POST /settlements/instant` or from a webhook to confirm status, fee, and net amount.',
    related:
      '[Request instant settlement](/api/settlements/SettlementsController_createInstant) · [List settlement periods](/api/settlements/SettlementsController_findAll)',
  },
  SettlementsController_findTransactions: {
    summary: 'List settlement transactions',
    body: 'Returns the transactions that contributed to a settlement period identified by `settlement_id`.',
    whenToUse:
      'Use to drill into a settlement row and match ledger movements to individual payments.',
    related:
      '[List settlement periods](/api/settlements/SettlementsController_findAll) · [Request instant settlement](/api/settlements/SettlementsController_createInstant)',
  },
  SubscriptionsController_cancel: {
    summary: 'Cancel subscription',
    body: 'Cancels an active subscription; optional reason is stored for analytics and chargeback context.',
    whenToUse:
      'Use when the customer ends service or you enforce policy cancellations.',
    related:
      '[Retrieve subscription](/api/subscriptions/SubscriptionsController_findOne)',
  },
  SubscriptionsController_resume: {
    summary: 'Resume subscription',
    body: 'Removes a scheduled end-of-period cancellation so the subscription keeps renewing.',
    whenToUse:
      'Use when a customer reverses a pending cancel-at-period-end before the billing period ends.',
    related:
      '[Cancel subscription](/api/subscriptions/SubscriptionsController_cancel)',
  },
  SubscriptionsController_changePlan: {
    summary: 'Change subscription plan',
    body: 'Updates the `price_id` on an active subscription for upgrades or downgrades.',
    whenToUse:
      'Use when moving a customer to a different recurring price on the same product line.',
    related:
      '[Retrieve subscription](/api/subscriptions/SubscriptionsController_findOne) · [Update subscription](/api/subscriptions/SubscriptionsController_update)',
  },
  SubscriptionsController_findAll: {
    summary: 'List subscriptions',
    body: 'Returns subscriptions for your organization. Optional `customer_id` and `status` query filters narrow the list.',
    whenToUse:
      'Use for billing ops, dunning dashboards, and revenue reporting.',
  },
  CustomersController_getSubscriptions: {
    summary: 'List subscriptions for customer',
    body: 'Returns subscriptions tied to one customer ID. Responds with **404** when the customer is unknown.',
    whenToUse: 'Use on customer portals showing active plans.',
    related: '[Retrieve customer](/api/customers/CustomersController_findOne)',
  },
  SubscriptionsController_findOne: {
    summary: 'Retrieve subscription',
    body: 'Returns one subscription by ID including cycle and price references. Responds with **404** when unknown or inaccessible.',
    whenToUse: 'Use before upgrades, cancelations, or invoicing integration.',
  },
  SubscriptionsController_update: {
    summary: 'Update subscription',
    body: 'Patches an organization subscription (metadata, price, or fields supported by the API).',
    whenToUse:
      'Use for plan changes initiated from your admin tools or customer portal backends.',
    related:
      '[Retrieve subscription](/api/subscriptions/SubscriptionsController_findOne) · [Cancel subscription](/api/subscriptions/SubscriptionsController_cancel)',
  },
  TransactionsController_findAll: {
    summary: 'List transactions',
    body: 'Returns ledger transactions with filters for status, provider, method, currency, and time range.',
    whenToUse:
      'Use as the primary reconciliation feed for payments, refunds, and payouts visible to your org.',
    related:
      'See also [Payment and payout lifecycle](/build/reliability/payment-lifecycle) for status semantics.',
  },
  TransactionsController_findOne: {
    summary: 'Retrieve transaction',
    body: 'Returns one transaction by ID. Responds with **404** when unknown or inaccessible.',
    whenToUse:
      'Use for receipt screens, support tickets, and webhook-triggered deep links.',
  },
  LogsController_findAll: {
    summary: 'List logs',
    body: 'Returns paginated logs for the organization. The `type` query parameter selects which log stream to read: `api_request`, `api_error`, `webhook_delivery`, or `activity`.',
    whenToUse:
      'Use when debugging API errors, auditing webhook deliveries, or building support dashboards.',
    related:
      '[Retrieve log entry](/api/logs/LogsController_findOne) · [Webhook delivery logs](/api/webhooks/WebhookDeliveryLogsController_findAll)',
  },
  LogsController_findOne: {
    summary: 'Retrieve log entry',
    body: 'Returns a single log entry by ID. Pass `type` to select the log stream. Responds with **404** when the entry does not exist or is outside the API key organization scope.',
    whenToUse:
      'Use when drilling into one failed request, webhook delivery, or activity event from a list view.',
    related: '[List logs](/api/logs/LogsController_findAll)',
  },
  WebhookDeliveryLogsController_findAll: {
    summary: 'List webhook delivery logs',
    body: 'Returns delivery attempts for an outbound webhook endpoint, including HTTP status and retry hints.',
    whenToUse:
      'Use when debugging missed events or proving delivery to auditors.',
    related: '[Retrieve webhook](/api/webhooks/WebhooksController_findOne)',
  },
  WebhookDeliveryLogsController_findOne: {
    summary: 'Retrieve webhook delivery log',
    body: 'Returns a single delivery attempt record.',
    whenToUse:
      'Use when correlating one failure with a specific HTTP response body your server returned.',
  },
  WebhooksController_create: {
    summary: 'Create webhook',
    body: 'Registers an outbound HTTPS endpoint and the event types you want delivered.',
    whenToUse:
      'Use once per environment when wiring your server to lomi. event notifications.',
    caveats:
      'Store the signing secret securely; verify signatures on every inbound request.',
    related:
      '[List webhooks](/api/webhooks/WebhooksController_findAll) · [Test webhook](/api/webhooks/WebhooksController_test)',
  },
  WebhooksController_findAll: {
    summary: 'List webhooks',
    body: 'Returns configured outbound webhook subscriptions (URL, events, signing configuration).',
    whenToUse:
      'Use during setup to confirm which environments receive production traffic.',
  },
  WebhooksController_findOne: {
    summary: 'Retrieve webhook',
    body: 'Returns one outbound subscription by ID for editing forms.',
    whenToUse: 'Use before rotating secrets or changing the event filter.',
  },
  WebhooksController_remove: {
    summary: 'Delete webhook',
    body: 'Removes an outbound webhook subscription; deliveries stop for that endpoint.',
    whenToUse:
      'Use when decommissioning an environment or rotating to a new endpoint record.',
    related: '[Create webhook](/api/webhooks/WebhooksController_create)',
  },
  WebhooksController_retryDelivery: {
    summary: 'Retry webhook delivery',
    body: 'Re-sends a single failed delivery attempt for debugging after you fix your receiver.',
    whenToUse:
      'Use from support tools; not a substitute for idempotent handling on your server.',
    related:
      '[Webhook delivery logs](/api/webhooks/WebhookDeliveryLogsController_findOne)',
  },
  WebhooksController_test: {
    summary: 'Test webhook',
    body: 'Sends a sample event to the configured URL so you can validate signature verification and parsing.',
    whenToUse: 'Use immediately after creating or updating a webhook endpoint.',
    related: '[Create webhook](/api/webhooks/WebhooksController_create)',
  },
  WebhooksController_update: {
    summary: 'Update webhook',
    body: 'Patches delivery URL, secrets, subscribed events, or lifecycle flags for an existing subscription.',
    whenToUse:
      'Use when rotating signing secrets without re-creating the endpoint record.',
    caveats:
      'Coordinate secret rotation with your receiver to avoid rejecting signed payloads.',
    related:
      '[Webhook delivery logs](/api/webhooks/WebhookDeliveryLogsController_findAll)',
  },
  OrganizationsController_findAll: {
    summary: 'List organizations',
    body: 'Returns every organization the merchant belongs to, with is_current for the key in use. Use this as the org switcher.',
    whenToUse:
      'Use to pick another space, then POST /organizations/:id/keys (MCP action=use) to adopt a secret for that org.',
    related:
      '[Create organization](/api/organizations/OrganizationsController_create) · [Mint org key](/api/organizations/OrganizationsController_createKey)',
  },
  OrganizationsController_findOne: {
    summary: 'Retrieve organization',
    body: 'Returns one organization by ID. The ID must match the organization tied to your API key.',
    whenToUse:
      'Use when you already store an organization ID and need a fresh profile snapshot.',
    related:
      '[List organizations](/api/organizations/OrganizationsController_findAll)',
  },
  OrganizationsController_getMetrics: {
    summary: 'Organization metrics',
    body: 'Returns MRR, ARR, LTV, revenue, and customer counts for your organization.',
    whenToUse:
      'Use for partner dashboards, investor reporting, or internal growth analytics.',
    related:
      '[Organizations guide](/build/platform/organizations) · [Merchant MRR](/api/merchants/MerchantsController_getMrr)',
  },
  MerchantsController_getDetails: {
    summary: 'Get merchant details',
    body: 'Returns merchant profile data and organization-level revenue metrics for the given merchant ID.',
    whenToUse:
      'Use when your integration still references a merchant ID or you need legacy merchant-scoped reads.',
    related:
      '[Organizations](/build/platform/organizations) · [Merchant ARR](/api/merchants/MerchantsController_getArr)',
  },
  MerchantsController_getMrr: {
    summary: 'Get merchant MRR',
    body: 'Returns monthly recurring revenue for the merchant tied to the given ID.',
    whenToUse:
      'Use for subscription analytics when operating on a merchant-scoped identifier.',
    related:
      '[Organization metrics](/api/organizations/OrganizationsController_getMetrics)',
  },
  MerchantsController_getArr: {
    summary: 'Get merchant ARR',
    body: 'Returns annualized recurring revenue for the merchant tied to the given ID.',
    whenToUse:
      'Use for annual planning views when you track merchants individually.',
    related: '[Merchant MRR](/api/merchants/MerchantsController_getMrr)',
  },
  MerchantsController_getBalance: {
    summary: 'Get merchant balance',
    body: 'Returns account balance for a merchant in the requested currency.',
    whenToUse:
      'Use when a merchant ID is the scope key for wallet or treasury displays.',
    caveats: 'Requires `currency_code` (XOF, USD, or EUR).',
    related: '[Account balances](/api/balances/AccountsController_getBalance)',
  },
  MetersController_create: {
    summary: 'Create a meter',
    body: 'Defines a billable metric for usage-based products. Events with a matching `code` update meter balances when processed.',
    whenToUse:
      'First step in usage billing: create a meter before ingesting usage events or enrolling customers on usage-based products.',
    related:
      '[Usage billing guide](/build/billing/usage-billing) · [Record usage event](/api/usage/UsageEventsController_ingest) · [List meters](/api/meters/MetersController_findAll)',
  },
  MetersController_findAll: {
    summary: 'List meters',
    body: 'Returns meters for your organization, optionally filtered by product or active status.',
    whenToUse:
      'Use to display configured billable metrics or pick a `meter_id` for balance reads.',
    related:
      '[Create meter](/api/meters/MetersController_create) · [Get meter](/api/meters/MetersController_findOne)',
  },
  MetersController_findOne: {
    summary: 'Get a meter',
    body: 'Returns one meter by ID, including filter and aggregation configuration.',
    whenToUse:
      'Use when you store a meter ID and need the latest filter/aggregation rules.',
    related:
      '[List meters](/api/meters/MetersController_findAll) · [Meter balance](/api/meters/MetersController_getBalance)',
  },
  MetersController_update: {
    summary: 'Update a meter',
    body: 'Updates filter, aggregation, or active status on an existing meter.',
    whenToUse:
      'Use when billing rules change; deactivate meters instead of deleting when historical usage must remain.',
    related: '[Get meter](/api/meters/MetersController_findOne)',
  },
  MetersController_getBalance: {
    summary: 'Get meter balance for a customer',
    body: 'Returns consumed, credited, and net balance units for a customer on a specific meter.',
    whenToUse:
      'Use for prepaid wallets, usage dashboards, or entitlement checks before granting access.',
    related:
      '[Credit wallet](/api/usage/UsageBillingController_creditWallet) · [Record usage event](/api/usage/UsageEventsController_ingest)',
  },
  UsageEventsController_findAll: {
    summary: 'List usage events',
    body: 'Lists ingested usage events with pagination and optional filters for customer, code, and processing status.',
    whenToUse:
      'Use for support, reconciliation, or debugging failed usage ingest.',
    related:
      '[Record usage event](/api/usage/UsageEventsController_ingest) · [Get usage event](/api/usage/UsageEventsController_findOne)',
  },
  UsageEventsController_findOne: {
    summary: 'Get a usage event',
    body: 'Returns one usage event by ID, including processing status and error details when failed.',
    whenToUse:
      'Use after ingest to confirm processing or investigate a specific event.',
    related:
      '[List usage events](/api/usage/UsageEventsController_findAll) · [Record usage event](/api/usage/UsageEventsController_ingest)',
  },
  UsageEventsController_ingest: {
    summary: 'Record a usage event',
    body: 'Idempotent usage ingest. Events are processed asynchronously and update meter balances when matched.',
    whenToUse:
      'Call from your app whenever billable usage occurs; use a stable `transaction_id` per logical event.',
    caveats:
      'Returns `202 Accepted`. Confirm `processing_status` via webhooks or polling `GET /usage/events/{id}`.',
    related:
      '[Usage billing guide](/build/billing/usage-billing) · [Create meter](/api/meters/MetersController_create) · [Create usage subscription](/api/usage/UsageEventsController_createUsageSubscription)',
  },
  UsageEventsController_createUsageSubscription: {
    summary: 'Create a usage subscription',
    body: 'Enrolls a customer on a `usage_based` product without an upfront charge. Required before billing metered usage to that customer.',
    whenToUse:
      'After creating a usage-based product and meter; enroll each customer before sending usage events tied to a subscription.',
    related:
      '[Usage billing guide](/build/billing/usage-billing) · [Products guide](/build/billing/products) · [Subscription usage](/api/subscriptions/SubscriptionsController_getUsage)',
  },
  UsageBillingController_listPeriods: {
    summary: 'List usage billing periods',
    body: 'Returns billing periods for usage subscriptions, optionally filtered by subscription ID.',
    whenToUse:
      'Use for invoicing windows, period-close reconciliation, or support lookups.',
    related:
      '[Get subscription usage](/api/subscriptions/SubscriptionsController_getUsage) · [Usage billing guide](/build/billing/usage-billing)',
  },
  SubscriptionsController_getUsage: {
    summary: 'Get meter usage for a subscription',
    body: 'Returns aggregated meter usage for a usage subscription across its billing period.',
    whenToUse:
      'Use on invoices, customer usage dashboards, or before closing a billing period.',
    related:
      '[List billing periods](/api/usage/UsageBillingController_listPeriods) · [Record usage event](/api/usage/UsageEventsController_ingest)',
  },
  UsageBillingController_getRevenue: {
    summary: 'Combined revenue metrics',
    body: 'Returns MRR, usage revenue, and one-time revenue for a date range.',
    whenToUse:
      'Use for finance reporting that combines subscription MRR with metered usage and one-off charges.',
    caveats: 'Requires `start_date` and `end_date` query parameters.',
    related:
      '[Organization metrics](/api/organizations/OrganizationsController_getMetrics) · [Usage billing guide](/build/billing/usage-billing)',
  },
  UsageBillingController_creditWallet: {
    summary: 'Credit prepaid usage units',
    body: 'Adds credited units to a customer meter wallet (prepaid or promotional credits).',
    whenToUse:
      'Use for prepaid packs, promotions, or manual adjustments before usage draws down balance.',
    related:
      '[Get meter balance](/api/meters/MetersController_getBalance) · [Record usage event](/api/usage/UsageEventsController_ingest)',
  },
  UsageBillingController_createEntitlement: {
    summary: 'Create or update an entitlement',
    body: 'Defines a plan entitlement feature keyed by `feature_key` for usage or access gating.',
    whenToUse:
      'Use when feature access is tied to plan entitlements rather than raw meter balance alone.',
    related:
      '[Check entitlement](/api/usage/UsageBillingController_checkEntitlement) · [Usage billing guide](/build/billing/usage-billing)',
  },
  UsageBillingController_checkEntitlement: {
    summary: 'Check customer entitlement',
    body: 'Returns whether a customer has an active entitlement for the given `feature_key`.',
    whenToUse:
      'Use at request time to gate features without loading full subscription objects.',
    related:
      '[Create entitlement](/api/usage/UsageBillingController_createEntitlement)',
  },
  ProvidersController_findAll: {
    summary: 'List payment providers',
    body: 'Returns connection status for payment providers configured for your organization.',
    whenToUse:
      'Use to show which rails (card, Wave, MTN, SPI) are enabled before rendering checkout options.',
    related:
      '[Choose integration](/build/choose-integration) · [Mobile money](/build/mobile-money)',
  },
  SupportRequestsController_findAll: {
    summary: 'List support tickets',
    body: 'Returns Settings → Support tickets for the organization behind the API key.',
    whenToUse:
      'Use after filing a ticket via MCP or the dashboard to check status and resolution notes.',
    related:
      '[Create support ticket](/api/support-requests/SupportRequestsController_create)',
  },
  SupportRequestsController_findOne: {
    summary: 'Get support ticket',
    body: 'Returns one ticket by id, including status, subject, and any staff resolution note.',
    whenToUse: 'Use when following up on a ticket id from create or list.',
    related:
      '[List support tickets](/api/support-requests/SupportRequestsController_findAll)',
  },
  SupportRequestsController_create: {
    summary: 'Create support ticket',
    body: 'Opens a ticket in Settings → Support. The lomi. team sees it in the admin inbox and emails a confirmation.',
    whenToUse:
      'Use when an agent or integration needs to file a complaint or ask for help on a live merchant account.',
    related:
      '[List support tickets](/api/support-requests/SupportRequestsController_findAll) · [MCP](/build/mcp)',
  },
  SupportRequestsController_close: {
    summary: 'Close support ticket',
    body: 'Marks an open ticket as closed. The creator or an org admin can close it.',
    whenToUse: 'Use when the issue is resolved and you no longer need a reply.',
    related:
      '[Get support ticket](/api/support-requests/SupportRequestsController_findOne)',
  },
  OrganizationsController_create: {
    summary: 'Create organization',
    body: 'Opens a new space for the merchant on the API key and returns a secret key once (same environment as the caller).',
    whenToUse:
      'Use when the merchant needs another organization. MCP action=create adopts the returned secret.',
    related:
      '[List organizations](/api/organizations/OrganizationsController_findAll) · [Mint org key](/api/organizations/OrganizationsController_createKey)',
  },
  OrganizationsController_createKey: {
    summary: 'Mint organization secret',
    body: 'Creates a secret API key for an organization the merchant already belongs to. Returns the secret once.',
    whenToUse:
      'Use to switch the agent session to another org (MCP lomi_organization action=use).',
    related:
      '[Create organization](/api/organizations/OrganizationsController_create) · [Create API key](/api/api-keys/ApiKeysController_create)',
  },
  ApiKeysController_list: {
    summary: 'List API keys',
    body: 'Returns key name, type, prefix/last4, and status. Secret values are never returned.',
    whenToUse: 'Use to audit keys before creating or revoking one.',
  },
  ApiKeysController_create: {
    summary: 'Create API key',
    body: 'Mints a secret or publishable key and returns the full secret once. Does not switch the MCP session.',
    whenToUse:
      'Use to add a named key. To switch org, use POST /organizations/:id/keys instead.',
    related: '[Revoke API key](/api/api-keys/ApiKeysController_remove)',
  },
  ApiKeysController_remove: {
    summary: 'Revoke API key',
    body: 'Soft-revokes a key. Pass the key value or masked prefix as the id.',
    whenToUse: 'Use when a key leaked or is no longer needed.',
  },
  ProductsController_update: {
    summary: 'Update product',
    body: 'Updates name, description, visibility, images, SKU, and inventory. Product type cannot change.',
    whenToUse:
      'Use after catalog review or to hide a product from the storefront.',
    related: '[Archive product](/api/products/ProductsController_archive)',
  },
  ProductsController_archive: {
    summary: 'Archive product',
    body: 'Soft-archives a product (delete_product). Existing checkouts keep their snapshot.',
    whenToUse: 'Use when the product should no longer be sold.',
  },
  PaymentLinksController_update: {
    summary: 'Update payment link',
    body: 'Patches title, URLs, checkout field flags, expiry, or instant-link amount.',
    whenToUse: 'Use to change a live link without minting a new URL.',
  },
  PaymentLinksController_archive: {
    summary: 'Archive payment link',
    body: 'Deactivates the link (safe_delete_payment_link). The URL stops accepting payments.',
    whenToUse:
      'Use when a campaign or invoice link should no longer be shared.',
  },
  DiscountCouponsController_remove: {
    summary: 'Delete coupon',
    body: 'Deletes a discount coupon from the organization.',
    whenToUse: 'Use when a promotion is over and the code must stop working.',
  },
  TeamController_list: {
    summary: 'List team',
    body: 'Returns members and pending invitations for the organization on the API key.',
    whenToUse: 'Use before inviting or changing roles.',
  },
  TeamController_listRoles: {
    summary: 'List team roles',
    body: 'Returns Admin/Member and any custom roles already created in the dashboard.',
    whenToUse: 'Use to pick a role_id when inviting or assigning.',
  },
  TeamController_invite: {
    summary: 'Invite team member',
    body: 'Sends an invitation email. The human accepts in the browser. role Admin/Member or role_id.',
    whenToUse:
      'Use when an Admin needs to add a teammate. Agents cannot accept invites.',
  },
  TeamController_revokeInvite: {
    summary: 'Revoke invitation',
    body: 'Cancels a pending invitation by email.',
    whenToUse: 'Use when the invite was sent to the wrong address.',
  },
  TeamController_updateRole: {
    summary: 'Update member role',
    body: 'Sets Admin/Member via role, or a custom role via role_id. You cannot change your own role.',
    whenToUse: 'Use to promote or demote a teammate.',
  },
  TeamController_remove: {
    summary: 'Remove team member',
    body: 'Removes the member from the organization. Self-remove is blocked.',
    whenToUse: 'Use when someone should lose access immediately.',
  },
  SettingsController_getCheckout: {
    summary: 'Get checkout settings',
    body: 'Returns language, URLs, pay button, fee pass-through, analytics, and custom fields.',
    whenToUse: 'Use before updating Settings → Checkout.',
  },
  SettingsController_updateCheckout: {
    summary: 'Update checkout settings',
    body: 'Patches the same checkout settings object the dashboard uses.',
    whenToUse:
      'Use to change success/cancel URLs, language, or fee pass-through.',
  },
  SettingsController_getStorefront: {
    summary: 'Get storefront settings',
    body: 'Returns enablement, slug, announcement, shipping, and tax config.',
    whenToUse: 'Use before changing the public store.',
  },
  SettingsController_updateStorefront: {
    summary: 'Update storefront settings',
    body: 'Enables or disables the store, changes the slug, announcement, or shipping/tax.',
    whenToUse:
      'Use when launching or pausing the storefront. Changing slug breaks old links.',
  },
  MerchantExportsController_findAll: {
    summary: 'List exports',
    body: 'Returns recent export jobs so you can poll without remembering ids.',
    whenToUse:
      'Use after POST /exports to find jobs and then GET /exports/:id for download_url.',
  },
  MerchantExportsController_create: {
    summary: 'Create export',
    body: 'Starts a CSV or PDF export (transactions, customers, customers_pdf, statement, journal, logs_csv, webhook_deliveries_csv, or account_export). Poll GET /exports/:id for download_url.',
    whenToUse:
      'Use for books, customer lists, log dumps, or a GDPR-shaped account bundle.',
  },
  AccountController_export: {
    summary: 'Export account data',
    body: 'Queues a GDPR-shaped bundle for the current organization (customers, transactions, webhooks, team, settings). No confirmation.',
    whenToUse:
      'Use from lomi_support action=export. Poll GET /exports/:id for the file.',
  },
  AccountController_deleteAccount: {
    summary: 'Delete merchant account',
    body: 'First call returns a confirmation_token preview. Resend with that token to soft-delete the merchant.',
    whenToUse:
      'Use from lomi_support action=delete_account. Merchant key only. Irreversible for the merchant row.',
  },
  MerchantExportsController_findOne: {
    summary: 'Get export',
    body: 'Returns job status and download_url when the file is ready.',
    whenToUse: 'Use after POST /exports or GET /exports to poll a job id.',
  },
  DisputesController_submitEvidence: {
    summary: 'Submit dispute evidence',
    body: 'Attaches written evidence and optional file metadata to a card dispute before the due date.',
    whenToUse:
      'Use when a cardholder disputes a charge and you have a response ready.',
  },
  FinanceController_summary: {
    summary: 'Finance summary',
    body: 'Cash position, receivables, overdue invoices, upcoming payouts, refund rate, and dispute exposure.',
    whenToUse:
      'Use for a merchant finance snapshot on Home or a reporting agent.',
  },
  FinanceController_cashflow: {
    summary: 'Cashflow',
    body: 'Daily inflow and outflow over a date range.',
    whenToUse: 'Use to explain a balance change between two dates.',
  },
  FinanceController_aging: {
    summary: 'Receivables aging',
    body: 'Open invoice amounts bucketed by days past due.',
    whenToUse: 'Use to prioritize collection on overdue invoices.',
  },
  FinanceController_reconcile: {
    summary: 'Reconcile',
    body: 'Difference between completed transaction net and completed payouts.',
    whenToUse: 'Use when books do not match payout totals.',
  },
  InvoicesController_findAll: {
    summary: 'List invoices',
    body: 'Lists invoices for the organization with status and amounts.',
    whenToUse:
      'Use to find an invoice before sending, reminding, or voiding it.',
  },
  InvoicesController_findOne: {
    summary: 'Get invoice',
    body: 'Returns one invoice by id, including line items and payment status.',
    whenToUse: 'Use after list or create to inspect a single invoice.',
  },
  InvoicesController_create: {
    summary: 'Create invoice',
    body: 'Creates a draft invoice for a customer with line items and due date.',
    whenToUse: 'Use when billing a customer outside hosted checkout.',
  },
  InvoicesController_update: {
    summary: 'Update invoice',
    body: 'Patches a draft invoice. Finalized invoices cannot change amounts.',
    whenToUse: 'Use before finalize to correct lines or due date.',
  },
  InvoicesController_pdf: {
    summary: 'Invoice PDF',
    body: 'Returns hosted_url and download_url for the invoice PDF.',
    whenToUse: 'Use to send or archive a printable invoice.',
  },
  InvoicesController_createCheckoutSession: {
    summary: 'Invoice checkout session',
    body: 'Opens a hosted checkout session so the customer can pay the invoice.',
    whenToUse:
      'Use when the customer should pay online instead of a bank transfer.',
  },
  InvoicesController_finalize: {
    summary: 'Finalize invoice',
    body: 'Locks the draft and assigns the invoice number.',
    whenToUse: 'Use when the draft is ready to send.',
  },
  InvoicesController_send: {
    summary: 'Send invoice',
    body: 'Emails the finalized invoice to the customer.',
    whenToUse: 'Use after finalize when the customer should receive the PDF.',
  },
  InvoicesController_remind: {
    summary: 'Remind invoice',
    body: 'Sends a payment reminder for an open invoice.',
    whenToUse: 'Use when an invoice is unpaid past the due date.',
  },
  InvoicesController_voidInvoice: {
    summary: 'Void invoice',
    body: 'Voids an open invoice so it can no longer be paid.',
    whenToUse: 'Use when the invoice was issued in error.',
  },
  PayoutMethodsController_list: {
    summary: 'List payout methods',
    body: 'Lists destination accounts for withdrawals. Account numbers are masked.',
    whenToUse: 'Use before creating a payout.',
  },
  PayoutMethodsController_create: {
    summary: 'Add payout method',
    body: 'Registers a bank, SPI, or mobile money destination for payouts.',
    whenToUse: 'Use when the merchant needs a new withdrawal destination.',
  },
  TransactionsController_receiptPdf: {
    summary: 'Receipt PDF',
    body: 'Returns hosted_url and download_url for the transaction receipt PDF.',
    whenToUse:
      'Use after a successful payment when the customer needs a receipt.',
  },
  TransfersController_create: {
    summary: 'Create transfer',
    body: 'Moves funds from your Operator balance to a connected Member Account (`acct_...`). Two-step confirmation: the first call returns `requires_confirmation: true` and a `confirmation_token`; repeat the same request with `confirmation_token` to execute. Balances move in XOF.',
    requestBodyIntro:
      'Transfer payload: `amount`, `currency_code`, and `destination` are required. Add `transfer_group` to link the transfer to the payments it settles, or `source_transaction_id` for one payment.',
    whenToUse:
      'Use for lomi. Network separate charges and transfers: charge on your own account first, then pay the member later (after delivery, at the end of the day, or in a batch).',
    caveats:
      'Operator secret key **without** `Lomi-Account`. `Idempotency-Key` is required. The destination must be an active membership with `transfer.receive` for the key environment. A transfer cannot exceed your available balance.',
    related:
      '[List transfers](/api/transfers/TransfersController_findAll) · [Reverse transfer](/api/transfers/TransfersController_reverse) · [lomi. Network guide](/build/platform/network#transfers)',
  },
  TransfersController_findAll: {
    summary: 'List transfers',
    body: 'Returns transfers created by your Operator organization, including destination transfers, separate transfers, settled operator fees, and reversals.',
    whenToUse:
      'Use for reconciliation by `transfer_group` or `destination`, or to build a per-member statement. Filter by `transfer_type` to isolate fees or reversals.',
    related:
      '[Retrieve transfer](/api/transfers/TransfersController_findOne) · [Create transfer](/api/transfers/TransfersController_create)',
  },
  TransfersController_findOne: {
    summary: 'Retrieve transfer',
    body: 'Returns a single transfer (`tr_...`) with its status, settled amount, source transaction, and reversed amount.',
    whenToUse:
      'Use after create or from a `NETWORK_TRANSFER_CREATED` webhook to confirm the transfer landed on the member balance.',
    related:
      '[List transfers](/api/transfers/TransfersController_findAll) · [Reverse transfer](/api/transfers/TransfersController_reverse)',
  },
  TransfersController_reverse: {
    summary: 'Reverse transfer',
    body: 'Pulls funds back from the Member Account to your Operator balance. Defaults to the remaining unreversed amount; pass `amount` for a partial reversal. Same two-step `confirmation_token` flow as create.',
    whenToUse:
      'Use when a separate transfer was too large or an order was cancelled after you paid the member. Refunds on destination and separate charges reverse transfers automatically (`reverse_transfer`).',
    caveats:
      'The member must have enough available balance to cover the reversal. `Idempotency-Key` is required. Emits `NETWORK_TRANSFER_REVERSED`.',
    related:
      '[Create transfer](/api/transfers/TransfersController_create) · [Create refund](/api/refunds/RefundsController_create) · [lomi. Network guide](/build/platform/network#refunds-and-liability)',
  },
  NetworkAccountsController_createLoginLink: {
    summary: 'Create login link',
    body: 'Mints a single-use URL that signs the owner of a Member Account (`acct_...`) into their lomi. dashboard in member mode. The link expires after 5 minutes.',
    whenToUse:
      'Use when a member clicks "Open lomi. dashboard" inside your product and you want to drop them on their balance, payouts, or open requirements without a separate login.',
    caveats:
      'Operator secret key **without** `Lomi-Account`. Requires the `account.login_link` capability for the key environment and an active membership. Create the link server-side at click time and redirect; never email, log, or embed it in public pages.',
    related:
      '[Create account session](/api/network/NetworkAccountsController_createAccountSession) · [lomi. Network guide](/build/platform/network#member-dashboard-and-login-links)',
  },
  NetworkAccountsController_createAccountSession: {
    summary: 'Create account session',
    body: 'Mints a short-lived `client_secret` (`nas_...`) that your front end passes to the embedded member components: `payments`, `payouts`, `balance`, `onboarding`, and `notification_banner`. Sessions expire after 60 minutes and are scoped to one Member Account.',
    requestBodyIntro:
      'Session payload: `account` is required. `components` is an object keyed by component with an `enabled` flag; omitted components default to enabled.',
    whenToUse:
      'Use to render member surfaces inside your own pages instead of sending members to the lomi. dashboard. Create a new session on each page load.',
    caveats:
      'Operator secret key **without** `Lomi-Account`. Requires `account.read` for the key environment and `member_dashboard` set to `full` or `member_mode` on your operator profile. Never expose your Operator key to the browser; only the `client_secret` goes client-side.',
    related:
      '[Create login link](/api/network/NetworkAccountsController_createLoginLink) · [lomi. Network guide](/build/platform/network#embedded-components)',
  },
};
