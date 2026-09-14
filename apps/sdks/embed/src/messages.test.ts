import { describe, expect, it } from "vitest";
import { parseCheckoutMessage, getCheckoutOrigin } from "./messages";

describe("parseCheckoutMessage", () => {
  it("parses unified success envelope", () => {
    const parsed = parseCheckoutMessage({
      type: "LOMI_CHECKOUT",
      event: "success",
      sessionId: "cs_1",
      transactionId: "txn_1",
    });
    expect(parsed?.event).toBe("success");
    expect(parsed?.payload?.sessionId).toBe("cs_1");
  });

  it("parses legacy complete message", () => {
    const parsed = parseCheckoutMessage({
      type: "LOMI_CHECKOUT_COMPLETE",
      sessionId: "cs_2",
    });
    expect(parsed?.event).toBe("success");
  });
});

describe("getCheckoutOrigin", () => {
  it("returns checkout host origin", () => {
    expect(
      getCheckoutOrigin("https://checkout.lomi.africa/checkout/cs_1"),
    ).toBe("https://checkout.lomi.africa");
  });
});
