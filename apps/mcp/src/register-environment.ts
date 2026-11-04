import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { McpConnectionEnvironment } from "@lomi./shared";

export type MerchantEnvironmentState = {
  live?: string;
  test?: string;
  active: McpConnectionEnvironment;
};

export function registerLomiEnvironment(
  server: McpServer,
  state: MerchantEnvironmentState,
): void {
  server.registerTool(
    "lomi_environment",
    {
      title: "Environment",
      description:
        "See or switch the live or test key on this connection. Omit environment to see which one is active. Default is live when both were granted.",
      inputSchema: {
        environment: z
          .enum(["live", "test"])
          .optional()
          .describe("live or test. Omit to see the active environment."),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args) => {
      const requested = args.environment;
      if (requested === "live" && !state.live) {
        return {
          content: [
            {
              type: "text",
              text: "Live was not granted on this connection.",
            },
          ],
          isError: true,
        };
      }
      if (requested === "test" && !state.test) {
        return {
          content: [
            {
              type: "text",
              text: "Test was not granted on this connection.",
            },
          ],
          isError: true,
        };
      }
      if (requested === "live" || requested === "test") {
        state.active = requested;
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              environment: state.active,
              live: Boolean(state.live),
              test: Boolean(state.test),
            }),
          },
        ],
      };
    },
  );
}
