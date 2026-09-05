import type { JsonObject, JsonValue, ReceiptTransactionInput } from "./types";

const CARD_PROVIDERS = new Set(["STRIPE", "CYBERSOURCE", "GIM"]);
const WALLET_PROVIDERS = new Set(["APPLE_PAY", "GOOGLE_PAY"]);

function isJsonObject(value: JsonValue): value is JsonObject {
  return value !== null && !Array.isArray(value) && typeof value === "object";
}

function asMetadataRecord(metadata: JsonValue | undefined): JsonObject | null {
  return metadata !== undefined && isJsonObject(metadata) ? metadata : null;
}

function readMetadataString(
  metadata: JsonObject | null,
  key: string,
): string | undefined {
  const value = metadata?.[key];
  return typeof value === "string" ? value : undefined;
}

function readMetadataLast4(
  metadata: JsonObject | null,
  key: string,
): string | undefined {
  const value = metadata?.[key];
  if (typeof value === "string") return sanitizeReceiptLast4(value);
  if (typeof value === "number" && Number.isFinite(value)) {
    return sanitizeReceiptLast4(String(Math.trunc(value)));
  }
  return undefined;
}

export function sanitizeReceiptLast4(
  raw: string | null | undefined,
): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 4) return undefined;
  return digits.slice(-4);
}

export function extractReceiptCardLast4(
  transaction: Pick<ReceiptTransactionInput, "card_last4" | "metadata">,
): string | undefined {
  const fromField = sanitizeReceiptLast4(transaction.card_last4);
  if (fromField) return fromField;
  const metadata = asMetadataRecord(transaction.metadata);
  if (!metadata) return undefined;
  return (
    readMetadataLast4(metadata, "card_last4") ??
    readMetadataLast4(metadata, "last4")
  );
}

function paymentMethodCode(
  transaction: Pick<ReceiptTransactionInput, "payment_method_code" | "metadata">,
): string | undefined {
  if (transaction.payment_method_code) {
    return transaction.payment_method_code.toUpperCase();
  }
  const metadata = asMetadataRecord(transaction.metadata);
  return readMetadataString(metadata, "payment_method_code")?.toUpperCase();
}

function isWalletRail(
  providerCode: string,
  metadata: JsonObject | null,
): boolean {
  if (WALLET_PROVIDERS.has(providerCode)) return true;
  const wallet = readMetadataString(metadata, "wallet_type")?.toLowerCase();
  return wallet === "apple_pay" || wallet === "google_pay";
}

function isCardRail(providerCode: string, method: string | undefined): boolean {
  if (CARD_PROVIDERS.has(providerCode)) return true;
  return method === "CARDS" || method === "CARD";
}

export function formatReceiptPaymentMethod(
  transaction: ReceiptTransactionInput,
  formatRail: (code: string | null | undefined) => string,
): string {
  const providerCode = (transaction.provider_code ?? "").toUpperCase();
  const metadata = asMetadataRecord(transaction.metadata);
  if (isWalletRail(providerCode, metadata)) {
    return formatRail(transaction.provider_code);
  }

  const last4 = extractReceiptCardLast4(transaction);
  const method = paymentMethodCode(transaction);
  if (last4 && isCardRail(providerCode, method)) {
    return `**** ${last4}`;
  }
  if (isCardRail(providerCode, method)) {
    return "Card";
  }
  return formatRail(transaction.provider_code ?? "FREE");
}
