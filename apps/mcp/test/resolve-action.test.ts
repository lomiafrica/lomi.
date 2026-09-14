import { describe, expect, it } from "vitest";

import type { ManifestTool } from "../src/manifest.js";
import { resolveManifestAction } from "../src/resolve-action.js";

const tool: ManifestTool = {
  name: "lomi_customers",
  title: "Customers",
  description: "Customers",
  tags: ["Customers"],
  write: true,
  inputSchema: { type: "object", properties: {} },
  readOnly: false,
  destructive: true,
  alwaysLoad: true,
  searchHint: "customers",
  actions: {
    get: {
      operationKey: "GET /customers/{id}",
      method: "get",
      pathTemplate: "/customers/{id}",
      pathParamNames: ["id"],
      queryParamNames: [],
      operationId: "get",
      write: false,
      wantsBody: false,
      title: "Get customer",
      description: "Get",
      tags: ["Customers"],
      requiredInput: ["id"],
    },
  },
};

describe("resolveManifestAction", () => {
  it("returns the matching action", () => {
    const spec = resolveManifestAction(tool, { action: "get", id: "cus_1" });
    expect(spec.operationKey).toBe("GET /customers/{id}");
  });

  it("rejects unknown actions", () => {
    expect(() => resolveManifestAction(tool, { action: "create" })).toThrow(
      /Invalid or missing action/,
    );
  });

  it("requires action-specific fields", () => {
    expect(() => resolveManifestAction(tool, { action: "get" })).toThrow(
      /requires "id"/,
    );
  });
});
