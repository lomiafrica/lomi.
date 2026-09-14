import { describe, expect, it } from "vitest";
import type { ToolsManifest } from "../src/manifest.js";

describe("registerMerchantTools aliases", () => {
  it("does not register mechanical lomi_post_* / lomi_get_* aliases", async () => {
    const { McpServer } = await import(
      "@modelcontextprotocol/sdk/server/mcp.js"
    );
    const { registerMerchantTools } = await import("../src/register-tools.js");

    const manifest: ToolsManifest = {
      manifestVersion: 1,
      apiVersion: "test",
      apiTitle: "test",
      toolCount: 1,
      tools: [
        {
          name: "lomi_checkout",
          title: "Checkout sessions",
          description: "Checkout sessions. Pass required `action`.",
          tags: ["Checkout"],
          write: true,
          readOnly: false,
          destructive: false,
          searchHint: "checkout create list get",
          alwaysLoad: true,
          inputSchema: {
            type: "object",
            required: ["action"],
            properties: {
              action: { type: "string", enum: ["create"] },
            },
          },
          actions: {
            create: {
              operationKey: "POST /checkout-sessions",
              method: "post",
              pathTemplate: "/checkout-sessions",
              pathParamNames: [],
              queryParamNames: [],
              operationId: "CheckoutSessionsController_create",
              write: true,
              wantsBody: true,
              title: "Create checkout session",
              description: "create",
              tags: ["Checkout"],
              requiredInput: ["body"],
            },
          },
        },
      ],
    };

    const server = new McpServer({ name: "test", version: "0" });
    const registered: string[] = [];
    const original = server.registerTool.bind(server);
    // SAFETY: Test wrapper preserves registerTool's production signature while recording names.
    server.registerTool = ((
      name: string,
      ...rest: Parameters<typeof original> extends [string, ...infer R]
        ? R
        : never
    ) => {
      registered.push(name);
      return original(name, ...rest);
    }) as typeof server.registerTool;

    registerMerchantTools(server, manifest, {
      getApiKey: () => "lomi_sk_test_example",
    });

    expect(registered).toContain("lomi_checkout");
    expect(registered).toContain("lomi_search_tools");
    expect(registered.some((name) => name.startsWith("lomi_post_"))).toBe(
      false,
    );
    expect(registered.some((name) => name.startsWith("lomi_get_"))).toBe(false);
    expect(registered).not.toContain("lomi_post_checkout_sessions");
    expect(registered).not.toContain("lomi_create_checkout_session");
  });
});
