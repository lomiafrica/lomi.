import { describe, expect, it } from "vitest";
import type { ManifestTool } from "../src/manifest.ts";
import {
  scoreManifestTool,
  searchManifestTools,
} from "../src/register-search-tools.ts";

const sampleTool = (overrides: Partial<ManifestTool>): ManifestTool => ({
  name: "lomi_customers",
  title: "Customers",
  description: "Customers. Pass required `action`.",
  tags: ["Customers"],
  write: false,
  inputSchema: { type: "object", properties: { action: { type: "string" } } },
  readOnly: true,
  destructive: false,
  alwaysLoad: true,
  searchHint: "customers get list",
  actions: {
    list: {
      operationKey: "GET /customers",
      method: "get",
      pathTemplate: "/customers",
      pathParamNames: [],
      queryParamNames: [],
      operationId: "x",
      write: false,
      wantsBody: false,
      title: "List Customers",
      description: "List customers",
      tags: ["Customers"],
      requiredInput: [],
    },
  },
  ...overrides,
});

describe("register-search-tools", () => {
  it("scores exact name matches highest", () => {
    const tool = sampleTool({});
    expect(scoreManifestTool(tool, "lomi_customers")).toBeGreaterThan(
      scoreManifestTool(tool, "webhook"),
    );
  });

  it("returns matches sorted by score", () => {
    const manifest = {
      manifestVersion: 1 as const,
      apiVersion: "1",
      apiTitle: "t",
      toolCount: 2,
      tools: [
        sampleTool({ name: "lomi_customers" }),
        sampleTool({
          name: "lomi_webhooks",
          title: "Webhooks",
          tags: ["Webhooks"],
          searchHint: "webhooks get",
          actions: {
            list: {
              operationKey: "GET /webhooks",
              method: "get",
              pathTemplate: "/webhooks",
              pathParamNames: [],
              queryParamNames: [],
              operationId: "x",
              write: false,
              wantsBody: false,
              title: "List Webhooks",
              description: "List webhooks",
              tags: ["Webhooks"],
              requiredInput: [],
            },
          },
        }),
      ],
    };
    const results = searchManifestTools(manifest, "customer");
    expect(results[0]?.name).toBe("lomi_customers");
  });
});
