import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getLomiApiBaseUrl } from './env-config.js';
import { callLomiRest, formatHttpResult } from './lomi-http.js';
import {
  isString,
  validateJsonValue,
  type JsonObject,
  type JsonValue,
} from '@lomi./shared';

export type RegisterSupportContext = {
  getApiKey: () => string | null;
};

const GUEST_HINT =
  'Connect with a merchant key (OAuth or x-lomi-api-key) to list, get, or close Settings → Support tickets. Guest sessions can only file a contact email (action=file with email + message). See https://docs.lomi.africa/build/mcp';

const CONTACT_TOPICS = [
  'general',
  'billing',
  'integration',
  'abuse',
  'security',
] as const;

const MERCHANT_CATEGORIES = [
  'account',
  'billing',
  'technical',
  'feature',
  'other',
] as const;

const inputSchema = {
  action: z
    .enum(['file', 'list', 'get', 'close', 'status', 'export', 'delete_account'])
    .describe(
      'file: send a complaint (guest email or merchant ticket). list/get/close: merchant tickets. status: platform status URLs. export: GDPR bundle for the current org. delete_account: preview then confirmation_token.',
    ),
  email: z
    .string()
    .email()
    .optional()
    .describe('Required for guest file (no merchant key)'),
  name: z.string().max(200).optional().describe('Guest file display name'),
  topic: z
    .enum(CONTACT_TOPICS)
    .optional()
    .describe('Guest file topic (default general)'),
  locale: z.string().max(8).optional(),
  message: z
    .string()
    .min(10)
    .max(5000)
    .optional()
    .describe('Required for file'),
  category: z
    .enum(MERCHANT_CATEGORIES)
    .optional()
    .describe('Merchant ticket category (default other)'),
  subject: z.string().max(200).optional(),
  id: z.string().optional().describe('Ticket id for get or close'),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  transaction_id: z.string().optional(),
  customer_id: z.string().optional(),
  product_id: z.string().optional(),
  plan_id: z.string().optional(),
  payment_link_id: z.string().optional(),
  webhook_id: z.string().optional(),
  payout_id: z.string().optional(),
  meter_id: z.string().optional(),
  confirmation_token: z
    .string()
    .optional()
    .describe('Required to execute delete_account after the preview'),
};

function textResult(text: string, isError = false) {
  return {
    content: [{ type: 'text' as const, text }],
    isError,
  };
}

function compactJson(fields: {
  [key: string]: JsonValue | undefined;
}): JsonObject {
  const out: JsonObject = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}

function connectHint() {
  return textResult(
    JSON.stringify(
      {
        ok: false,
        status: 401,
        body: {
          error: {
            code: 'unauthorized',
            message: GUEST_HINT,
          },
        },
        next_steps: [
          'Reconnect https://mcp.lomi.africa/mcp with OAuth or x-lomi-api-key.',
          'Then call lomi_support action=list or action=file with category + message.',
        ],
      },
      null,
      2,
    ),
    true,
  );
}

