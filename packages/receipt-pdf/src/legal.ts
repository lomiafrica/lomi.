export const PDF_LEGAL_ENTITY = "lomi. Technologies Africa S.A";
export const PDF_LEGAL_FORM = "an Ivoirian limited company";
export const PDF_RCCM = "CI-ABJ-03-2024-B12-07612";
export const PDF_REGISTERED_OFFICE = "Cocody, Les Perles, Rue L82/375, Abidjan";
export const PDF_DOCS_URL = "https://docs.lomi.africa";
export const CUSTOMER_LIBRARY_URL = "https://customers.lomi.africa/portal/library";
export const PDF_LEARN_MORE_LABEL = "Learn more about our billing products";
export const PDF_SUPPORT_EMAIL_FALLBACK = "support@lomi.africa";
export const PDF_PAY_ONLINE_LABEL = "Pay online";
export const PDF_PAY_LINK_LABEL = "Link";

export const PDF_LEGAL_LINE_1 = `${PDF_LEGAL_ENTITY} is ${PDF_LEGAL_FORM}. Registered number: ${PDF_RCCM}. Registered office:`;

export type PdfDocumentKind = "invoice" | "receipt";

export function extractEmailFromText(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  const at = value.indexOf("@");
  if (at <= 0 || at === value.length - 1) return undefined;
  let start = at - 1;
  while (start >= 0 && /[A-Za-z0-9._+-]/.test(value[start] ?? "")) {
    start -= 1;
  }
  let end = at + 1;
  while (end < value.length && /[A-Za-z0-9.-]/.test(value[end] ?? "")) {
    end += 1;
  }
  const email = value.slice(start + 1, end);
  const domainDot = email.indexOf(".", at - start);
  if (domainDot <= at - start || domainDot === email.length - 1) {
    return undefined;
  }
  return email;
}

export function resolveSupportEmail(
  ...candidates: Array<string | null | undefined>
): string {
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed && trimmed.includes("@")) return trimmed;
  }
  return PDF_SUPPORT_EMAIL_FALLBACK;
}

export function contactLineSuffix(kind: PdfDocumentKind): string {
  return ` with any questions regarding this ${kind}.`;
}
