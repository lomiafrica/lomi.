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
      title: 'Set up a Network operator flow',
      description:
        'Operator checklist: invite a member, activate membership, run delegated checkout.',
    },
    async () => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Help me operate lomi. Network as an approved operator:',
              '1. Confirm operator status in the dashboard Network panel (Members, Enrollments).',
              `2. Create an enrollment invite (dashboard or assistant create_network_enrollment_invite).`,
              '3. Share the enrollment link: https://dashboard.lomi.africa/network/enroll/{token}',
              '4. After the member completes enrollment, activate the membership (pending_review → active).',
              '5. Capabilities auto-grant on activation from requested_capabilities.',
              `6. ${createCheckout}, first delegated payment with header Lomi-Account: acct_...`,
              '',
              'Use sandbox keys first. Document each step outcome.',
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
