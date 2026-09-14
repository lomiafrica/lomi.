import type { LomiCheckoutCompletePayload } from "./utils";
import { LOMI_CHECKOUT_MESSAGE_TYPE } from "./types";
import {
  isBoolean,
  isJsonObject,
  isNumber,
  readString,
  type JsonObject,
  type JsonValue,
} from "@lomi./shared";

export interface ParsedCheckoutMessage {
  event: string;
  payload?: LomiCheckoutCompletePayload;
  height?: number;
  code?: string;
  message?: string;
}

export function getCheckoutOrigin(checkoutUrl: string): string | null {
  try {
    return new URL(checkoutUrl).origin;
  } catch {
    return null;
  }
}

export function isAllowedCheckoutOrigin(
  eventOrigin: string,
  checkoutUrl: string,
): boolean {
  const expected = getCheckoutOrigin(checkoutUrl);
  if (!expected) {
    return true;
  }
  return eventOrigin === expected;
}

export function legacyCompleteToPayload(
  data: JsonObject,
): LomiCheckoutCompletePayload {
  const sessionId = data["sessionId"];
  return {
    type: "LOMI_CHECKOUT_COMPLETE",
    sessionId:
      sessionId === null ? null : (readString(data, "sessionId") ?? null),
    transactionId: readString(data, "transactionId"),
    amount: isNumber(data["amount"]) ? data["amount"] : undefined,
    currency: readString(data, "currency"),
    hasDigitalDeliverables: isBoolean(data["hasDigitalDeliverables"])
      ? data["hasDigitalDeliverables"]
      : undefined,
  };
}

export function parseCheckoutMessage(
  data: JsonValue,
): ParsedCheckoutMessage | null {
  if (!isJsonObject(data)) {
    return null;
  }

  const event = readString(data, "event");
  if (data["type"] === LOMI_CHECKOUT_MESSAGE_TYPE && event) {
    if (event === "success") {
      return {
        event: "success",
        payload: legacyCompleteToPayload(data),
      };
    }
    if (event === "resize") {
      return {
        event: "resize",
        height: isNumber(data["height"]) ? data["height"] : undefined,
      };
    }
    if (event === "error") {
      return {
        event,
        code: readString(data, "code"),
        message: readString(data, "message"),
      };
    }
    return { event };
  }

  if (data["type"] === "LOMI_CHECKOUT_COMPLETE") {
    return {
      event: "success",
      payload: legacyCompleteToPayload(data),
    };
  }

  if (data["type"] === "LOMI_RESIZE") {
    return {
      event: "resize",
      height: isNumber(data["height"]) ? data["height"] : undefined,
    };
  }

  return null;
}
