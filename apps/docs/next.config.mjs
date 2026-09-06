import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** Old Build URLs after the folder regroup. Keep these so website, dashboard, and indexed links still resolve. */
const MOVED_DOC_REDIRECTS = [
  ['/build/checkout', '/build/accept/checkout'],
  ['/build/payment-links', '/build/accept/payment-links'],
  ['/build/payment-requests', '/build/accept/payment-requests'],
  ['/build/embed-widget', '/build/accept/embed-widget'],
  ['/build/direct-charges', '/build/accept/direct-charges'],
  ['/build/bnpl', '/build/accept'],
  ['/build/accept/bnpl', '/build/accept'],
  ['/resources/contributing/bnpl-gates', '/resources/contributing'],
  ['/build/whatsapp-commerce', '/build/accept/whatsapp-commerce'],
  ['/build/digital-products', '/build/accept/digital-products'],
  ['/build/payments/checkout-behavior', '/build/accept/checkout-behavior'],
  ['/build/payments/lomi-payment-elements', '/build/accept/payment-elements'],
  ['/build/payments/charges', '/build/accept/direct-charges'],
  ['/build/payments/payout-lifecycle', '/build/reliability/payment-lifecycle'],
  ['/build/payments/coupon-logic-examples', '/build/billing/discount-coupons'],
  ['/build/products', '/build/billing/products'],
  ['/build/subscriptions', '/build/billing/subscriptions'],
  ['/build/usage-billing', '/build/billing/usage-billing'],
  ['/build/customer-portal', '/build/billing/customer-portal'],
  ['/build/discount-coupons', '/build/billing/discount-coupons'],
  ['/build/transactions', '/build/money/transactions'],
  ['/build/refunds', '/build/money/refunds'],
  ['/build/disputes', '/build/money/disputes'],
  ['/build/radar', '/build/money/radar'],
  ['/build/payouts', '/build/money/payouts'],
  ['/build/balance-and-settlement', '/build/money/balance-and-settlement'],
  ['/build/webhooks', '/build/reliability'],
  ['/build/advanced-guides', '/build/reliability'],
  [
    '/build/advanced-guides/handling-webhooks',
    '/build/reliability/handling-webhooks',
  ],
  [
    '/build/advanced-guides/webhook-reliability',
    '/build/reliability/webhook-reliability',
  ],
  [
    '/build/advanced-guides/error-handling',
    '/build/reliability/error-handling',
  ],
  [
    '/build/advanced-guides/idempotency-keys',
    '/build/reliability/idempotency-keys',
  ],
  [
    '/build/advanced-guides/security-best-practices',
    '/build/reliability/security-best-practices',
  ],
  ['/build/advanced-guides/testing', '/build/reliability/testing'],
  ['/build/advanced-guides/ci-cd', '/build/reliability/ci-cd'],
  ['/build/cli/overview', '/build/cli'],
  ['/build/tasks', '/start/overview'],
  ['/build/tasks/take-a-payment', '/build/accept/checkout'],
  ['/build/tasks/bill-monthly', '/build/billing/subscriptions'],
  ['/build/tasks/meter-usage', '/build/billing/usage-billing'],
  ['/build/tasks/pay-out', '/build/money/payouts'],
  ['/build/tasks/refunds-and-disputes', '/build/money/refunds'],
  ['/build/tasks/reconcile-settlements', '/build/money/balance-and-settlement'],
  ['/build/guides', '/build/reliability'],
  ['/build/guides/verify-payments', '/build/reliability/verify-payments'],
  ['/build/guides/simulate-errors', '/build/reliability/simulate-errors'],
  ['/build/guides/payment-lifecycle', '/build/reliability/payment-lifecycle'],
  ['/resources/support', '/start/support'],
  ['/resources/security', '/build/reliability/security-best-practices'],
  ['/resources/network', '/build/platform/network'],
  ['/resources/network/onboarding-journey', '/build/platform/network'],
  ['/resources/merchant-of-record', '/start/merchant-of-record/pricing'],
  ['/start/merchant-of-record', '/start/merchant-of-record/pricing'],
  [
    '/resources/merchant-of-record/pricing',
    '/start/merchant-of-record/pricing',
  ],
  ['/resources/merchant-of-record/terms', '/start/merchant-of-record/terms'],
  [
    '/resources/merchant-of-record/privacy',
    '/start/merchant-of-record/privacy',
  ],
  [
    '/resources/merchant-of-record/cookies',
    '/start/merchant-of-record/cookies',
  ],
  [
    '/resources/merchant-of-record/acceptable-use',
    '/start/merchant-of-record/acceptable-use',
  ],
  [
    '/resources/merchant-of-record/account-reviews',
    '/start/merchant-of-record/account-reviews',
  ],
  [
    '/resources/merchant-of-record/refunds',
    '/start/merchant-of-record/refunds',
  ],
  ['/resources/open-source/open-source', '/resources/open-source'],
  ['/resources/open-source/codebase', '/resources/open-source'],
].map(([source, destination]) => ({
  source,
  destination,
  permanent: true,
}));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  devIndicators: false,
  transpilePackages: ['@lomi./ui', '@lomi./shared'],
  serverExternalPackages: ['prettier'],
  // `/llms.mdx/*` re-reads MDX at request time (locale cookie). Include the
  // content tree so Vercel serverless does not ENOENT after generateStaticParams.
  outputFileTracingIncludes: {
    '/llms.mdx/[...slug]': ['./content/docs/**/*'],
    '/llms.mdx': ['./content/docs/**/*'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  turbopack: {},
  webpack(webpackConfig) {
    webpackConfig.resolve = webpackConfig.resolve ?? {};
    webpackConfig.resolve.extensionAlias = {
      ...webpackConfig.resolve.extensionAlias,
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
    };
    return webpackConfig;
  },
  async redirects() {
    return [
      {
        source: '/core/introduction/what-is-lomi',
        destination: '/start/overview',
        permanent: true,
      },
      {
        source: '/build/lomi-ui',
        destination: '/build/choose-integration',
        permanent: true,
      },
      {
        source: '/build/lomi-ui/:path*',
        destination: '/build/choose-integration',
        permanent: true,
      },
      {
        source: '/build/cli/ui',
        destination: '/build/cli',
        permanent: true,
      },
      {
        source: '/build/guides/payment-methods',
        destination: '/build/payment-channels',
        permanent: true,
      },
      {
        source: '/build/cards',
        destination: '/build/payment-methods/cards',
        permanent: true,
      },
      {
        source: '/resources/changelog',
        destination: 'https://lomi.africa/changelog',
        permanent: true,
      },
      ...MOVED_DOC_REDIRECTS,
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
    ];
  },
};

export default withMDX(config);