export function registerLomiSupport(
  server: McpServer,
  ctx: RegisterSupportContext,
): void {
  server.registerTool(
    'lomi_support',
    {
      title: 'Contact lomi. support',
      description:
        'File a complaint or support request. Guest sessions email lomi. (email + message). A merchant key creates a real Settings → Support ticket you can list, get, and close. action=status returns the status page and /ready URL. Merchant-only: action=export downloads a GDPR bundle for the current org; action=delete_account returns a confirmation_token then soft-deletes the merchant.',
      inputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
      },
      _meta: {
        'anthropic/alwaysLoad': true,
        'anthropic/searchHint':
          'support complaint ticket contact help status feedback',
      },
    },
    async (args) => {
      const parsed = z.object(inputSchema).safeParse(args);
      if (!parsed.success) {
        return textResult(`Invalid tool arguments: ${parsed.error.message}`, true);
      }
      const input = parsed.data;
      const baseUrl = getLomiApiBaseUrl();
      const apiKey = ctx.getApiKey();

      if (input.action === 'status') {
        const ready = await callLomiRest(
          {
            method: 'get',
            pathTemplate: '/ready',
            pathParamNames: [],
            queryParamNames: [],
            wantsBody: false,
            inputSchema: {},
          },
          {},
          { baseUrl },
        );
        return textResult(
          JSON.stringify(
            {
              ok: true,
              status: ready.status,
              body: {
                status_page: 'https://status.lomi.africa',
                ready_url: `${baseUrl}/ready`,
                ready: (() => {
                  try {
                    return validateJsonValue(JSON.parse(ready.bodyText));
                  } catch {
                    return ready.bodyText;
                  }
                })(),
              },
            },
            null,
            2,
          ),
        );
      }

      if (input.action === 'file') {
        if (!isString(input.message) || input.message.trim().length < 10) {
          return textResult(
            'action=file requires message (at least 10 characters).',
            true,
          );
        }
        if (apiKey) {
          const result = await callLomiRest(
            {
              method: 'post',
              pathTemplate: '/support-requests',
              pathParamNames: [],
              queryParamNames: [],
              wantsBody: true,
              inputSchema: {},
            },
            {
              body: compactJson({
                category: input.category ?? 'other',
                message: input.message,
                subject: input.subject,
                transaction_id: input.transaction_id,
                customer_id: input.customer_id,
                product_id: input.product_id,
                plan_id: input.plan_id,
                payment_link_id: input.payment_link_id,
                webhook_id: input.webhook_id,
                payout_id: input.payout_id,
                meter_id: input.meter_id,
              }),
            },
            { baseUrl, apiKey },
          );
          return textResult(formatHttpResult(result), result.status >= 400);
        }
        if (!isString(input.email)) {
          return textResult(
            'Guest file requires email and message. Or connect a merchant key to open a Settings → Support ticket.',
            true,
          );
        }
        const result = await callLomiRest(
          {
            method: 'post',
            pathTemplate: '/contact',
            pathParamNames: [],
            queryParamNames: [],
            wantsBody: true,
            inputSchema: {},
          },
          {
            body: compactJson({
              email: input.email,
              message: input.message,
              name: input.name,
              topic: input.topic ?? 'general',
              locale: input.locale,
            }),
          },
          { baseUrl },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }

      if (!apiKey) {
        return connectHint();
      }

      if (input.action === 'export') {
        const result = await callLomiRest(
          {
            method: 'post',
            pathTemplate: '/account/export',
            pathParamNames: [],
            queryParamNames: [],
            wantsBody: false,
            inputSchema: {},
          },
          {},
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }

      if (input.action === 'delete_account') {
        const result = await callLomiRest(
          {
            method: 'post',
            pathTemplate: '/account/delete',
            pathParamNames: [],
            queryParamNames: [],
            wantsBody: true,
            inputSchema: {},
          },
          {
            body: compactJson({
              confirmation_token: input.confirmation_token,
            }),
          },
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }

      if (input.action === 'list') {
        const result = await callLomiRest(
          {
            method: 'get',
            pathTemplate: '/support-requests',
            pathParamNames: [],
            queryParamNames: ['cursor', 'limit'],
            wantsBody: false,
            inputSchema: {},
          },
          compactJson({
            cursor: input.cursor,
            limit: input.limit,
          }),
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }

      if (!isString(input.id)) {
        return textResult('action=get and action=close require id.', true);
      }

      if (input.action === 'get') {
        const result = await callLomiRest(
          {
            method: 'get',
            pathTemplate: '/support-requests/{id}',
            pathParamNames: ['id'],
            queryParamNames: [],
            wantsBody: false,
            inputSchema: {},
          },
          { id: input.id },
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }

      const result = await callLomiRest(
        {
          method: 'post',
          pathTemplate: '/support-requests/{id}/close',
          pathParamNames: ['id'],
          queryParamNames: [],
          wantsBody: false,
          inputSchema: {},
        },
        { id: input.id },
        { baseUrl, apiKey },
      );
      return textResult(formatHttpResult(result), result.status >= 400);
    },
  );
}
