import type { JsonObject } from "../json-value.js";
import { isJsonObject, readNumber, readString } from "../json-value.js";
import type {
  FneClientType,
  KomptoPaymentMethod,
  KomptoTvaName,
  MerchantInvoiceForFne,
} from "./types.js";

export const KOMPTO_VERIFY_PATH = "/api/invoice/verify";
export const KOMPTO_GET_VERIFY_PATH = "/api/invoice/getVerify";
export const KOMPTO_CONFIRM_PATH = "/api/invoice/confirm";
export const KOMPTO_GET_ELECTRONIC_INVOICE_PATH =
  "/api/invoice/getElectronicInvoice";
export const KOMPTO_DELETE_PATH = "/api/invoice/delete";
export const KOMPTO_CREATE_PATH = "/api/invoice/create";
export const KOMPTO_CREATE_CREDIT_NOTE_PATH = "/api/invoice/createCreditNote";

/**
 * Public pages do not name the GET query key. Default `id` until the PDF guide
 * is ingested; follow-up must replace this if the guide uses another name.
 */
export const KOMPTO_INVOICE_QUERY_PARAM = "id";

export type KomptoVerifyItem = {
  itemName: string;
  itemQuantity: number;
  itemUnitPrice: number;
  itemTVAName: KomptoTvaName;
};

export type KomptoVerifyPayload = {
  clientType: FneClientType;
  clientName: string;
  clientNCC?: string;
  clientTelephone?: string;
  clientEmail?: string;
  paymentMethod: KomptoPaymentMethod;
  items: KomptoVerifyItem[];
};

export type KomptoPayloadError = {
  code:
    | "missing_customer_name"
    | "b2b_ncc_required"
    | "missing_line_items"
    | "unmapped_payment_method"
    | "invalid_line_item";
  message: string;
};

export type KomptoParsedInvoice = {
  raw: JsonObject;
  komptoInvoiceId: string | null;
  dgiIdentifier: string | null;
  qrPayload: string | null;
  pdfUrl: string | null;
};

export function mapLomiPaymentMethodToKompto(
  method: string | null,
): KomptoPaymentMethod | null {
  if (!method) return null;
  const normalized = method.trim().toLowerCase();
  switch (normalized) {
    case "spi":
    case "bank_transfer":
    case "bank-transfer":
    case "transfer":
    case "virement":
      return "transfer";
    default:
      return null;
  }
}

export function buildKomptoVerifyPayload(
  invoice: MerchantInvoiceForFne,
): KomptoVerifyPayload | KomptoPayloadError {
  const clientName = invoice.customerName.trim();
  if (clientName === "") {
    return {
      code: "missing_customer_name",
      message: "KOMPTO verify requires clientName.",
    };
  }

  if (invoice.clientType === "B2B") {
    const ncc = invoice.customerNcc?.trim() ?? "";
    if (ncc === "") {
      return {
        code: "b2b_ncc_required",
        message: "KOMPTO B2B verify requires clientNCC.",
      };
    }
  }

  if (invoice.lineItems.length === 0) {
    return {
      code: "missing_line_items",
      message: "KOMPTO verify requires at least one item.",
    };
  }

  const paymentMethod = mapLomiPaymentMethodToKompto(invoice.paymentMethod);
  if (paymentMethod === null) {
    return {
      code: "unmapped_payment_method",
      message:
        "Payment method is not mapped to a KOMPTO enum confirmed in public docs. Only transfer is wired until the PDF guide is ingested.",
    };
  }

  const items: KomptoVerifyItem[] = [];
  for (const line of invoice.lineItems) {
    const itemName = line.name.trim();
    if (
      itemName === "" ||
      !Number.isFinite(line.quantity) ||
      line.quantity <= 0 ||
      !Number.isFinite(line.unitPrice) ||
      line.unitPrice < 0
    ) {
      return {
        code: "invalid_line_item",
        message:
          "KOMPTO verify line items need a name, positive quantity, and unit price.",
      };
    }
    items.push({
      itemName,
      itemQuantity: line.quantity,
      itemUnitPrice: line.unitPrice,
      itemTVAName: line.tvaName,
    });
  }

  const payload: KomptoVerifyPayload = {
    clientType: invoice.clientType,
    clientName,
    paymentMethod,
    items,
  };

  const ncc = invoice.customerNcc?.trim();
  if (ncc) payload.clientNCC = ncc;
  const phone = invoice.customerPhone?.trim();
  if (phone) payload.clientTelephone = phone;
  const email = invoice.customerEmail?.trim();
  if (email) payload.clientEmail = email;

  return payload;
}

export function isKomptoPayloadError(
  value: KomptoVerifyPayload | KomptoPayloadError,
): value is KomptoPayloadError {
  return "code" in value && "message" in value && !("items" in value);
}

/**
 * Confirm body is not shown on the public page. Send `{ id }` as a provisional
 * guess; replace from the PDF guide before production.
 */
export function buildKomptoConfirmBody(komptoInvoiceId: string): JsonObject {
  return { [KOMPTO_INVOICE_QUERY_PARAM]: komptoInvoiceId };
}

function firstString(
  object: JsonObject,
  keys: readonly string[],
): string | null {
  for (const key of keys) {
    const value = readString(object, key);
    if (value !== undefined && value.trim() !== "") return value.trim();
  }
  return null;
}

/** Pull ids from a KOMPTO JSON body without assuming a single field name. */
export function parseKomptoInvoiceBody(raw: JsonObject): KomptoParsedInvoice {
  const invoiceValue = raw["invoice"];
  const nested = isJsonObject(invoiceValue) ? invoiceValue : raw;

  return {
    raw,
    komptoInvoiceId: firstString(nested, [
      "id",
      "invoiceId",
      "invoice_id",
      "komptoInvoiceId",
    ]),
    dgiIdentifier: firstString(nested, [
      "dgiIdentifier",
      "dgi_identifier",
      "fiscalNumber",
      "fiscal_number",
      "normalizedNumber",
      "nccInvoiceNumber",
    ]),
    qrPayload: firstString(nested, ["qr", "qrCode", "qr_code", "qrPayload"]),
    pdfUrl: firstString(nested, ["pdfUrl", "pdf_url", "pdf", "certificateUrl"]),
  };
}

export function readKomptoAmount(
  object: JsonObject,
  keys: readonly string[],
): number | null {
  for (const key of keys) {
    const value = readNumber(object, key);
    if (value !== undefined) return value;
  }
  return null;
}
