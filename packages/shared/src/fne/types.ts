/** Côte d'Ivoire FNE certification via KOMPTO. Not legal or tax advice. */

export type FneScope = "merchant_invoice" | "platform_commission";

export type FneCertificationStatus =
  | "not_requested"
  | "verify_pending"
  | "verified"
  | "confirm_pending"
  | "certified"
  | "failed"
  | "voided";

export type FneClientType = "B2B" | "B2C" | "B2G" | "B2F";

/**
 * KOMPTO-published TVA *field names* from https://kompto.com/KomptoApi.
 * Rates are computed by KOMPTO. Do not hard-code percentages in lomi. money math.
 */
export type KomptoTvaName = "TVA" | "TVAB" | "TVAC" | "TVAD" | "TVAE";

/**
 * Only `transfer` is confirmed by KOMPTO's public curl example.
 * Other payment-mode strings wait for the PDF guide.
 */
export type KomptoPaymentMethod = "transfer";

export type FneAggregationPeriodKind = "month" | "semi_annual" | "custom";

export type FneAggregationPeriod = {
  kind: FneAggregationPeriodKind;
  startInclusive: string;
  endExclusive: string;
};

export type FneCertificationRecord = {
  localInvoiceId: string;
  organizationId: string;
  scope: FneScope;
  status: FneCertificationStatus;
  komptoInvoiceId: string | null;
  dgiIdentifier: string | null;
  qrPayload: string | null;
  pdfUrl: string | null;
  lastError: string | null;
  certifiedAt: string | null;
  period?: FneAggregationPeriod | null;
};

export type MerchantInvoiceLineForFne = {
  name: string;
  quantity: number;
  unitPrice: number;
  tvaName: KomptoTvaName;
};

export type MerchantInvoiceForFne = {
  customerInvoiceId: string;
  organizationId: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerNcc?: string | null;
  clientType: FneClientType;
  paymentMethod: string | null;
  lineItems: MerchantInvoiceLineForFne[];
};

export type CommissionLedgerRow = {
  organizationId: string;
  transactionId: string;
  occurredAt: string;
  commissionAmountMinor: number;
  currencyCode: string;
  alreadyCertified: boolean;
  fneExternalId?: string | null;
};

export type CommissionAggregationBatch = {
  organizationId: string;
  period: FneAggregationPeriod;
  transactionIds: string[];
  totalCommissionMinor: number;
  currencyCode: string;
  skippedAlreadyCertified: string[];
};

export type CertifyMerchantInvoiceRequest = {
  customerInvoiceId: string;
  clientType: FneClientType;
  dryRun: boolean;
};

export type ListFneCertificationQuery = {
  organizationId?: string;
  customerInvoiceId?: string;
  status?: FneCertificationStatus;
};

export type AdminCommissionAggregationRequest = {
  mode: "dry-run" | "commit";
  period: FneAggregationPeriod;
  organizationId?: string;
};

export type FnePlannerAction =
  "skip" | "verify" | "confirm" | "refresh" | "blocked";

export function assertUnreachable(value: never, label: string): never {
  throw new Error(`Unhandled ${label}`);
}
