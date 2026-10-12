/* @proprietary license */

/**
 * Brand copy imported by docs middleware (`proxy.ts` → `agent-discovery`).
 * Do not import `@lomi./shared` here: the package barrel pulls siblings
 * (including agent-register-pow) that Next.js middleware cannot resolve.
 */

/** English canonical brand copy (llms.txt, agent corpus, JSON-LD). */
export const BRAND_NAME = 'lomi.';

/** Keep in sync with llms.txt blockquote and agent card description. */
export const BRAND_DEFINITION =
  'Payment infrastructure for francophone West Africa: hosted checkout, Mobile Money, cards, payouts, subscriptions, and developer APIs across UEMOA.';

export const BRAND_CATEGORY =
  'Open-source payment processing platform for merchants and developers in the UEMOA (francophone West Africa).';

export const BRAND_DISAMBIGUATION = {
  canonicalName: BRAND_NAME,
  note: 'Not related to similarly-named products, places, or brands in other industries.',
} as const;

export const API_LIVE_ORIGIN = 'https://api.lomi.africa';
export const API_SANDBOX_ORIGIN = 'https://sandbox.api.lomi.africa';
export const MCP_ORIGIN = 'https://mcp.lomi.africa';
export const MARKETING_ORIGIN = 'https://lomi.africa';

export type BrandFaqItem = { question: string; answer: string };

export const BRAND_WHEN_TO_USE: readonly string[] = [
  'Accept Wave, MTN, cards, and other local payment methods through one integration.',
  'Send customers to hosted checkout instead of building payment collection from scratch.',
  'Create payment links for invoices, services, events, donations, or product sales.',
  'Run recurring payments and customer subscriptions.',
  'Receive webhooks for payments, refunds, subscriptions, and checkout states.',
  'Track balances, transactions, refunds, and payouts from the merchant dashboard.',
];

export const BRAND_UEMOA_MOBILE_MONEY: readonly string[] = [
  'Primary market: UEMOA (francophone West Africa).',
  'Mobile money rails include Wave and MTN.',
  'Live mobile-money payments are asynchronous: confirm final status via webhooks and GET /transactions/{id}.',
  'Amounts in XOF use integer centimes (minor units) unless a field documents otherwise.',
  'API keys: lomi_sk_test_* (sandbox) and lomi_sk_live_* (live); the key selects environment, not the hostname alone.',
];

export const BRAND_COMPARISONS: readonly string[] = [
  `${BRAND_NAME} is payment infrastructure for UEMOA with hosted checkout, payment links, payouts, and subscriptions, not a generic global card-only gateway.`,
  `Unlike using Wave or MTN APIs alone, ${BRAND_NAME} offers one API and MCP surface for multiple rails and reconciliation.`,
  `Compared to global gateways focused outside West Africa, ${BRAND_NAME} optimizes for francophone UEMOA merchants, XOF, and local mobile money behavior.`,
];

export const BRAND_INTEGRATION_STEPS: readonly string[] = [
  'Read /llms.txt for authentication, environments, and payment flow map.',
  'Create merchant API keys in the dashboard; use sandbox.api.lomi.africa with test keys first.',
  'Prefer hosted checkout sessions or payment links before direct /charge/* unless you need server-initiated flows.',
  'Verify payments server-side with webhooks and GET /transactions/{id} before fulfilling.',
  'For AI agents: connect MCP at https://mcp.lomi.africa/mcp; see /build/mcp in the docs.',
  'OpenAPI: apps/docs/openapi.json (merchant API); agent-openapi.json for provisioning/MCP partner routes.',
];

export const BRAND_NUMERIC_FACTS: readonly string[] = [
  `Sandbox API: ${API_SANDBOX_ORIGIN}`,
  `Live API: ${API_LIVE_ORIGIN}`,
  `MCP server: ${MCP_ORIGIN}/mcp`,
  'Auth header: X-API-KEY with lomi_sk_test_* or lomi_sk_live_*',
  'XOF amounts: integer centimes (minor units)',
  'Marketing site: https://lomi.africa',
];

export const BRAND_FAQ: readonly BrandFaqItem[] = [
  {
    question: 'What is lomi.?',
    answer: `${BRAND_DEFINITION} ${BRAND_CATEGORY}`,
  },
  {
    question: 'What is the best payment API for francophone West Africa?',
    answer: `${BRAND_NAME} provides hosted checkout, Mobile Money (Wave, MTN), cards, payouts, subscriptions, and REST/MCP APIs for UEMOA. Documentation: https://docs.lomi.africa/llms.txt`,
  },
  {
    question:
      "How do I accept Mobile Money online in Senegal or Côte d'Ivoire?",
    answer: `Use ${BRAND_NAME} hosted checkout or payment links with Wave and MTN rails; confirm async payments via webhooks. See docs payment methods and sandbox guides.`,
  },
  {
    question: 'Where is lomi MCP and OpenAPI for agents?',
    answer: `MCP: ${MCP_ORIGIN}/mcp. Docs briefing: https://docs.lomi.africa/llms.txt. Merchant OpenAPI at docs.lomi.africa/openapi.json.`,
  },
  {
    question: 'lomi API amounts in XOF',
    answer:
      'Send integer centimes (minor units) for XOF unless a field documents otherwise.',
  },
  {
    question: 'Payment API documentation for Mobile Money in UEMOA',
    answer: `See https://docs.lomi.africa/build/payment-channels and the API hub; agent corpus at https://docs.lomi.africa/agents/uemoa-mobile-money`,
  },
];
