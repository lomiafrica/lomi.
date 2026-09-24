import {
  isJsonObject,
  isString,
  readBoolean,
  readString,
  type JsonValue,
} from "@lomi./shared";

export type InvoiceBankKey =
  | "account_name"
  | "bank_name"
  | "provider"
  | "phone"
  | "iban"
  | "bic"
  | "account_number"
  | "routing";

export type InvoiceBankRow = {
  key: InvoiceBankKey;
  label: string;
  value: string;
};

const LABELS = {
  account_name: "Account name",
  bank_name: "Bank",
  provider: "Mobile money",
  phone: "Number",
  iban: "IBAN",
  bic: "BIC",
  account_number: "Account number",
  routing: "Routing",
} as const satisfies Record<InvoiceBankKey, string>;

const CONTENT_LABELS: Array<{ match: RegExp; key: InvoiceBankKey }> = [
  { match: /^account name\s*:/i, key: "account_name" },
  { match: /^iban\s*:/i, key: "iban" },
  { match: /^(bic|swift)\s*:/i, key: "bic" },
  { match: /^account number\s*:/i, key: "account_number" },
  { match: /^(routing|ach routing|routing number)\s*:/i, key: "routing" },
];

function compactBankValue(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function formatIbanDisplay(iban: string): string {
  const compact = compactBankValue(iban);
  return compact.replace(/(.{4})/g, "$1 ").trim();
}

function displayValue(key: InvoiceBankKey, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (key === "iban") return formatIbanDisplay(trimmed);
  if (key === "bic") return compactBankValue(trimmed);
  return trimmed;
}

function skipContentLine(line: string): boolean {
  const lower = line.toLowerCase();
  if (lower.startsWith("pay online:")) return true;
  if (lower.includes("pay.lomi.africa")) return true;
  return false;
}

function rowFromValue(
  key: InvoiceBankKey,
  value: string | undefined,
): InvoiceBankRow | undefined {
  if (!value?.trim()) return undefined;
  return {
    key,
    label: LABELS[key],
    value: displayValue(key, value),
  };
}

function parseContentRows(content: string): InvoiceBankRow[] {
  const rows: InvoiceBankRow[] = [];
  const seen = new Set<InvoiceBankKey>();
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || skipContentLine(line)) continue;
    for (const { match, key } of CONTENT_LABELS) {
      if (!match.test(line)) continue;
      const value = line.replace(match, "").trim();
      const row = rowFromValue(key, value);
      if (!row || seen.has(key)) break;
      seen.add(key);
      rows.push(row);
      break;
    }
  }
  return rows;
}

/** Bank rows for invoice PDFs and hosted invoices. Drops pay.lomi.africa links. */
export function parseInvoiceBankRows(
  details: JsonValue | null | undefined,
): InvoiceBankRow[] {
  if (!isJsonObject(details) && !isString(details)) return [];

  if (isString(details)) return parseContentRows(details);

  const structured = [
    rowFromValue("account_name", readString(details, "account_name")),
    rowFromValue("bank_name", readString(details, "bank_name")),
    rowFromValue("provider", readString(details, "provider")),
    rowFromValue("phone", readString(details, "phone")),
    rowFromValue("iban", readString(details, "iban")),
    rowFromValue(
      "bic",
      readString(details, "bic") ?? readString(details, "swift"),
    ),
    rowFromValue("account_number", readString(details, "account_number")),
    rowFromValue(
      "routing",
      readString(details, "routing") ??
        readString(details, "routing_ach") ??
        readString(details, "routing_number"),
    ),
  ].filter((row): row is InvoiceBankRow => row !== undefined);

  if (structured.length > 0) return structured;

  const content = readString(details, "content");
  return content ? parseContentRows(content) : [];
}

/** True when the merchant asked for a pay link on this invoice. */
export function invoiceIncludesPayLink(
  details: JsonValue | null | undefined,
): boolean {
  return isJsonObject(details) && readBoolean(details, "include_pay_link") === true;
}

/** Bank or mobile-money rows copied from the linked payout account. */
export function linkedInvoicePaymentRows(
  details: JsonValue | null | undefined,
): InvoiceBankRow[] {
  if (!isJsonObject(details) || !readString(details, "payout_method_id")) {
    return [];
  }
  return parseInvoiceBankRows(details);
}
