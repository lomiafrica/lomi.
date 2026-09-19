import {
  isJsonObject,
  isString,
  readString,
  type JsonValue,
} from "@lomi./shared";

export type InvoiceBankKey =
  | "account_name"
  | "iban"
  | "bic"
  | "account_number"
  | "routing";

export type InvoiceBankRow = {
  key: InvoiceBankKey;
  label: string;
  value: string;
};

const LABELS: Record<InvoiceBankKey, string> = {
  account_name: "Account name",
  iban: "IBAN",
  bic: "BIC",
  account_number: "Account number",
  routing: "Routing",
};

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
    rowFromValue("iban", readString(details, "iban")),
    rowFromValue("bic", readString(details, "bic") ?? readString(details, "swift")),
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
