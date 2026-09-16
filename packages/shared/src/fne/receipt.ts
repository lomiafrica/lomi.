import { isJsonObject, readString, type JsonObject, type JsonValue } from "../json-value.js";
import { isUuid } from "../public-id.js";

export const FISCAL_METADATA_KEY = "fiscal";

export type FiscalReceiptFields = {
  reference: string | null;
  token: string | null;
  invoiceId: string | null;
  status: string | null;
  rail: string | null;
};

function emptyFiscalReceipt(): FiscalReceiptFields {
  return {
    reference: null,
    token: null,
    invoiceId: null,
    status: null,
    rail: null,
  };
}

/** Read public FNE / RNE fields from transaction metadata.fiscal. */
export function readFiscalReceipt(
  metadata: JsonValue | null | undefined,
): FiscalReceiptFields {
  if (!isJsonObject(metadata)) return emptyFiscalReceipt();
  const fiscal = metadata[FISCAL_METADATA_KEY];
  if (!isJsonObject(fiscal)) return emptyFiscalReceipt();
  return {
    reference: readString(fiscal, "reference")?.trim() || null,
    token: readString(fiscal, "token")?.trim() || null,
    invoiceId:
      readString(fiscal, "invoice_id")?.trim() ||
      readString(fiscal, "invoiceId")?.trim() ||
      null,
    status: readString(fiscal, "status")?.trim() || null,
    rail: readString(fiscal, "rail")?.trim() || null,
  };
}

/** Public subset stored on transactions.metadata.fiscal after certification. */
export function fiscalReceiptMetadata(fields: {
  reference: string | null;
  token: string | null;
  invoiceId: string | null;
  status: string;
  rail: string;
}): JsonObject {
  const fiscal: JsonObject = {
    status: fields.status,
    rail: fields.rail,
  };
  if (fields.reference) fiscal["reference"] = fields.reference;
  if (fields.token) fiscal["token"] = fields.token;
  if (fields.invoiceId) fiscal["invoice_id"] = fields.invoiceId;
  return { [FISCAL_METADATA_KEY]: fiscal };
}

export function isHttpUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  return /^https?:\/\//i.test(value.trim());
}

function publicFiscalText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed || isUuid(trimmed)) return null;
  return trimmed;
}

/** DGI reference shown to customers. Never a UUID. */
export function displayFiscalReference(
  fields: FiscalReceiptFields,
): string | null {
  return publicFiscalText(fields.reference);
}

/** Token or visuel URL to encode as a QR. Skip UUIDs. */
export function fiscalQrPayload(fields: FiscalReceiptFields): string | null {
  return publicFiscalText(fields.token) ?? displayFiscalReference(fields);
}
