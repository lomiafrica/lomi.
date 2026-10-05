import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { isString, type JsonObject } from "@lomi./shared";
import { getLomiApiBaseUrl } from "./env-config.js";
import { callLomiRest, formatHttpResult } from "./lomi-http.js";

type ChannelContext = { getApiKey: () => string | null };

const textResult = (text: string, isError = false) => ({
  content: [{ type: "text" as const, text }],
  isError,
});

const post = async (ctx: ChannelContext, path: string, body: JsonObject) => {
  const apiKey = ctx.getApiKey();
  if (!apiKey) {
    return textResult("Connect with a merchant key first.", true);
  }
  const result = await callLomiRest(
    {
      method: "post",
      pathTemplate: path,
      pathParamNames: [],
      queryParamNames: [],
      wantsBody: true,
      inputSchema: {},
    },
    { body },
    { baseUrl: getLomiApiBaseUrl(), apiKey },
  );
  return textResult(formatHttpResult(result), result.status >= 400);
};

export function registerLomiChannels(
  server: McpServer,
  ctx: ChannelContext,
  allow: (name: string) => boolean,
): void {
  if (allow("lomi_word")) {
    server.registerTool(
      "lomi_word",
      {
        title: "Word",
        description:
          "Create one Word document in OneDrive. action=create or authenticate. Confirm the title and text before create.",
        inputSchema: {
          action: z.enum(["create", "authenticate"]),
          title: z.string().optional(),
          body: z.string().optional(),
        },
      },
      async (input) => {
        const body: JsonObject = { action: input.action };
        if (isString(input.title)) body.title = input.title;
        if (isString(input.body)) body.body = input.body;
        return post(ctx, "/connectors/word", body);
      },
    );
  }
  if (allow("lomi_onedrive")) {
    server.registerTool(
      "lomi_onedrive",
      {
        title: "OneDrive",
        description:
          "List the lomi. OneDrive folder or upload one https file into it. action=list, upload, or authenticate. Confirm the file name before upload.",
        inputSchema: {
          action: z.enum(["list", "upload", "authenticate"]),
          name: z.string().optional(),
          url: z.string().optional(),
        },
      },
      async (input) => {
        const body: JsonObject = { action: input.action };
        if (isString(input.name)) body.name = input.name;
        if (isString(input.url)) body.url = input.url;
        return post(ctx, "/connectors/onedrive", body);
      },
    );
  }
  if (allow("lomi_excel")) {
    server.registerTool(
      "lomi_excel",
      {
        title: "Excel",
        description:
          "Create a lomi. Sales workbook in OneDrive or append recent completed payments. action=create, append, or authenticate. Confirm before the first write.",
        inputSchema: { action: z.enum(["create", "append", "authenticate"]) },
      },
      async (input) => post(ctx, "/connectors/excel", { action: input.action }),
    );
  }
  if (allow("lomi_sheets")) {
    server.registerTool(
      "lomi_sheets",
      {
        title: "Google Sheets",
        description:
          "Create a lomi. Sales sheet or append recent completed payments. action=create, append, or authenticate. Confirm before the first write.",
        inputSchema: { action: z.enum(["create", "append", "authenticate"]) },
      },
      async (input) =>
        post(ctx, "/connectors/sheets", { action: input.action }),
    );
  }
  if (allow("lomi_drive")) {
    server.registerTool(
      "lomi_drive",
      {
        title: "Google Drive",
        description:
          "Upload one https file into the lomi. Drive folder. action=upload or authenticate. Confirm the file name before upload.",
        inputSchema: {
          action: z.enum(["upload", "authenticate"]),
          name: z.string().optional(),
          url: z.string().optional(),
        },
      },
      async (input) => {
        const body: JsonObject = { action: input.action };
        if (isString(input.name)) body.name = input.name;
        if (isString(input.url)) body.url = input.url;
        return post(ctx, "/connectors/drive", body);
      },
    );
  }
  if (allow("lomi_docs")) {
    server.registerTool(
      "lomi_docs",
      {
        title: "Google Docs",
        description:
          "Create one Google Doc. action=create or authenticate. Confirm the title and text before create.",
        inputSchema: {
          action: z.enum(["create", "authenticate"]),
          title: z.string().optional(),
          body: z.string().optional(),
        },
      },
      async (input) => {
        const body: JsonObject = { action: input.action };
        if (isString(input.title)) body.title = input.title;
        if (isString(input.body)) body.body = input.body;
        return post(ctx, "/connectors/docs", body);
      },
    );
  }
  if (allow("lomi_telegram")) {
    server.registerTool(
      "lomi_telegram",
      {
        title: "Telegram",
        description:
          "Send one message from the merchant Telegram bot. Confirm the chat and text before send.",
        inputSchema: { chat_id: z.string(), text: z.string() },
      },
      async (input) =>
        post(ctx, "/connectors/telegram/send", {
          chat_id: input.chat_id,
          text: input.text,
        }),
    );
  }
  if (allow("lomi_social")) {
    server.registerTool(
      "lomi_social",
      {
        title: "Instagram and Facebook",
        description:
          "Sync the signed-in Instagram account or Facebook Pages, or reply in one conversation. action=sync, send, or authenticate. Confirm the recipient and text before send.",
        inputSchema: {
          action: z.enum(["sync", "send", "authenticate"]),
          provider: z.enum(["instagram", "facebook"]),
          recipient: z.string().optional(),
          text: z.string().optional(),
        },
      },
      async (input) => {
        const body: JsonObject = {
          action: input.action,
          provider: input.provider,
        };
        if (isString(input.recipient)) body.recipient = input.recipient;
        if (isString(input.text)) body.text = input.text;
        return post(ctx, "/connectors/social", body);
      },
    );
  }
  if (allow("lomi_books")) {
    server.registerTool(
      "lomi_books",
      {
        title: "QuickBooks and Xero",
        description:
          "Record one paid charge in QuickBooks or Xero. action=record or authenticate. Confirm the customer and amount before record.",
        inputSchema: {
          action: z.enum(["record", "authenticate"]),
          provider: z.enum(["quickbooks", "xero"]),
          customer: z.string().optional(),
          amount: z.string().optional(),
          currency: z.string().optional(),
          reference: z.string().optional(),
        },
      },
      async (input) => {
        const body: JsonObject = {
          action: input.action,
          provider: input.provider,
        };
        if (isString(input.customer)) body.customer = input.customer;
        if (isString(input.amount)) body.amount = input.amount;
        if (isString(input.currency)) body.currency = input.currency;
        if (isString(input.reference)) body.reference = input.reference;
        return post(ctx, "/connectors/books", body);
      },
    );
  }
  if (allow("lomi_brevo")) {
    server.registerTool(
      "lomi_brevo",
      {
        title: "Brevo",
        description:
          "Add a Brevo contact or send one marketing email. action=add or send. Confirm the recipient before send.",
        inputSchema: {
          action: z.enum(["add", "send"]),
          email: z.string().optional(),
          list_id: z.string().optional(),
          to: z.string().optional(),
          subject: z.string().optional(),
          body: z.string().optional(),
        },
      },
      async (input) => {
        const body: JsonObject = { action: input.action };
        if (isString(input.email)) body.email = input.email;
        if (isString(input.list_id)) body.list_id = input.list_id;
        if (isString(input.to)) body.to = input.to;
        if (isString(input.subject)) body.subject = input.subject;
        if (isString(input.body)) body.body = input.body;
        return post(ctx, "/connectors/brevo/send", body);
      },
    );
  }
}
