export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export interface ReceiptAddress {
  name: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  email?: string;
  phone?: string;
}

export interface ReceiptLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  isFee: boolean;
}

export interface ReceiptSubscriptionDetails {
  planName: string;
  billingFrequency: string;
  nextBillingDate: string;
  status: string;
}

export interface ReceiptDocumentData {
  title: string;
  transactionId: string;
  providerTransactionId?: string;
  date: string;
  paymentMethod: string;
  currency: string;
  from: ReceiptAddress;
  to: ReceiptAddress;
  lineItems: ReceiptLineItem[];
  showQuantityAndPrice: boolean;
  totalAmount: number;
  totalLabel: string;
  logoUrl?: string;
  subscription?: ReceiptSubscriptionDetails;
  isMerchantReceipt: boolean;
  subtotal?: number;
  platformFee?: number;
}

export interface ReceiptTransactionInput {
  transaction_id: string;
  date?: string;
  created_at?: string;
  currency?: string;
  currency_code?: string;
  gross_amount?: number | null;
  net_amount?: number | null;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  customer_address?: string | null;
  customer_city?: string | null;
  customer_postal_code?: string | null;
  customer_country?: string | null;
  product_id?: string | null;
  product_name?: string | null;
  product_price?: number | null;
  quantity?: number | null;
  provider_code?: string | null;
  payment_method_code?: string | null;
  card_last4?: string | null;
  card_brand?: string | null;
  provider_transaction_id?: string | null;
  subscription_id?: string | null;
  plan_name?: string | null;
  plan_billing_frequency?: string | null;
  subscription_next_billing_date?: string | null;
  subscription_status?: string | null;
  metadata?: JsonValue;
}

export interface ReceiptLineItemsResult {
  items: ReceiptLineItem[];
  subtotal: number;
  platformFee: number;
}

export interface ReceiptBuildOptions {
  organizationName: string;
  organizationLogo?: string;
  organizationStreet?: string;
  organizationCity?: string;
  organizationRegion?: string;
  organizationPostalCode?: string;
  organizationCountry?: string;
  organizationEmail?: string;
  receiptTitle?: string;
  isMerchantReceipt?: boolean;
  formatPaymentMethod: (code: string | null | undefined) => string;
  formatBillingFrequency?: (frequency: string | undefined | null) => string;
  formatSubscriptionStatus?: (status: string | undefined | null) => string;
}

export interface ReceiptLayoutLabels {
  poweredBy?: string;
  billedBy: string;
  billedTo: string;
  receiptId: string;
  transactionId: string;
  date: string;
  paymentMethod: string;
  description: string;
  quantity: string;
  price: string;
  amount: string;
  subtotal?: string;
  fees?: string;
  download: string;
  generating: string;
  reference?: string;
  item?: string;
  items?: string;
  plan?: string;
  nextBilling?: string;
  status?: string;
}
