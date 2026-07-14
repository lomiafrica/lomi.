import { newIdempotencyKey } from '../client';
import {
  pickString,
  unwrapData,
  validateApiRequestCorrelation,
  validateLogEntryResponse,
  validateLogsListResponse,
  validateMerchantFacingError,
  validateUnavailableChargeResponse,
  validateWebhookCreateResponse,
  validateWebhookDeliveryLogs,
  validateWebhookListHasNoSecrets,
  validateWebhookTestDeliveryResponse,
  validateUsageEventProcessed,
  validateMeterBalanceAtLeast,
  validateSubscriptionUsage,
  validatePaymentWebhookDelivered,
} from '../assert';
import type { CheckDefinition, SuiteContext } from '../types';
import {
  createAgentOnboardingChecks,
  createAgentProvisioningFlowChecks,
  createPartnerFlowChecks,
} from './agent';
import { createSecuritySandboxChecks } from './security-sandbox';

function includeFullProvisioningSynthetics(): boolean {
  return process.env.LOMI_SYNTHETICS_FULL_PROVISIONING === '1';
}

function createSandboxAgentChecks(): CheckDefinition[] {
  const fullProvisioning = includeFullProvisioningSynthetics();
  const checks = [
    ...createAgentOnboardingChecks(),
    ...createPartnerFlowChecks({ includeAccountCreation: fullProvisioning }),
  ];
  if (fullProvisioning) {
    checks.push(...createAgentProvisioningFlowChecks());
  }
  return checks;
}

function synthEmail(ctx: SuiteContext): string {
  return `synthetics+${ctx.runId}@lomi.test`;
}

function synthCode(ctx: SuiteContext, prefix: string): string {
  return `${prefix}${ctx.runId.replace(/-/g, '').slice(0, 10).toUpperCase()}`;
}

function futureExpiry(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString();
}

