export const LOMI_CHECKOUT_MESSAGE_TYPE = "LOMI_CHECKOUT" as const;

export type LomiCheckoutEvent =
  | "loaded"
  | "resize"
  | "confirmed"
  | "success"
  | "close"
  | "error";

export type LomiCheckoutSuccessPayload = {
  successURL?: string;
  redirect?: boolean;
  sessionId?: string | null;
  transactionId?: string;
  amount?: number;
  currency?: string;
  hasDigitalDeliverables?: boolean;
};
