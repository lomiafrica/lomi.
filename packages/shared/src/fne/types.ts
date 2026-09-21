/** Official DGI FNE / DGIPay types from the May 2025 and Nov 2025 public PDFs. */

export const FNE_INVOICE_TYPES = ["sale", "purchase"] as const;
export type FneInvoiceType = (typeof FNE_INVOICE_TYPES)[number];

export const FNE_PAYMENT_METHODS = [
  "cash",
  "card",
  "check",
  "mobile-money",
  "transfer",
  "deferred",
] as const;
export type FnePaymentMethod = (typeof FNE_PAYMENT_METHODS)[number];

export const FNE_TEMPLATES = ["B2B", "B2C", "B2G", "B2F"] as const;
export type FneTemplate = (typeof FNE_TEMPLATES)[number];

export const FNE_TAX_CODES = ["TVA", "TVAB", "TVAC", "TVAD"] as const;
export type FneTaxCode = (typeof FNE_TAX_CODES)[number];

export const FNE_FOREIGN_CURRENCIES = [
  "XOF",
  "USD",
  "EUR",
  "JPY",
  "CAD",
  "GBP",
  "AUD",
  "CNH",
  "CHF",
  "HKD",
  "NZD",
] as const;
export type FneForeignCurrency = (typeof FNE_FOREIGN_CURRENCIES)[number];

export const DGIPAY_PAYMENT_MODES = [
  "ESPECE",
  "CARTE",
  "MOBILE",
  "CHEQUE",
  "VIREMENT",
] as const;
export type DgiPayPaymentMode = (typeof DGIPAY_PAYMENT_MODES)[number];

export type FneCustomTax = {
  name: string;
  amount: number;
};

export type FneSignItem = {
  taxes: FneTaxCode[];
  customTaxes?: FneCustomTax[];
  reference?: string;
  description: string;
  quantity: number;
  amount: number;
  discount?: number;
  measurementUnit?: string;
};

export type FneSignPayload = {
  invoiceType: FneInvoiceType;
  paymentMethod: FnePaymentMethod;
  template: FneTemplate;
  isRne: boolean;
  rne?: string;
  clientNcc?: string;
  clientCompanyName: string;
  clientPhone: string;
  clientEmail: string;
  clientSellerName?: string;
  pointOfSale: string;
  establishment: string;
  commercialMessage?: string;
  footer?: string;
  foreignCurrency?: string;
  foreignCurrencyRate?: number;
  items: FneSignItem[];
  customTaxes?: FneCustomTax[];
  discount?: number;
};

export type FneRefundItem = {
  id: string;
  quantity: number;
};

export type FneCertificationStatus =
  | "not_requested"
  | "sign_pending"
  | "certified"
  | "failed"
  | "voided";

export type FneSignResult = {
  ncc: string | null;
  reference: string | null;
  token: string | null;
  warning: boolean | null;
  balanceSticker: number | null;
  invoiceId: string | null;
};

export type MerchantInvoiceForFne = {
  customerName: string;
  customerNcc?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  paymentMethod: string | null;
  template: FneTemplate;
  pointOfSale: string;
  establishment: string;
  isRne?: boolean;
  rne?: string | null;
  clientSellerName?: string | null;
  invoiceType?: FneInvoiceType;
  foreignCurrency?: string | null;
  foreignCurrencyRate?: number | null;
  lineItems: {
    name: string;
    quantity: number;
    unitPrice: number;
    taxes: FneTaxCode[];
    reference?: string | null;
    measurementUnit?: string | null;
    discount?: number | null;
  }[];
};

export type FnePayloadError = {
  code:
    | "missing_customer_name"
    | "b2b_ncc_required"
    | "missing_line_items"
    | "unmapped_payment_method"
    | "invalid_line_item"
    | "missing_point_of_sale"
    | "missing_establishment"
    | "b2f_currency_required"
    | "rne_number_required";
  message: string;
};
