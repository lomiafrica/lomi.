import { describe, expect, it } from "vitest";

import {
  buildSearchHint,
  isDestructiveOperation,
  isReadOnlyMethod,
  resolveToolPolicy,
} from "../src/tool-policy.ts";

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
