import { describe, expect, it } from "vitest";

import {
  bodyFieldsFromSchema,
  buildGroupDescription,
} from "../src/generator/group-manifest.ts";

describe("bodyFieldsFromSchema", () => {
  it("returns required body fields first without tagging them", () => {
    const fields = bodyFieldsFromSchema({
      type: "object",
      properties: {
        body: {
          type: "object",
          required: ["amount", "currency_code"],
          properties: {
            description: { type: "string" },
            amount: { type: "integer" },
            currency_code: { type: "string" },
          },
        },
      },
    });

    expect(fields).toEqual(["amount", "currency_code", "description"]);
    expect(fields.every((name) => !name.includes("required"))).toBe(true);
  });

  it("returns an empty list when the action has no object body", () => {
    expect(bodyFieldsFromSchema({ type: "object", properties: {} })).toEqual(
      [],
    );
    expect(
      bodyFieldsFromSchema({
        type: "object",
        properties: { body: { type: "string" } },
      }),
    ).toEqual([]);
  });
});

describe("buildGroupDescription", () => {
  it("names body fields and truncates long lists without required tags", () => {
    const short = buildGroupDescription({
      title: "Products",
      actions: [
        {
          name: "create",
          title: "Create product",
          operationKey: "POST /products",
          required: ["body"],
          bodyFields: ["name", "prices", "description"],
        },
        {
          name: "list",
          title: "List products",
          operationKey: "GET /products",
          required: [],
        },
      ],
    });

    expect(short).toContain(
      "`create` — Create product (POST /products). Required: body. Body: name, prices, description.",
    );
    expect(short).toContain(
      "`list` — List products (GET /products). No extra required fields.",
    );
    expect(short).not.toMatch(/\(required\)/);

    const many = Array.from({ length: 13 }, (_, index) => `field_${index}`);
    const long = buildGroupDescription({
      title: "Invoices",
      actions: [
        {
          name: "create",
          title: "Create invoice",
          operationKey: "POST /invoices",
          required: ["body"],
          bodyFields: many,
        },
      ],
    });

    expect(long).toContain(`Body: ${many.slice(0, 12).join(", ")}, ….`);
    expect(long).not.toContain("field_12");
  });
});
