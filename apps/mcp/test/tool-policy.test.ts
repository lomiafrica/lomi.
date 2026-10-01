import { describe, expect, it } from "vitest";

import manifestJson from "../src/generated/tools-manifest.json" with { type: "json" };
import provisioningJson from "../src/generated/provisioning-tools-manifest.json" with { type: "json" };
import {
  buildSearchHint,
  isDestructiveOperation,
  isReadOnlyMethod,
  resolveToolPolicy,
} from "../src/tool-policy.ts";
import { parseManifest } from "../src/manifest-parse.js";
import { validateJsonValue } from "@lomi./shared";

describe("tool-policy", () => {
  it("marks GET as read-only", () => {
    expect(isReadOnlyMethod("get")).toBe(true);
    expect(isReadOnlyMethod("post")).toBe(false);
  });

  it("marks DELETE and cancel as destructive", () => {
    expect(isDestructiveOperation("delete", "DELETE /customers/{id}")).toBe(
      true,
    );
    expect(
      isDestructiveOperation("post", "POST /subscriptions/{id}/cancel"),
    ).toBe(true);
    expect(isDestructiveOperation("get", "GET /customers")).toBe(false);
    expect(isDestructiveOperation("get", "GET /refunds")).toBe(false);
  });

  it("marks money movement and irreversible writes as destructive", () => {
    expect(isDestructiveOperation("post", "POST /refunds")).toBe(true);
    expect(isDestructiveOperation("post", "POST /payouts")).toBe(true);
    expect(isDestructiveOperation("post", "POST /payout-methods")).toBe(false);
    expect(isDestructiveOperation("post", "POST /charge/card")).toBe(true);
    expect(
      isDestructiveOperation("post", "POST /charge/card/{id}/capture"),
    ).toBe(true);
    expect(isDestructiveOperation("post", "POST /transfers")).toBe(true);
    expect(
      isDestructiveOperation("post", "POST /transfers/{id}/reversals"),
    ).toBe(true);
    expect(isDestructiveOperation("post", "POST /settlements/instant")).toBe(
      true,
    );
    expect(isDestructiveOperation("post", "POST /invoices/{id}/void")).toBe(
      true,
    );
    expect(
      isDestructiveOperation("post", "POST /disputes/{id}/evidence"),
    ).toBe(true);
    expect(isDestructiveOperation("post", "POST /customers/{id}/block")).toBe(
      true,
    );
    expect(
      isDestructiveOperation("post", "POST /customers/{id}/unblock"),
    ).toBe(false);
    expect(isDestructiveOperation("post", "POST /checkout-sessions")).toBe(
      false,
    );
  });

  it("keeps generated tool flags aligned with the policy", () => {
    const merchant = parseManifest(validateJsonValue(manifestJson));
    const provisioning = parseManifest(validateJsonValue(provisioningJson));
    for (const tool of [...merchant.tools, ...provisioning.tools]) {
      const destructive = Object.values(tool.actions).some((action) =>
        isDestructiveOperation(action.method, action.operationKey),
      );
      expect(tool.destructive, tool.name).toBe(destructive);
    }
  });

  it("builds search hints from tags and path", () => {
    const hint = buildSearchHint({
      name: "lomi_get_customers",
      method: "get",
      operationKey: "GET /customers",
      pathTemplate: "/customers",
      tags: ["Customers"],
    });
    expect(hint).toContain("customers");
    expect(hint).toContain("get");
  });

  it("respects alwaysLoad operation keys", () => {
    const policy = resolveToolPolicy(
      {
        name: "lomi_get_customers",
        method: "get",
        operationKey: "GET /customers",
        pathTemplate: "/customers",
        tags: ["Customers"],
      },
      new Set(["GET /customers"]),
    );
    expect(policy.alwaysLoad).toBe(true);
    expect(policy.readOnly).toBe(true);
    expect(policy.destructive).toBe(false);
  });
});
