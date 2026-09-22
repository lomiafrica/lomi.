import { describe, expect, it } from "vitest";

import manifestJson from "../src/generated/tools-manifest.json" with { type: "json" };
import { parseManifest } from "../src/manifest-parse.js";
import {
  mcpFamilyDuplicateTools,
  mcpToolsMissingFamily,
  validateJsonValue,
} from "@lomi./shared";

describe("merchant completeness manifest", () => {
  const manifest = parseManifest(validateJsonValue(manifestJson));

  it("includes generated lomi_team and lomi_settings", () => {
    const names = manifest.tools.map((tool) => tool.name);
    expect(names).toContain("lomi_team");
    expect(names).toContain("lomi_settings");
  });

  it("exposes organization create/use and product archive", () => {
    const org = manifest.tools.find(
      (tool) => tool.name === "lomi_organization",
    );
    const products = manifest.tools.find(
      (tool) => tool.name === "lomi_products",
    );
    expect(org?.actions.create?.operationKey).toBe("POST /organizations");
    expect(org?.actions.use?.operationKey).toBe(
      "POST /organizations/{id}/keys",
    );
    expect(products?.actions.update?.operationKey).toBe("PATCH /products/{id}");
    expect(products?.actions.archive?.operationKey).toBe(
      "DELETE /products/{id}",
    );
    expect(products?.inputSchema.properties).toMatchObject({
      body: {
        type: "object",
        additionalProperties: true,
      },
    });
    expect(products?.actions.create?.wantsBody).toBe(true);
    expect(products?.actions.create?.requiredInput).toContain("body");
    expect(products?.actions.update?.wantsBody).toBe(true);
    expect(products?.actions.add_price?.wantsBody).toBe(true);
    expect(products?.actions.batch_prices?.wantsBody).toBe(true);
  });

  it("declares a body for write actions that send JSON", () => {
    const expected = [
      ["lomi_coupons", "create"],
      ["lomi_disputes", "submit_evidence"],
      ["lomi_exports", "create"],
      ["lomi_invoices", "create"],
      ["lomi_invoices", "update"],
      ["lomi_meters", "create"],
      ["lomi_meters", "update"],
      ["lomi_payout_methods", "create"],
      ["lomi_payouts", "create"],
      ["lomi_subscriptions", "update"],
      ["lomi_usage", "set_entitlement"],
      ["lomi_usage", "credits"],
      ["lomi_usage", "create_subscription"],
      ["lomi_webhooks", "create"],
    ] as const;

    for (const [toolName, action] of expected) {
      const tool = manifest.tools.find((entry) => entry.name === toolName);
      expect(tool?.actions[action]?.wantsBody).toBe(true);
      expect(tool?.actions[action]?.requiredInput).toContain("body");
      expect(tool?.inputSchema.properties).toMatchObject({
        body: { type: "object", additionalProperties: true },
      });
    }
  });

  it("places every merchant tool in exactly one OAuth family", () => {
    const names = manifest.tools.map((tool) => tool.name);
    expect(mcpFamilyDuplicateTools()).toEqual([]);
    expect(mcpToolsMissingFamily(names)).toEqual([]);
  });
});
