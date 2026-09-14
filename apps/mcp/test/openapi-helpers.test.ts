import { describe, expect, it } from "vitest";

import {
  canonicalizeInputSchema,
  ensurePathParamsInInputSchema,
  pathTemplateParamNames,
} from "../src/generator/openapi-helpers.ts";

describe("openapi-helpers", () => {
  it("extracts path template parameter names in order", () => {
    expect(pathTemplateParamNames("/products/{id}/prices/{priceId}")).toEqual([
      "id",
      "priceId",
    ]);
  });

  it("fills missing path params into schema with required", () => {
    const base = {
      type: "object",
      properties: {},
      required: new Array<string>(),
    };
    const fixed = ensurePathParamsInInputSchema(
      base,
      "/accounts/balance/{currency}",
    );
    expect(fixed.properties).toMatchObject({
      currency: expect.objectContaining({ type: "string" }),
    });
    expect(fixed.required).toContain("currency");
  });

  it("canonicalize sorts required and property keys", () => {
    const schema = {
      type: "object",
      required: ["z", "a"],
      properties: {
        z: { type: "string" },
        a: { type: "number" },
      },
    };
    const c = canonicalizeInputSchema(schema);
    expect(c.required).toEqual(["a", "z"]);
    expect(Object.keys(c.properties ?? {})).toEqual(["a", "z"]);
  });
});