export function createSandboxChecks(): CheckDefinition[] {
  return [
    ...createSandboxAgentChecks(),
    ...createSecuritySandboxChecks(),
    // --- Identity / infra ---
    {
      name: 'health liveness',
      service: 'health',
      method: 'GET',
      path: '/health',
      auth: false,
      expectStatus: 200,
      validate: (_ctx, res) => {
        const body = res.data as Record<string, unknown>;
        return body?.ok === true ? null : 'Expected ok: true in /health';
      },
    },
    {
      name: 'health readiness',
      service: 'health',
      method: 'GET',
      path: '/ready',
      auth: false,
      expectStatus: [200, 503],
      validate: (_ctx, res) => {
        if (res.status === 503) {
          const body = res.data as Record<string, unknown>;
          const checks = Array.isArray(body?.checks)
            ? (body.checks as Array<{ name?: string; ok?: boolean }>)
            : [];
          const failed = checks.filter((c) => c.ok === false);
          if (
            failed.length > 0 &&
            failed.every((c) => c.name === 'cron_secret')
          ) {
            return null;
          }
          return 'Readiness check returned 503 (dependencies unhealthy)';
        }
        return null;
      },
    },
    {
      name: 'me identity',
      service: 'identity',
      method: 'GET',
      path: '/me',
      expectStatus: 200,
      validate: (_ctx, res) => {
        const env = pickString(res.data, 'environment');
        if (env !== 'test') {
          return `Expected environment "test", got "${env ?? 'missing'}"`;
        }
        return null;
      },
      capture: (ctx, res) => {
        const rid = res.headers['x-request-id'];
        if (rid) ctx.correlatedRequestId = rid;
      },
    },
    {
      name: 'logs api_request correlation after /me',
      service: 'logs',
      method: 'GET',
      path: '/logs?type=api_request&limit=50',
      expectStatus: 200,
      retry: { attempts: 5, delayMs: 1000 },
      skipIf: (ctx) =>
        ctx.correlatedRequestId
          ? null
          : 'correlatedRequestId not captured from /me',
      validate: (ctx, res) => {
        const listErr = validateLogsListResponse(res.data, 'api_request', {
          minEntries: 1,
          requireUsefulFields: true,
        });
        if (listErr) return listErr;
        return validateApiRequestCorrelation(res.data, ctx.correlatedRequestId);
      },
    },
    {
      name: 'list providers',
      service: 'providers',
      method: 'GET',
      path: '/providers',
      expectStatus: 200,
    },

    // --- Customers ---
    {
      name: 'create customer',
      service: 'customers',
      method: 'POST',
      path: '/customers',
      body: (ctx) => ({
        name: `Synthetics ${ctx.runId}`,
        email: synthEmail(ctx),
        phone_number: '+2250707070707',
        metadata: { source: 'api_synthetics' },
      }),
      expectStatus: [200, 201],
      capture: (ctx, res) => {
        ctx.customerId =
          pickString(res.data, 'customer_id', 'id') ?? ctx.customerId;
      },
    },
    {
      name: 'get customer',
      service: 'customers',
      method: 'GET',
      path: (ctx) => `/customers/${ctx.customerId}`,
      expectStatus: 200,
      skipIf: (ctx) =>
        ctx.customerId ? null : 'customerId not captured from create',
    },

    // --- Products ---
    {
      name: 'create product',
      service: 'products',
      method: 'POST',
      path: '/products',
      body: (ctx) => ({
        name: `Synth product ${ctx.runId}`,
        product_type: 'one_time',
        prices: [{ amount: 1000, currency_code: 'XOF' }],
        metadata: { source: 'api_synthetics' },
      }),
      expectStatus: [200, 201],
      capture: (ctx, res) => {
        ctx.productId =
          pickString(res.data, 'product_id', 'id') ?? ctx.productId;
      },
    },
    {
      name: 'get product',
      service: 'products',
      method: 'GET',
      path: (ctx) => `/products/${ctx.productId}`,
      expectStatus: 200,
      skipIf: (ctx) =>
        ctx.productId ? null : 'productId not captured from create',
    },

    // --- Payment webhook (registered BEFORE charges so PAYMENT_SUCCEEDED is
    // captured; outbox dispatches bind to active webhooks at enqueue time) ---
    {
      name: 'register payment webhook (PAYMENT_SUCCEEDED)',
      service: 'webhooks',
      method: 'POST',
      path: '/webhooks',
      body: (ctx) => ({
        url: `https://postman-echo.com/post?synthetics_payment=${ctx.runId}`,
        authorized_events: ['PAYMENT_SUCCEEDED'],
        description: 'API synthetics payment webhook',
      }),
      expectStatus: [200, 201],
      validate: (_ctx, res) => validateWebhookCreateResponse(res.data),
      capture: (ctx, res) => {
        const data = unwrapData(res.data) as Record<string, unknown>;
        const id =
          (typeof data?.id === 'string' ? data.id : undefined) ??
          pickString(res.data, 'webhook_id', 'id');
        if (id) ctx.paymentWebhookId = id;
      },
    },

    // --- Charges: Wave ---
    {
      name: 'charge wave pending scenario',
      service: 'charges',
      method: 'POST',
      path: '/charge/wave',
      headers: () => ({
        'X-Scenario-Key': 'pending',
        'Idempotency-Key': newIdempotencyKey(),
      }),
      body: () => ({
        amount: 1000,
        currency: 'XOF',
        customer: {
          name: 'Synth Wave',
          email: 'wave@lomi.test',
          phoneNumber: '+2250707070701',
        },
        description: 'API synthetics wave pending',
      }),
      expectStatus: [200, 201],
      validate: (_ctx, res) => {
        const data = unwrapData(res.data) as Record<string, unknown>;
        const status = String(data?.status ?? data?.transaction_status ?? '');
        const url =
          pickString(res.data, 'wave_launch_url', 'checkout_url') ??
          pickString(data, 'wave_launch_url', 'checkout_url');
        const next = data?.next_action as Record<string, unknown> | undefined;
        const redirect =
          next?.type === 'redirect' && typeof next.url === 'string';
        if (status.toUpperCase() !== 'PENDING' && !url && !redirect) {
          return 'Expected PENDING wave charge with redirect URL';
        }
        return null;
      },
    },
    {
      name: 'charge mtn auto-complete',
      service: 'charges',
      method: 'POST',
      path: '/charge/mtn',
      headers: () => ({ 'Idempotency-Key': newIdempotencyKey() }),
      body: () => ({
        amount: 1000,
        currency: 'XOF',
        customer: {
          name: 'Synth MTN',
          email: 'mtn@lomi.test',
          phoneNumber: '+2250707070702',
        },
        description: 'API synthetics mtn',
      }),
      expectStatus: [200, 201],
      capture: (ctx, res) => {
        ctx.transactionId =
          pickString(res.data, 'transaction_id', 'id') ?? ctx.transactionId;
      },
      validate: (_ctx, res) => {
        const data = unwrapData(res.data) as Record<string, unknown>;
        const status = String(data?.status ?? data?.transaction_status ?? '');
        if (status && status.toLowerCase() !== 'completed') {
          return `Expected completed MTN charge in sandbox, got "${status}"`;
        }
        return null;
      },
    },
    {
      name: 'charge mtn pending scenario',
      service: 'charges',
      method: 'POST',
      path: '/charge/mtn',
      headers: () => ({
        'X-Scenario-Key': 'pending',
        'Idempotency-Key': newIdempotencyKey(),
      }),
      body: () => ({
        amount: 1000,
        currency: 'XOF',
        customer: {
          name: 'Synth MTN Pending',
          email: 'mtn-pending@lomi.test',
          phoneNumber: '+2250707070703',
        },
        description: 'API synthetics mtn pending',
      }),
      expectStatus: [200, 201],
      capture: (ctx, res) => {
        ctx.pendingTransactionId =
          pickString(res.data, 'transaction_id', 'id') ??
          ctx.pendingTransactionId;
      },
      validate: (_ctx, res) => {
        const data = unwrapData(res.data) as Record<string, unknown>;
        const status = String(data?.status ?? data?.transaction_status ?? '');
        if (status.toUpperCase() !== 'PENDING') {
          return `Expected PENDING MTN charge in sandbox, got "${status}"`;
        }
        return null;
      },
    },
    {
      name: 'get mtn pending transaction ledger status',
      service: 'transactions',
      method: 'GET',
      path: (ctx) => `/transactions/${ctx.pendingTransactionId}`,
      expectStatus: 200,
      skipIf: (ctx) =>
        ctx.pendingTransactionId
          ? null
          : 'pendingTransactionId not captured from pending charge',
      validate: (_ctx, res) => {
        const data = unwrapData(res.data) as Record<string, unknown>;
        const status = String(data?.status ?? data?.transaction_status ?? '');
        if (status.toLowerCase() !== 'pending') {
          return `Expected pending ledger status, got "${status}"`;
        }
        return null;
      },
    },
    {
      name: 'charge mtn failed scenario',
      service: 'charges',
      method: 'POST',
      path: '/charge/mtn',
      headers: () => ({
        'X-Scenario-Key': 'failed',
        'Idempotency-Key': newIdempotencyKey(),
      }),
      body: () => ({
        amount: 1000,
        currency: 'XOF',
        customer: {
          name: 'Synth MTN Fail',
          phoneNumber: '+2250707070704',
        },
      }),
      expectStatus: 400,
      validate: (_ctx, res) => {
        const txId = pickString(res.data, 'transaction_id', 'id');
        if (txId) {
          return 'Failed scenario must not return a transaction_id';
        }
        return null;
      },
    },
    {
      name: 'charge switch muted (unavailable)',
      service: 'charges',
      method: 'POST',
      path: '/charge/switch',
      headers: () => ({
        'X-Scenario-Key': 'approved',
        'Idempotency-Key': newIdempotencyKey(),
      }),
      body: (ctx) => ({
        amount: 1000,
        currency_code: 'XOF',
        pan: '4221941234569109',
        expiry: '06/30',
        cvv: '123',
        customer_email: synthEmail(ctx),
        customer_name: 'Synth Switch',
      }),
      expectStatus: 503,
      validate: (_ctx, res) => validateUnavailableChargeResponse(res.data),
    },
    {
      name: 'charge card muted (unavailable)',
      service: 'charges',
      method: 'POST',
      path: '/charge/card',
      headers: () => ({ 'Idempotency-Key': newIdempotencyKey() }),
      body: (ctx) => ({
        amount: 1000,
        currency_code: 'XOF',
        customer_email: synthEmail(ctx),
        customer_name: 'Synth Card',
      }),
      expectStatus: 503,
      validate: (_ctx, res) => validateUnavailableChargeResponse(res.data),
    },

    // --- Refunds ---
    {
      name: 'create refund',
      service: 'refunds',
      method: 'POST',
      path: '/refunds',
      headers: () => ({ 'Idempotency-Key': newIdempotencyKey() }),
      body: (ctx) => ({
        transaction_id: ctx.transactionId,
        amount: 100,
        reason: 'API synthetics partial refund',
      }),
      expectStatus: [200, 201],
      skipIf: (ctx) =>
        ctx.transactionId ? null : 'transactionId not captured from MTN charge',
      capture: (ctx, res) => {
        ctx.refundId = pickString(res.data, 'refund_id', 'id') ?? ctx.refundId;
      },
    },
    {
      name: 'get refund',
      service: 'refunds',
      method: 'GET',
      path: (ctx) => `/refunds/${ctx.refundId}`,
      expectStatus: 200,
      skipIf: (ctx) =>
        ctx.refundId ? null : 'refundId not captured from create',
    },

    // --- Checkout / links / requests ---
    {
      name: 'create checkout session',
      service: 'checkout-sessions',
      method: 'POST',
      path: '/checkout-sessions',
      headers: () => ({ 'Idempotency-Key': newIdempotencyKey() }),
      body: () => ({
        currency_code: 'XOF',
        amount: 1000,
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        title: 'API synthetics checkout',
      }),
      expectStatus: [200, 201],
      capture: (ctx, res) => {
        ctx.checkoutSessionId =
          pickString(res.data, 'checkout_session_id', 'id') ??
          ctx.checkoutSessionId;
      },
    },
    {
      name: 'create checkout session without currency uses org default',
      service: 'checkout-sessions',
      method: 'POST',
      path: '/checkout-sessions',
      headers: () => ({ 'Idempotency-Key': newIdempotencyKey() }),
      body: () => ({
        amount: 1000,
        title: 'API synthetics checkout default currency',
      }),
      expectStatus: [200, 201],
      validate: (_ctx, res) => {
        const currency =
          (res.data as { currency_code?: string } | null)?.currency_code ??
          (res.data as { data?: { currency_code?: string } })?.data
            ?.currency_code;
        return currency ? null : 'expected resolved currency_code on create';
      },
    },
    {
      name: 'get checkout session',
      service: 'checkout-sessions',
      method: 'GET',
      path: (ctx) => `/checkout-sessions/${ctx.checkoutSessionId}`,
      expectStatus: 200,
      skipIf: (ctx) =>
        ctx.checkoutSessionId
          ? null
          : 'checkoutSessionId not captured from create',
    },
    {
      name: 'create payment link',
      service: 'payment-links',
      method: 'POST',
      path: '/payment-links',
      body: () => ({
        link_type: 'instant',
        title: 'API synthetics link',
        currency_code: 'XOF',
        amount: 1000,
      }),
      expectStatus: [200, 201],
      capture: (ctx, res) => {
        ctx.paymentLinkId =
          pickString(res.data, 'link_id', 'payment_link_id', 'id') ??
          ctx.paymentLinkId;
      },
    },
    {
      name: 'get payment link',
      service: 'payment-links',
      method: 'GET',
      path: (ctx) => `/payment-links/${ctx.paymentLinkId}`,
      expectStatus: 200,
      skipIf: (ctx) =>
        ctx.paymentLinkId ? null : 'paymentLinkId not captured',
    },
    {
      name: 'create payment request',
      service: 'payment-requests',
      method: 'POST',
      path: '/payment-requests',
      headers: () => ({ 'Idempotency-Key': newIdempotencyKey() }),
      body: (ctx) => ({
        amount: 1000,
        currency_code: 'XOF',
        description: 'API synthetics request',
        expiry_date: futureExpiry(),
        customer_id: ctx.customerId,
      }),
      expectStatus: [200, 201],
      skipIf: (ctx) =>
        ctx.customerId ? null : 'customerId required for payment request',
      capture: (ctx, res) => {
        ctx.paymentRequestId =
          pickString(res.data, 'request_id', 'payment_request_id', 'id') ??
          ctx.paymentRequestId;
      },
    },
    {
      name: 'get payment request',
      service: 'payment-requests',
      method: 'GET',
      path: (ctx) => `/payment-requests/${ctx.paymentRequestId}`,
      expectStatus: 200,
      skipIf: (ctx) =>
        ctx.paymentRequestId ? null : 'paymentRequestId not captured',
    },

    // --- Transactions / subscriptions ---
    {
      name: 'list transactions',
      service: 'transactions',
      method: 'GET',
      path: '/transactions?pageSize=1',
      expectStatus: 200,
    },
    {
      name: 'get transaction',
      service: 'transactions',
      method: 'GET',
      path: (ctx) => `/transactions/${ctx.transactionId}`,
      expectStatus: 200,
      skipIf: (ctx) =>
        ctx.transactionId ? null : 'transactionId not captured',
    },
    {
      name: 'list subscriptions',
      service: 'subscriptions',
      method: 'GET',
      path: '/subscriptions?pageSize=1',
      expectStatus: 200,
    },

    // --- Coupons ---
    {
      name: 'create discount coupon',
      service: 'discount-coupons',
      method: 'POST',
      path: '/discount-coupons',
      body: (ctx) => ({
        code: synthCode(ctx, 'SYN'),
        discount_type: 'percentage',
        discount_percentage: 10,
      }),
      expectStatus: [200, 201],
      capture: (ctx, res) => {
        ctx.couponId = pickString(res.data, 'coupon_id', 'id') ?? ctx.couponId;
      },
    },
    {
      name: 'get discount coupon',
      service: 'discount-coupons',
      method: 'GET',
      path: (ctx) => `/discount-coupons/${ctx.couponId}`,
      expectStatus: 200,
      skipIf: (ctx) => (ctx.couponId ? null : 'couponId not captured'),
    },

    // --- Metering ---
    {
      name: 'create meter',
      service: 'metering',
      method: 'POST',
      path: '/meters',
      body: (ctx) => ({
        name: `synth_${ctx.runId.replace(/-/g, '').slice(0, 12)}`,
        aggregation: { type: 'sum', property: 'quantity' },
      }),
      expectStatus: [200, 201],
      capture: (ctx, res) => {
        const name = pickString(res.data, 'name', 'meter_code');
        if (name) ctx.meterName = name;
        const meterId = pickString(res.data, 'meter_id', 'id');
        if (meterId) ctx.meterId = meterId;
      },
    },
    {
      name: 'list meters',
      service: 'metering',
      method: 'GET',
      path: '/meters',
      expectStatus: 200,
    },
    {
      name: 'ingest usage event',
      service: 'metering',
      method: 'POST',
      path: '/usage-events',
      body: (ctx) => {
        ctx.usageQuantity = 3;
        return {
          transaction_id: `synth_evt_${ctx.runId}`,
          code: ctx.meterName,
          customer_id: ctx.customerId,
          quantity: ctx.usageQuantity,
        };
      },
      expectStatus: [200, 201, 202],
      skipIf: (ctx) => {
        if (!ctx.meterName) return 'meterName not captured';
        if (!ctx.customerId) return 'customerId required for usage event';
        return null;
      },
      capture: (ctx, res) => {
        const eventId = pickString(res.data, 'event_id', 'id');
        if (eventId) ctx.usageEventId = eventId;
      },
    },
    {
      name: 'usage event processed',
      service: 'metering',
      method: 'GET',
      path: (ctx) => `/usage-events/${ctx.usageEventId}`,
      expectStatus: 200,
      // BullMQ pickup can lag under full-suite load; match subscription retry budget.
      retry: { attempts: 15, delayMs: 2000 },
      skipIf: (ctx) =>
        ctx.usageEventId ? null : 'usageEventId not captured from ingest',
      validate: (_ctx, res) => validateUsageEventProcessed(res.data),
    },
    {
      name: 'meter balance reflects usage',
      service: 'metering',
      method: 'GET',
      path: (ctx) => `/meters/${ctx.meterId}/balances/${ctx.customerId}`,
      expectStatus: 200,
      retry: { attempts: 15, delayMs: 2000 },
      skipIf: (ctx) => {
        if (!ctx.meterId) return 'meterId not captured from create meter';
        if (!ctx.customerId) return 'customerId required for meter balance';
        if (ctx.usageQuantity == null) {
          return 'usageQuantity not set from ingest';
        }
        return null;
      },
      validate: (ctx, res) =>
        validateMeterBalanceAtLeast(res.data, ctx.usageQuantity ?? 0),
    },

    // --- Usage billing: subscription-tied metering (product-linked meter
    // forces the active_usage_subscription_required path) ---
    {
      name: 'create usage_based product',
      service: 'metering',
      method: 'POST',
      path: '/products',
      body: (ctx) => ({
        name: `Synth usage ${ctx.runId}`,
        product_type: 'usage_based',
        usage_unit: 'api_calls',
        usage_aggregation: 'sum',
        prices: [
          {
            amount: 100,
            currency_code: 'XOF',
            billing_interval: 'month',
            pricing_model: 'standard',
            is_default: true,
          },
        ],
        metadata: { source: 'api_synthetics' },
      }),
      expectStatus: [200, 201],
      capture: (ctx, res) => {
        ctx.usageProductId =
          pickString(res.data, 'product_id', 'id') ?? ctx.usageProductId;
      },
    },
    {
      name: 'discover usage product meter',
      service: 'metering',
      method: 'GET',
      path: (ctx) => `/meters?productId=${ctx.usageProductId}`,
      expectStatus: 200,
      retry: { attempts: 5, delayMs: 1000 },
      skipIf: (ctx) =>
        ctx.usageProductId ? null : 'usageProductId not captured from product',
      validate: (_ctx, res) => {
        const rows = Array.isArray(res.data)
          ? res.data
          : ((res.data as { data?: unknown[] })?.data ?? []);
        const name = (rows[0] as Record<string, unknown>)?.name;
        return typeof name === 'string' && name.length > 0
          ? null
          : 'Expected an auto-created meter for the usage_based product';
      },
      capture: (ctx, res) => {
        const rows = Array.isArray(res.data)
          ? res.data
          : ((res.data as { data?: unknown[] })?.data ?? []);
        const name = (rows[0] as Record<string, unknown>)?.name;
        if (typeof name === 'string' && name.length > 0) {
          ctx.usageMeterCode = name;
        }
      },
    },
    {
      name: 'create usage subscription',
      service: 'metering',
      method: 'POST',
      path: '/usage-subscriptions',
      body: (ctx) => ({
        customer_id: ctx.customerId,
        product_id: ctx.usageProductId,
      }),
      expectStatus: [200, 201],
      skipIf: (ctx) => {
        if (!ctx.customerId)
          return 'customerId required for usage subscription';
        if (!ctx.usageProductId) return 'usageProductId not captured';
        return null;
      },
      capture: (ctx, res) => {
        ctx.usageSubscriptionId =
          pickString(res.data, 'subscription_id', 'id') ??
          ctx.usageSubscriptionId;
      },
    },
    {
      name: 'ingest subscription usage event',
      service: 'metering',
      method: 'POST',
      path: '/usage-events',
      body: (ctx) => {
        ctx.usageSubQuantity = 4;
        return {
          transaction_id: `synth_subevt_${ctx.runId}`,
          code: ctx.usageMeterCode,
          customer_id: ctx.customerId,
          subscription_id: ctx.usageSubscriptionId,
          quantity: ctx.usageSubQuantity,
        };
      },
      expectStatus: [200, 201, 202],
      skipIf: (ctx) => {
        if (!ctx.usageMeterCode) return 'usageMeterCode not discovered';
        if (!ctx.customerId) return 'customerId required for usage event';
        if (!ctx.usageSubscriptionId) return 'usageSubscriptionId not captured';
        return null;
      },
      capture: (ctx, res) => {
        const eventId = pickString(res.data, 'event_id', 'id');
        if (eventId) ctx.usageSubEventId = eventId;
      },
    },
    {
      name: 'subscription usage event processed',
      service: 'metering',
      method: 'GET',
      path: (ctx) => `/usage-events/${ctx.usageSubEventId}`,
      expectStatus: 200,
      retry: { attempts: 12, delayMs: 2000 },
      skipIf: (ctx) =>
        ctx.usageSubEventId ? null : 'usageSubEventId not captured from ingest',
      validate: (_ctx, res) => validateUsageEventProcessed(res.data),
    },
    {
      name: 'subscription usage reflects balance',
      service: 'metering',
      method: 'GET',
      path: (ctx) =>
        `/usage-billing/subscriptions/${ctx.usageSubscriptionId}/usage`,
      expectStatus: 200,
      retry: { attempts: 8, delayMs: 2000 },
      skipIf: (ctx) => {
        if (!ctx.usageSubscriptionId) return 'usageSubscriptionId not captured';
        if (ctx.usageSubQuantity == null) return 'usageSubQuantity not set';
        return null;
      },
      validate: (ctx, res) =>
        validateSubscriptionUsage(res.data, ctx.usageSubQuantity ?? 0),
    },
    {
      name: 'list usage billing periods',
      service: 'metering',
      method: 'GET',
      path: (ctx) =>
        `/usage-billing/periods?subscription_id=${ctx.usageSubscriptionId}&page=1&page_size=5`,
      expectStatus: 200,
      skipIf: (ctx) =>
        ctx.usageSubscriptionId ? null : 'usageSubscriptionId not captured',
      validate: (_ctx, res) => {
        const rows = Array.isArray(res.data)
          ? res.data
          : ((res.data as { data?: unknown[] })?.data ?? null);
        return Array.isArray(rows)
          ? null
          : 'Expected an array of billing periods';
      },
    },

    // --- Payouts (list smoke; mass batch API not exposed yet) ---
    {
      name: 'list payouts',
      service: 'payouts',
      method: 'GET',
      path: '/payouts?pageSize=1',
      expectStatus: 200,
      validate: (_ctx, res) => {
        const root = unwrapData(res.data) ?? res.data;
        if (!root || typeof root !== 'object') {
          return 'Expected payouts list payload';
        }
        return null;
      },
    },

    // --- Webhooks (CRUD + send + delivery logs + receiver-safe URL rejection) ---
    {
      name: 'reject unsafe webhook URL',
      service: 'webhooks',
      method: 'POST',
      path: '/webhooks',
      body: () => ({
        url: 'https://127.0.0.1/hook',
        authorized_events: ['PAYMENT_SUCCEEDED'],
      }),
      expectStatus: 400,
      validate: (_ctx, res) => {
        const err = validateMerchantFacingError(res.data);
        if (err && !err.includes('Generic internal_error')) return err;
        const message =
          (res.data as { error?: { message?: string } })?.error?.message ?? '';
        if (
          !message.toLowerCase().includes('url') &&
          !message.toLowerCase().includes('private') &&
          !message.toLowerCase().includes('invalid')
        ) {
          return `Expected actionable URL rejection, got: "${message}"`;
        }
        return null;
      },
    },
    {
      name: 'create webhook',
      service: 'webhooks',
      method: 'POST',
      path: '/webhooks',
      body: (ctx) => ({
        // postman-echo echoes POST with 200, so the sender → receiver → 2xx → log
        // roundtrip is genuinely exercised (example.com rejects POST with 405).
        url: `https://postman-echo.com/post?synthetics=${ctx.runId}`,
        authorized_events: ['PAYMENT_SUCCEEDED', 'PAYMENT_FAILED'],
        description: 'API synthetics webhook',
      }),
      expectStatus: [200, 201],
      validate: (_ctx, res) => validateWebhookCreateResponse(res.data),
      capture: (ctx, res) => {
        const root = res.data as Record<string, unknown>;
        const data = unwrapData(res.data) as Record<string, unknown>;
        const id =
          (typeof data?.id === 'string' ? data.id : undefined) ??
          pickString(res.data, 'webhook_id', 'id');
        if (id) ctx.webhookId = id;
        if (typeof root.secret === 'string') ctx.webhookSecret = root.secret;
      },
    },
    {
      name: 'list webhooks',
      service: 'webhooks',
      method: 'GET',
      path: '/webhooks',
      expectStatus: 200,
      validate: (_ctx, res) => validateWebhookListHasNoSecrets(res.data),
    },
    {
      name: 'test webhook delivery (sender → postman-echo 2xx receiver)',
      service: 'webhooks',
      method: 'POST',
      path: (ctx) => `/webhooks/${ctx.webhookId}/test`,
      expectStatus: 200,
      retry: { attempts: 3, delayMs: 2000 },
      skipIf: (ctx) =>
        ctx.webhookId ? null : 'webhookId not captured from create',
      validate: (_ctx, res) => validateWebhookTestDeliveryResponse(res.data),
      capture: (ctx, res) => {
        const logId = pickString(res.data, 'log_id');
        if (logId) ctx.webhookDeliveryLogId = logId;
      },
    },
    {
      name: 'list webhook delivery logs',
      service: 'webhooks',
      method: 'GET',
      path: (ctx) =>
        `/webhook-delivery-logs?webhookId=${ctx.webhookId}&limit=5`,
      expectStatus: 200,
      skipIf: (ctx) =>
        ctx.webhookId ? null : 'webhookId not captured from create',
      validate: (_ctx, res) => validateWebhookDeliveryLogs(res.data),
    },
    {
      name: 'logs webhook_delivery stream',
      service: 'logs',
      method: 'GET',
      path: (ctx) =>
        `/logs?type=webhook_delivery&webhook_id=${ctx.webhookId}&limit=5`,
      expectStatus: 200,
      retry: { attempts: 5, delayMs: 1000 },
      skipIf: (ctx) =>
        ctx.webhookId ? null : 'webhookId not captured from create',
      validate: (_ctx, res) =>
        validateLogsListResponse(res.data, 'webhook_delivery', {
          minEntries: 1,
        }),
    },
    {
      name: 'delete webhook cleanup',
      service: 'webhooks',
      method: 'DELETE',
      path: (ctx) => `/webhooks/${ctx.webhookId}`,
      expectStatus: [200, 204],
      skipIf: (ctx) =>
        ctx.webhookId ? null : 'webhookId not captured from create',
    },

    // --- Logs API (unified merchant observability) ---
    {
      name: 'logs api_request stream',
      service: 'logs',
      method: 'GET',
      path: '/logs?type=api_request&limit=5',
      expectStatus: 200,
      validate: (_ctx, res) =>
        validateLogsListResponse(res.data, 'api_request', {
          minEntries: 1,
          requireUsefulFields: true,
        }),
      capture: (ctx, res) => {
        const data = (res.data as { data?: Array<{ id?: string }> })?.data;
        const id = data?.[0]?.id;
        if (id) ctx.apiLogEntryId = id;
      },
    },
    {
      name: 'logs api_request entry by id',
      service: 'logs',
      method: 'GET',
      path: (ctx) => `/logs/api_request/${ctx.apiLogEntryId}`,
      expectStatus: 200,
      skipIf: (ctx) =>
        ctx.apiLogEntryId ? null : 'apiLogEntryId not captured from list',
      validate: (_ctx, res) =>
        validateLogEntryResponse(res.data, 'api_request'),
    },
    {
      name: 'logs api_error stream',
      service: 'logs',
      method: 'GET',
      path: '/logs?type=api_error&limit=5',
      expectStatus: 200,
      validate: (_ctx, res) =>
        validateLogsListResponse(res.data, 'api_error', {
          requireUsefulFields: false,
        }),
    },
    {
      name: 'logs activity stream',
      service: 'logs',
      method: 'GET',
      path: '/logs?type=activity&limit=5',
      expectStatus: 200,
      validate: (_ctx, res) =>
        validateLogsListResponse(res.data, 'activity', {
          requireUsefulFields: false,
        }),
    },

    // --- Real domain webhook: PAYMENT_SUCCEEDED from the MTN auto-complete
    // charge (async DB outbox -> queue -> delivery); placed late so the
    // pipeline has had time to deliver ---
    {
      name: 'payment webhook delivered (PAYMENT_SUCCEEDED)',
      service: 'webhooks',
      method: 'GET',
      path: (ctx) =>
        `/webhook-delivery-logs?webhookId=${ctx.paymentWebhookId}&limit=10`,
      expectStatus: 200,
      retry: { attempts: 15, delayMs: 2000 },
      skipIf: (ctx) =>
        ctx.paymentWebhookId
          ? null
          : 'paymentWebhookId not captured from register',
      validate: (_ctx, res) =>
        validatePaymentWebhookDelivered(res.data, 'PAYMENT_SUCCEEDED'),
    },

    // --- Radar / accounts ---
    {
      name: 'radar settings',
      service: 'radar',
      method: 'GET',
      path: '/organization/radar-settings',
      expectStatus: [200, 404],
    },
    {
      name: 'accounts balance',
      service: 'accounts',
      method: 'GET',
      path: '/accounts/balance',
      expectStatus: 200,
    },

    // --- Cleanup ---
    {
      name: 'delete payment webhook cleanup',
      service: 'webhooks',
      method: 'DELETE',
      path: (ctx) => `/webhooks/${ctx.paymentWebhookId}`,
      expectStatus: [200, 204],
      skipIf: (ctx) =>
        ctx.paymentWebhookId
          ? null
          : 'paymentWebhookId not captured from register',
    },
    {
      name: 'delete customer cleanup',
      service: 'customers',
      method: 'DELETE',
      path: (ctx) => `/customers/${ctx.customerId}`,
      expectStatus: [200, 204],
      skipIf: (ctx) =>
        ctx.customerId ? null : 'customerId not captured from create',
    },
  ];
}
