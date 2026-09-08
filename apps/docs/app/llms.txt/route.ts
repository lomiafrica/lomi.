/* @proprietary license */

import { buildLlmsGeoSections } from '@/lib/docs/agent-corpus/build';
import { REST_API_SECTION_ORDER } from '@/lib/scripts/manual-api/constants';
import { BRAND_DEFINITION } from '@/lib/seo/brand-facts';
import { getDocsSiteOrigin } from '@/lib/utils/metadata';
import { source } from '@/lib/utils/source';

export const revalidate = false;

/** Slugs referenced in llms.txt output (validated by `pnpm docs:drift`). */
const LLMS_CURATED_SLUGS = [
  'start/integration-journey',
  'build/reliability/verify-payments',
  'build/reliability/payment-lifecycle',
  'build/payment-channels',
  'build/mcp',
  'build/accept/checkout',
] as const;
void LLMS_CURATED_SLUGS;

function sectionTitleFromFolder(folder: string): string {
  return folder
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** First English MDX page under `api/{folder}/` (sorted by URL) for stable deep links. */
function firstApiPageInFolder(
  pages: ReturnType<typeof source.getPages>,
  folder: string,
) {
  return pages
    .filter((p) => p.slugs[0] === 'api' && p.slugs[1] === folder)
    .sort((a, b) => a.url.localeCompare(b.url))[0];
}

function pageBySlugPath(
  pages: ReturnType<typeof source.getPages>,
  path: string,
) {
  return pages.find((p) => p.slugs.join('/') === path);
}

export async function GET() {
  const docsOrigin = getDocsSiteOrigin();
  const pages = source.getPages('en');

  const lines: string[] = [];

  lines.push('# lomi.');
  lines.push('');
  lines.push(
    `> ${BRAND_DEFINITION} Use this file as a **map**: then read the linked pages for schemas and examples.`,
  );
  lines.push('');
  lines.push(buildLlmsGeoSections(docsOrigin));

  lines.push('## How to use this briefing');
  lines.push('');
  lines.push(
    '1. Read **Authentication** and **Integration quickstart** below.',
  );
  lines.push(
    '2. Pick one **Payment flow** that matches your product (hosted checkout, links, direct charge, subscriptions, usage billing, or payouts).',
  );
  lines.push(
    `3. Use the [API hub](${docsOrigin}/api) for Try-it and samples; treat \`apps/docs/openapi.json\` in the monorepo as the machine-readable contract.`,
  );
  lines.push('');

  lines.push('## Integration quickstart');
  lines.push('');
  lines.push(
    '- **Amounts (XOF):** integer **centimes** (minor units) unless a field documents otherwise.',
  );
  lines.push(
    '- **Keys:** `lomi_sk_test_…` / `lomi_sk_live_…`, the **API key selects sandbox vs live**, not the hostname alone.',
  );
  lines.push(
    '- **Verify server-side before fulfill:** never trust client-only success; use webhooks + `GET /transactions/{id}`.',
  );
  lines.push('');
  lines.push(
    '1. Create a merchant account and API keys in the [dashboard](https://dashboard.lomi.africa).',
  );
  lines.push(
    '2. Build against **sandbox** first (`https://sandbox.api.lomi.africa`), then switch to **live** (`https://api.lomi.africa`) with live keys.',
  );
  lines.push(
    '3. **Default integration path:** hosted checkout sessions or payment links before direct `/charge/*` calls unless you need a custom server-initiated flow.',
  );
  lines.push(
    '4. **Environment is determined by the API key**, not the hostname alone; sandbox keys only work against sandbox; live keys only against live.',
  );
  lines.push(
    '5. **Mobile money (live) is asynchronous:** the customer approves on device; confirm final status via webhooks and `GET /transactions/{id}` before fulfilling.',
  );
  const integrationJourney = pageBySlugPath(pages, 'start/integration-journey');
  const paymentMethodsHub = pageBySlugPath(pages, 'build/payment-channels');
  const verifyPayments = pageBySlugPath(
    pages,
    'build/reliability/verify-payments',
  );
  const paymentLifecycle = pageBySlugPath(
    pages,
    'build/reliability/payment-lifecycle',
  );
  const sandboxPayments = pageBySlugPath(pages, 'start/sandbox-payments');
  if (integrationJourney) {
    lines.push(
      `6. Follow the [integration journey](${docsOrigin}${integrationJourney.url}) for sandbox → webhooks → go-live.`,
    );
  }
  if (verifyPayments) {
    lines.push(
      `- [${verifyPayments.data.title ?? 'Verify payments'}](${docsOrigin}${verifyPayments.url}), confirm status before fulfilling.`,
    );
  }
  if (paymentLifecycle) {
    lines.push(
      `- [${paymentLifecycle.data.title ?? 'Payment lifecycle'}](${docsOrigin}${paymentLifecycle.url}), merchant-facing lifecycle hub.`,
    );
  }
  if (paymentMethodsHub) {
    lines.push(
      `- Supported countries and rails: [${paymentMethodsHub.data.title ?? 'Payment methods'}](${docsOrigin}${paymentMethodsHub.url}).`,
    );
  }
  if (sandboxPayments) {
    lines.push(
      `- Test cards and MoMo sandbox behavior: [${sandboxPayments.data.title ?? 'Sandbox payments'}](${docsOrigin}${sandboxPayments.url}).`,
    );
  }
  lines.push('');

  lines.push('## Markets');
  lines.push('');
  lines.push(
    `Coverage map. Details: [Payment channels](${docsOrigin}/build/payment-channels).`,
  );
  lines.push('');
  lines.push(
    "- **Côte d'Ivoire, Senegal, and UEMOA:** Wave (`XOF`), cards, and SPI on hosted checkout.",
  );
  lines.push(
    '- **MTN:** CI plus CM, GH, UG, ZM, BJ, CG, SZ, GN, ZA, LR, NG.',
  );
  lines.push(
    '- **Not lomi. rails:** Orange Money and Apple Pay. Djamo is coming for CI and SN.',
  );
  lines.push('');

  lines.push('## Authentication and environments');
  lines.push('');
  lines.push(
    'Send the merchant **API key** on every server-side call: header `X-API-KEY`. Sandbox and live keys are different; using the wrong key against an environment returns **401**. **The key determines sandbox vs live; not the request URL alone.**',
  );
  lines.push('');
  lines.push('- **Sandbox base URL**: `https://sandbox.api.lomi.africa`');
  lines.push('- **Live base URL**: `https://api.lomi.africa`');
  lines.push('');

  lines.push('## Idempotency, errors, and retries');
  lines.push('');
  lines.push(
    'Errors use the standard JSON shape with an HTTP status and a machine-readable message.',
  );
  lines.push(
    '**401** usually means a missing/invalid key; **404** means the resource does not exist for this API key; **429** means rate limiting.',
  );
  lines.push(
    'For **creates** that must not double-charge (payments, payouts), send an idempotency key when your client or gateway supports it.',
  );
  lines.push('');

  lines.push('## Payment flows (pick one)');
  lines.push('');
  lines.push(
    'Choose the path that matches your UX, not every merchant needs every API. **Prefer hosted checkout or payment links** unless you need direct charges.',
  );
  lines.push('');
  lines.push(
    '**MCP checkout (agents):** 1. `lomi_checkout action=create` and persist `id` plus `checkout_url`. 2. Send the customer `checkout_url`. 3. Create a webhook (`lomi_webhooks action=create`) and persist the signing secret. 4. After the webhook, confirm with `lomi_transactions action=get` before fulfilling. Guest bootstrap without a key: connect `https://mcp.lomi.africa/mcp/guest`, call `lomi_register_agent`, then `lomi_provision action=create_account` → `upload_document` → `complete` → `api_keys`; once a `lomi_sk_test_*` key is returned the same session gains the merchant tools (`notifications/tools/list_changed`), no reconnect. Humans with an account use the one-click OAuth buttons on `https://mcp.lomi.africa/mcp` instead. Live still needs `lomi_provision action=request_live` and human approval at https://dashboard.lomi.africa/connect/go-live.',
  );
  lines.push('');
  const hostedCheckout = pages.find(
    (p) => p.slugs[2] === 'CheckoutSessionsController_create',
  );
  if (hostedCheckout) {
    lines.push(
      `- **Hosted checkout**: buyer completes payment on the hosted experience: [Create checkout session](${docsOrigin}${hostedCheckout.url}).`,
    );
  }
  const plCreate = pages.find(
    (p) => p.slugs[2] === 'PaymentLinksController_create',
  );
  if (plCreate) {
    lines.push(
      `- **Shareable payment links** → [${plCreate.data.title ?? 'Create payment link'}](${docsOrigin}${plCreate.url}).`,
    );
  }
  const charge = pages.find(
    (p) => p.slugs[2] === 'ChargesController_createWaveCharge',
  );
  if (charge) {
    lines.push(
      `- **Direct mobile-money charge (server-initiated)** → [${charge.data.title ?? 'Charge'}](${docsOrigin}${charge.url}) when you are not using hosted checkout.`,
    );
  }
  const cardCharge = pages.find(
    (p) => p.slugs[2] === 'ChargesController_createCardCharge',
  );
  if (cardCharge) {
    lines.push(
      `- **Embedded card charge (Elements-style)** → [${cardCharge.data.title ?? 'Card charge'}](${docsOrigin}${cardCharge.url}) (**not available yet**: \`POST /charge/card\` returns \`503 service_unavailable\`; use [hosted checkout](/build/accept/checkout) for cards).`,
    );
  }
  const pr = pages.find(
    (p) => p.slugs[2] === 'PaymentRequestsController_create',
  );
  if (pr) {
    lines.push(
      `- **Payment request (invoice-style)** → [${pr.data.title ?? 'Create payment request'}](${docsOrigin}${pr.url}).`,
    );
  }
  const subList = firstApiPageInFolder(pages, 'subscriptions');
  if (subList) {
    lines.push(
      `- **Subscriptions** → explore [${subList.data.title ?? 'Subscriptions'}](${docsOrigin}${subList.url}) (list, cancel, per-customer).`,
    );
  }
  const usageBillingGuide = pageBySlugPath(
    pages,
    'build/billing/usage-billing',
  );
  const metersCreate = pages.find(
    (p) => p.slugs[2] === 'MetersController_create',
  );
  if (usageBillingGuide && metersCreate) {
    lines.push(
      `- **Usage billing (metered products)** → [${usageBillingGuide.data.title ?? 'Usage billing'}](${docsOrigin}${usageBillingGuide.url}), meters, usage events, billing periods ([Create meter](${docsOrigin}${metersCreate.url})).`,
    );
  }
  const payouts = firstApiPageInFolder(pages, 'payouts');
  if (payouts) {
    lines.push(
      `- **Payouts (self wallet or third-party beneficiaries)** → [${payouts.data.title ?? 'Payouts'}](${docsOrigin}${payouts.url}).`,
    );
  }
  const wh = firstApiPageInFolder(pages, 'webhooks');
  if (wh) {
    lines.push(
      `- **Outbound webhooks (events to your server)** → [${wh.data.title ?? 'Webhooks'}](${docsOrigin}${wh.url}) and delivery logs under the same API section.`,
    );
  }
  lines.push('');

  lines.push('## API by domain');
  lines.push('');
  lines.push(
    `Each item links into the generated endpoint pages for that resource group. Primary hub: [API](${docsOrigin}/api).`,
  );
  lines.push('');
  for (const folder of REST_API_SECTION_ORDER) {
    const p = firstApiPageInFolder(pages, folder);
    if (!p) continue;
    const label = sectionTitleFromFolder(folder);
    lines.push(
      `- **${label}**: [${p.data.title ?? label}](${docsOrigin}${p.url})`,
    );
  }
  lines.push('');

  lines.push('## Agent onboarding & MCP OAuth');
  lines.push('');
  lines.push(
    `Agents can onboard **new merchants** (0→1) via MCP provisioning tools or the \`/provisioning/*\` API. Full guide: [MCP for AI clients](${docsOrigin}/build/mcp). Machine contract: \`apps/docs/agent-openapi.json\` (provisioning + partner routes). Optional marketplace install: [lomiafrica/agent-plugin](https://github.com/lomiafrica/agent-plugin); the hosted MCP URL works without the plugin.`,
  );
  lines.push('');
  lines.push('**Credential types:**');
  lines.push('');
  lines.push(
    '- **`lomi_partner_*`**, platform management key (issued by lomi admin). Mint per-user `lomi_prov_*` via Partner API.',
  );
  lines.push(
    '- **`lomi_prov_*`**, provisioning key for `/provisioning/*` and MCP 0→1 tools (`x-lomi-provisioning-key`).',
  );
  lines.push(
    '- **`lomi_oat_*`**, OAuth access token from MCP authorization; MCP introspects it to a scoped `lomi_prov_*` session.',
  );
  lines.push('');
  lines.push(
    '**Partner API** (header `x-lomi-partner-key` or `Authorization: Bearer lomi_partner_*`):',
  );
  lines.push('');
  lines.push(
    '- `POST /partners/provisioning-keys`, mint scoped `lomi_prov_*` for `external_user_ref`',
  );
  lines.push('- `GET /partners/provisioning-keys`, list keys');
  lines.push('- `DELETE /partners/provisioning-keys/{id}`, revoke');
  lines.push('- `GET /partners/usage`, usage summary');
  lines.push('');
  lines.push(
    '**OAuth self-service** (MCP clients with authorization support):',
  );
  lines.push('');
  lines.push(
    '1. `GET https://mcp.lomi.africa/.well-known/oauth-protected-resource/mcp`',
  );
  lines.push('2. `POST https://api.lomi.africa/oauth/register` (optional DCR)');
  lines.push(
    '3. `GET https://api.lomi.africa/oauth/authorize` (PKCE + `resource`) → user approves at `https://dashboard.lomi.africa/connect/agent-connect`',
  );
  lines.push('4. `POST https://api.lomi.africa/oauth/token` → `lomi_oat_*`');
  lines.push(
    '5. Connect MCP with `Authorization: Bearer <access_token>`; session auto-adopts merchant `lomi_sk_test_*` after onboarding completes.',
  );
  lines.push('');
  lines.push(
    '**Two entry points, one product:** humans with (or wanting) a lomi. account use the one-click OAuth buttons; the consent page signs in or signs up, then resumes approval. Agents with no account use `https://mcp.lomi.africa/mcp/guest` + `lomi_register_agent`; the guest session upgrades to test merchant tools in place once `lomi_provision action=api_keys` returns a key. Live keys are dashboard-only.',
  );
  lines.push('');
  lines.push(
    '**Human claim link:** `POST /provisioning/accounts` without `password` returns `claim_url` (dashboard `/connect/claim?token=`, 7 days, single use). Send this link to the human; they set their own password and own the account. `GET .../onboarding/status` reports `human_claimed` and re-issues `claim_url` until true. Live approval requires a claimed account.',
  );
  lines.push('');
  lines.push('**Test → live (human-gated):**');
  lines.push('');
  lines.push(
    '- `POST /provisioning/merchants/{id}/live-activation/request`, agent requests go-live; share `merchant_approval_path` with the human merchant.',
  );
  lines.push(
    '- `GET /provisioning/merchants/{id}/live-activation/status`, poll until approved (`live_keys_available` means merchant can retrieve live key on dashboard).',
  );
  lines.push(
    '- Merchant approves at `https://dashboard.lomi.africa/connect/go-live` and retrieves `lomi_sk_*` live secret (never via provisioning API). Starter: AI KYC review; registered: admin approval.',
  );
  lines.push('');
  const mcpPage = pageBySlugPath(pages, 'build/mcp');
  if (mcpPage) {
    lines.push(
      `- [${mcpPage.data.title ?? 'MCP'}](${docsOrigin}${mcpPage.url}), tools, prompts, hosted server config`,
    );
  }
  lines.push('');

  lines.push('## Guides to read next');
  lines.push('');
  const whatIs = pageBySlugPath(pages, 'start/overview');
  if (whatIs) {
    lines.push(
      `- [${whatIs.data.title ?? 'What is lomi.?'}](${docsOrigin}${whatIs.url})`,
    );
  }
  if (integrationJourney) {
    lines.push(
      `- [${integrationJourney.data.title ?? 'Integration journey'}](${docsOrigin}${integrationJourney.url})`,
    );
  }
  if (verifyPayments) {
    lines.push(
      `- [${verifyPayments.data.title ?? 'Verify payments'}](${docsOrigin}${verifyPayments.url})`,
    );
  }
  if (paymentLifecycle) {
    lines.push(
      `- [${paymentLifecycle.data.title ?? 'Payment lifecycle'}](${docsOrigin}${paymentLifecycle.url})`,
    );
  }
  if (paymentMethodsHub) {
    lines.push(
      `- [${paymentMethodsHub.data.title ?? 'Payment methods'}](${docsOrigin}${paymentMethodsHub.url})`,
    );
  }
  const mcp = pageBySlugPath(pages, 'build/mcp');
  if (mcp) {
    lines.push(`- [${mcp.data.title ?? 'MCP'}](${docsOrigin}${mcp.url})`);
  }
  const taskGuide = pageBySlugPath(pages, 'build/accept/checkout');
  if (taskGuide) {
    lines.push(
      `- [${taskGuide.data.title ?? 'Checkout'}](${docsOrigin}${taskGuide.url}), REST / MCP / CLI / SDK for the same job`,
    );
  }
  lines.push('');

  lines.push('## Document map (browse by section)');
  lines.push('');
  lines.push(
    'Prefer section sidebars on the docs site for exhaustive lists. High-level areas:',
  );
  lines.push('');
  const catOrder = ['start', 'build', 'api', 'resources'];
  const byCat = new Map<
    string,
    { title: string; url: string; description?: string }[]
  >();
  for (const page of pages) {
    const category = page.slugs[0] || 'general';
    const list = byCat.get(category) ?? [];
    list.push({
      title: page.data.title ?? 'lomi.',
      url: `${docsOrigin}${page.url}`,
      description: page.data.description,
    });
    byCat.set(category, list);
  }
  for (const cat of catOrder) {
    const list = byCat.get(cat);
    if (!list?.length) continue;
    const sample = list.slice(0, 4);
    lines.push(`### ${cat}`);
    for (const entry of sample) {
      lines.push(
        `- [${entry.title}](${entry.url})${entry.description ? `, ${entry.description}` : ''}`,
      );
    }
    if (list.length > sample.length) {
      lines.push(
        `_…and ${list.length - sample.length} more pages in this section (see docs sidebar)._`,
      );
    }
    lines.push('');
  }
  for (const [category, list] of byCat) {
    if (catOrder.includes(category)) continue;
    const sample = list.slice(0, 3);
    lines.push(`### ${category}`);
    for (const entry of sample) {
      lines.push(
        `- [${entry.title}](${entry.url})${entry.description ? `, ${entry.description}` : ''}`,
      );
    }
    if (list.length > sample.length) {
      lines.push(
        `_…and ${list.length - sample.length} more pages (see docs sidebar)._`,
      );
    }
    lines.push('');
  }

  lines.push('## Contact and support');
  lines.push('');
  lines.push('- Website: https://lomi.africa');
  lines.push(`- Documentation: ${docsOrigin}/start/overview`);
  lines.push('- Email: hello@lomi.africa');
  lines.push('- GitHub: https://github.com/lomiafrica/lomi./');
  lines.push('- Discord: https://discord.gg/33syDfh9');
  lines.push('- X: https://twitter.com/lomiafrica');
  lines.push('');

  lines.push('## Common questions');
  lines.push('');
  lines.push(
    `**Where do schemas live?** Use the [API](${docsOrigin}/api) explorer and the OpenAPI export at \`apps/docs/openapi.json\` (generated from \`apps/api\`).`,
  );
  const txHub = firstApiPageInFolder(pages, 'transactions');
  if (txHub) {
    lines.push(
      `**How do I reconcile payments?** Start from [${txHub.data.title ?? 'Transactions'}](${docsOrigin}${txHub.url}) and tie provider references to your internal order IDs using metadata on creates.`,
    );
  }
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
