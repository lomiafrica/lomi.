import { describe, expect, it } from "vitest";

import { resolveEnglishCopy } from "../src/generator/mcp-english-copy.ts";

describe("mcp-english-copy", () => {
  it("generates English title for list operations", () => {
    const { title } = resolveEnglishCopy({
      operationKey: "GET /customers",
      httpMethodLower: "get",
      tags: ["Customers"],
      methodNameByOp: { "GET /customers": "list" },
    });
    expect(title).toBe("List Customers");
  });

  it("falls back to generated English when OpenAPI is French", () => {
    const { title, description } = resolveEnglishCopy({
      operationKey: "DELETE /customers/{id}",
      httpMethodLower: "delete",
      tags: ["Clients"],
      methodNameByOp: { "DELETE /customers/{id}": "delete" },
      openApiSummary: "Supprimer un client",
      openApiDescription: "Retire un client.",
    });
    expect(title).toBe("Delete Clients");
    expect(description).toContain("REST: DELETE /customers/{id}");
    expect(description).not.toContain("Supprimer");
  });
});
