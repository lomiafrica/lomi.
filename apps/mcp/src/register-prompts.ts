import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { ToolsManifest } from './manifest.js';
import { toolRefForOperation } from './manifest-lookup.js';
import type { ProvisioningToolsManifest } from './register-provisioning-tools.js';

function provisionRef(
  manifest: ProvisioningToolsManifest | undefined,
  toolName: string,
  action: string,
): string {
  const tool = manifest?.tools.find((t) => t.name === toolName);
  return `${tool?.name ?? toolName} action=${action}`;
}

export function registerLomiPrompts(
  server: McpServer,
  manifest: ToolsManifest,
  provisioningManifest?: ProvisioningToolsManifest,
): void {
  const createProduct = toolRefForOperation(manifest, 'POST /products');
  const createCheckout = toolRefForOperation(manifest, 'POST /checkout-sessions');
  const createPaymentLink = toolRefForOperation(manifest, 'POST /payment-links');
  const createWebhook = toolRefForOperation(manifest, 'POST /webhooks');
  const listTransactions = toolRefForOperation(manifest, 'GET /transactions');
  const getTransaction = toolRefForOperation(manifest, 'GET /transactions/{id}');
  const financeSummary = toolRefForOperation(manifest, 'GET /finance/summary');
  const financeAging = toolRefForOperation(manifest, 'GET /finance/aging');
  const createExport = toolRefForOperation(manifest, 'POST /exports');
  const getExport = toolRefForOperation(manifest, 'GET /exports/{id}');
  const listInvoices = toolRefForOperation(manifest, 'GET /invoices');
  const testWebhook = toolRefForOperation(manifest, 'POST /webhooks/{id}/test');
  const listWebhookLogs = toolRefForOperation(
    manifest,
    'GET /webhooks/deliveries',
  );
  const createRefund = toolRefForOperation(manifest, 'POST /refunds');
  const getBalance = toolRefForOperation(manifest, 'GET /accounts/balance');
  const createTransfer = toolRefForOperation(manifest, 'POST /transfers');
  const listTransfers = toolRefForOperation(manifest, 'GET /transfers');
  const reverseTransfer = toolRefForOperation(
    manifest,
    'POST /transfers/{id}/reversals',
  );
  const createLoginLink = toolRefForOperation(
    manifest,
    'POST /network/accounts/{account}/login_links',
  );
  const createAccountSession = toolRefForOperation(
    manifest,
    'POST /network/account-sessions',
  );

  const createAccount = provisionRef(
    provisioningManifest,
    'lomi_provision',
    'create_account',
  );
  const uploadDocument = provisionRef(
    provisioningManifest,
    'lomi_provision',
    'upload_document',
  );
  const extractOnboarding = provisionRef(
    provisioningManifest,
    'lomi_provision',
    'extract',
  );
  const completeOnboarding = provisionRef(
    provisioningManifest,
    'lomi_provision',
    'complete',
  );
  const getProvisioningStatus = provisionRef(
    provisioningManifest,
    'lomi_provision',
    'status',
  );
  const getProvisioningApiKeys = provisionRef(
    provisioningManifest,
    'lomi_provision',
    'api_keys',
  );
  const requestLiveActivation = provisionRef(
    provisioningManifest,
    'lomi_provision',
    'request_live',
  );
  const getLiveActivationStatus = provisionRef(
    provisioningManifest,
    'lomi_provision',
    'live_status',
  );

  server.registerPrompt(
    'provision_merchant_from_zero',
    {
      title: 'Provision a merchant from zero on lomi.',
      description:
        'Agent-driven onboarding: account, documents, KYC submit, test API keys, then integration.',
    },
    async () => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Provision a new merchant on lomi. from zero using provisioning MCP tools (requires LOMI_PROVISIONING_KEY / x-lomi-provisioning-key):',
              `1. ${createAccount}, create merchant account with terms acceptance metadata. Omit password: send the returned claim_url to the human so they set their own credentials; poll status for human_claimed`,
              `2. ${uploadDocument}, upload identity (and RCCM/address docs if registered business)`,
              `3. ${extractOnboarding}, extract fields from documents or website`,
              `4. ${completeOnboarding}, complete onboarding and submit KYC`,
              `5. ${getProvisioningStatus}, poll KYC / verification status`,
              `6. (optional) ${getProvisioningApiKeys}, re-fetch lomi_sk_test_* keys`,
              '',
              'After step 4 the session automatically adopts the returned lomi_sk_test_* secret key, so you can call merchant tools right away in the same session:',
              `   - ${createPaymentLink}, create a hosted payment link (simplest path to accept payment)`,
              `   - ${createProduct}, create a sellable product`,
              `   - ${createCheckout}, create a hosted checkout session`,
              `   - (optional) ${createWebhook}, register a webhook endpoint`,
              '',
              'TEST mode works immediately after step 4. To go LIVE:',
              `7. ${requestLiveActivation}, request live activation; share merchant_approval_path with the human merchant`,
              `8. ${getLiveActivationStatus}, poll until approved (starter: AI review; registered: admin review)`,
              '9. Merchant opens /connect/go-live on dashboard, approves, and retrieves lomi_sk_* live key themselves, never via provisioning API.',
              '',
              'Use idempotency_key on each write.',
            ].join('\n'),
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    'onboard_merchant',
    {
      title: 'Onboard a merchant on lomi.',
      description:
        'Step-by-step checklist: product, checkout session, optional webhook.',
    },
    async () => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Help me onboard on lomi. using MCP tools in this order:',
              `1. ${createProduct}, create a sellable product`,
              `2. ${createCheckout}, create a hosted checkout session`,
              `3. (optional) ${createWebhook}, register a webhook endpoint`,
              '',
              'Use idempotency_key on each write. Confirm sandbox vs production base URL first.',
              'Use lomi_search_tools if you need to find a different tool.',
            ].join('\n'),
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    'debug_failed_payment',
    {
      title: 'Debug a failed payment',
      description: 'Investigate a transaction using read-only list/get tools.',
    },
    async () => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'A payment failed. Investigate using MCP tools:',
              `1. ${listTransactions}, list recent transactions with filters`,
              `2. ${getTransaction}, fetch the specific transaction by id`,
              '3. Check related customer and subscription tools if applicable',
              '',
              'Do not issue refunds or cancels until the root cause is identified.',
            ].join('\n'),
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    'setup_webhook',
    {
      title: 'Set up a webhook',
      description: 'Create and test a webhook endpoint.',
    },
    async () => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Set up webhooks on lomi.:',
              `1. ${createWebhook}, create endpoint with target URL and events`,
              `2. ${testWebhook}, send a test delivery`,
              `3. ${listWebhookLogs}, verify deliveries`,
              '',
              'Use idempotency_key on create.',
            ].join('\n'),
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    'setup_network_operator',
    {
      title: 'Set up lomi. Network (operator)',
      description:
        'lomi. Network is our Stripe Connect: charge on behalf of Member Accounts (acct_…), take a fee, move funds with transfers. Covers use cases, charge models, setup, member onboarding, fees, refunds, transfers, login links, and webhooks.',
    },
    async () => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Help me run lomi. Network as an Operator. Your organization is the Operator; the businesses you serve are Member Accounts (acct_…). Every Member has its own lomi. balance and payouts; you charge on their behalf and keep a fee.',
              '',
              'PICK THE USE CASE',
              '- Marketplace (you sell for many sellers, buyers pay you): destination charges. You charge on your own account with transfer_data.destination = acct_…; at completion the funds minus your application_fee_amount are transferred to the seller. Buyers see your brand.',
              '- SaaS platform (each business sells to its own customers through your software): direct charges. Send header Lomi-Account: acct_… on the regular endpoints; the payment lands on the member and your application_fee_amount is moved member → operator at completion. Customers see the member.',
              '',
              'THREE CHARGE MODELS (same endpoints: checkout sessions, payment links, charge/wave|mtn|card)',
              '1. Direct: header Lomi-Account: acct_… + optional application_fee_amount. Member is credited; fee moves member → operator at completion.',
              '2. Destination: no Lomi-Account; body transfer_data: { destination: "acct_…", amount? } + application_fee_amount. Operator is charged, then funds minus fee transfer to the member at completion.',
              '3. Separate charges and transfers: operator charge with transfer_group, then later one or more POST /transfers to members sharing that transfer_group (split one payment across sellers, or pay later).',
              '',
              'SETUP PATH',
              `- Dashboard → Network → setup wizard: choose platform type (marketplace → destination recommended, saas → direct), charge model, fees_collector and losses_collector, member dashboard mode, onboarding mode (hosted or embedded). Finishing the wizard makes the Network active in TEST right away.`,
              `- Request live from the same panel; a lomi. admin reviews and approves. Until then live transfers and live Lomi-Account charges are refused.`,
              `- Use lomi_sk_test_* keys and a test member first; ${getBalance} with header_Lomi-Account = acct_… shows a member balance.`,
              '',
              'MEMBER ONBOARDING',
              '- Hosted: create an enrollment invite from Network → Enrollments and share https://dashboard.lomi.africa/network/enroll/{token}. The member signs in, picks or creates an organization, completes verification, adds a payout method, accepts the data-sharing terms. Activate the membership (pending → active); capabilities auto-grant for test first.',
              `- Embedded: ${createAccountSession} with body { account: "acct_…", components: { onboarding: {enabled}, payments: {enabled}, payouts: {enabled}, balance: {enabled}, notification_banner: {enabled} } } returns client_secret + embed_base_url to render lomi. components inside your own UI.`,
              `- Member dashboard access later: ${createLoginLink} (account = acct_…) returns a single-use, short-lived url. Operator key only, no Lomi-Account.`,
              '',
              'FEES',
              '- application_fee_amount on the charge overrides the fee rules for that payment; without it the default or member-assigned fee rule from Network → Fees applies.',
              '- fees_collector decides who pays lomi. processing fees (member or operator); losses_collector decides who absorbs refunds, disputes and negative balances. Both are set in the wizard / Settings tab.',
              '- Fees are recorded per transaction and show up as operator_fee transfers.',
              '',
              'REFUNDS',
              `- ${createRefund} with the same Lomi-Account header you charged with. Body flags: reverse_transfer (default true) pulls the destination/separate transfer back from the member; refund_application_fee (default true) returns your fee to the customer. Set either to false to keep the transfer or the fee.`,
              '- Refunds and payouts are two-step: first call returns { requires_confirmation, confirmation_token, expires_at, preview }; call again with confirmation_token to execute.',
              '',
              'TRANSFERS (separate charges, split payouts, ad-hoc money to a member)',
              `- ${createTransfer} body { amount, currency_code, destination: "acct_…", transfer_group?, source_transaction_id?, description?, metadata? }. Operator key, no Lomi-Account. First call returns a preview with confirmation_token; call again with confirmation_token to execute. Idempotency-Key is required on the executing call (reuse one key for both calls).`,
              `- ${listTransfers} filters: destination, transfer_group, source_transaction_id, transfer_type (destination, separate, operator_fee, processing_fee_cover, fee_reversal, transfer_reversal, loss_cover).`,
              `- ${reverseTransfer} body { amount?, description?, metadata?, confirmation_token? } reverses fully or partially; same two-step flow.`,
              '- The destination must be an active membership with the transfer.receive capability in that environment.',
              '',
              'WEBHOOKS',
              `- ${createWebhook} on the operator with NETWORK_PAYMENT_CREATED, NETWORK_OPERATOR_FEE_CREATED, NETWORK_OPERATOR_FEE_REVERSED, NETWORK_TRANSFER_CREATED, NETWORK_TRANSFER_REVERSED, NETWORK_MEMBER_PAYOUT_PAID. Then ${testWebhook} and ${listWebhookLogs}.`,
              '',
              'SUGGESTED ORDER',
              `1. Finish the dashboard wizard (test active) and onboard one test member (hosted invite or ${createAccountSession}).`,
              `2. ${createCheckout} in the chosen model (Lomi-Account for direct, transfer_data for destination, transfer_group for separate), then ${listTransactions} with the same header when direct.`,
              `3. For separate charges, ${createTransfer} to the member, then ${listTransfers} by transfer_group.`,
              `4. Test a refund with reverse_transfer / refund_application_fee, then a ${reverseTransfer}.`,
              '5. Subscribe the NETWORK_* webhooks and verify deliveries.',
              '6. Request live activation and wait for admin approval before switching to lomi_sk_* live keys.',
              '',
              'Send idempotency_key on every money write and never execute a confirmation_token preview without the operator confirming the amounts.',
            ].join('\n'),
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    'month_end_close',
    {
      title: 'Month-end close',
      description:
        'Pull a statement, list overdue invoices, send reminders, and export a journal.',
    },
    async () => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Run month-end close on lomi.:',
              `1. ${financeSummary}, snapshot cash, receivables, refunds, disputes`,
              `2. ${financeAging}, list overdue buckets`,
              `3. ${listInvoices}, find open/overdue invoices and send hosted_url reminders (do not invent emails)`,
              `4. ${createExport} type=statement_pdf, then ${getExport} until download_url`,
              `5. ${createExport} type=journal_csv, then ${getExport} for the accounting file`,
              '',
              'Do not create payouts or refunds during close unless the merchant confirms the confirmation_token preview.',
            ].join('\n'),
          },
        },
      ],
    }),
  );
}
