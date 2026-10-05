import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getLomiApiBaseUrl } from "./env-config.js";
import { callLomiRest, formatHttpResult } from "./lomi-http.js";
import { isString, type JsonObject } from "@lomi./shared";

export type RegisterSmsContext = {
  getApiKey: () => string | null;
};

const textResult = (text: string, isError = false) => ({
  content: [{ type: "text" as const, text }],
  isError,
});

export function registerLomiSms(
  server: McpServer,
  ctx: RegisterSmsContext,
): void {
  server.registerTool(
    "lomi_sms",
    {
      title: "Twilio SMS",
      description:
        "Send SMS through the merchant Twilio account. action=send. Needs to and body. Optional from if it was not saved. Confirm the number before send. WhatsApp stays on lomi_whatsapp. Requires a merchant key.",
      inputSchema: {
        action: z.enum(["send"]),
        to: z.string(),
        body: z.string(),
        from: z.string().optional(),
      },
    },
    async (input) => {
      const apiKey = ctx.getApiKey();
      if (!apiKey) {
        return textResult(
          "Connect with a merchant key before sending SMS.",
          true,
        );
      }
      const payload: JsonObject = {
        action: "send",
        to: input.to,
        body: input.body,
      };
      if (isString(input.from)) payload.from = input.from;
      const result = await callLomiRest(
        {
          method: "post",
          pathTemplate: "/connectors/sms",
          pathParamNames: [],
          queryParamNames: [],
          wantsBody: true,
          inputSchema: {},
        },
        { body: payload },
        { baseUrl: getLomiApiBaseUrl(), apiKey },
      );
      return textResult(formatHttpResult(result), result.status >= 400);
    },
  );
}
