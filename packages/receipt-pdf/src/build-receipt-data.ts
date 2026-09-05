import {
  formatReceiptPaymentMethod,
  isFreeReceiptRail,
} from "./format-payment-method";
import {
  formatCurrencyForReceipt,
  formatPhoneNumber,
  formatReceiptDate,
  isGenericReceiptItemName,
  isPlaceholderReceiptValue,
  isTrialSubscriptionStatus,
  resolveReceiptLineDetail,
  stripEmojis,
} from "./format-utils";
import type {
  JsonObject,
  JsonValue,
  ReceiptBuildOptions,
  ReceiptDocumentData,
  ReceiptLineItem,
  ReceiptLineItemsResult,
  ReceiptTransactionInput,
} from "./types";

const DEFAULT_LOGO_URL =
  "https://res.cloudinary.com/dzrdlevfn/image/upload/v1757529912/git_vqxkbj.png";

function isJsonObject(value: JsonValue): value is JsonObject {
  return value !== null && !Array.isArray(value) && typeof value === "object";
}

function isString(value: JsonValue): value is string {
  return typeof value === "string";
}

function asMetadataRecord(metadata: JsonValue | undefined): JsonObject | null {
  return metadata !== undefined && isJsonObject(metadata) ? metadata : null;
}

function readMetadataString(
  metadata: JsonObject | null,
  key: string,
): string | undefined {
  const value = metadata?.[key];
  return value !== undefined && isString(value) ? value : undefined;
}

function readMetadataNumber(
  metadata: JsonObject | null,
  key: string,
): number | undefined {
  const value = metadata?.[key];
  if (value === undefined) return undefined;
  if (isFiniteNumber(value) && value > 0) return value;
  if (isString(value)) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return undefined;
}

function resolveRecurringAmount(transaction: ReceiptTransactionInput): number {
  if ((transaction.product_price ?? 0) > 0) {
    return transaction.product_price ?? 0;
  }
  const metadata = asMetadataRecord(transaction.metadata);
  return (
    readMetadataNumber(metadata, "plan_amount") ??
    readMetadataNumber(metadata, "unit_price") ??
    readMetadataNumber(metadata, "price") ??
    0
  );
}

function formatTrialStartingLine(parts: {
  amount: string;
  interval: string;
  date: string;
}): string {
  return `${parts.amount} per ${parts.interval} starting ${parts.date}`;
}

function resolveProductName(
  transaction: ReceiptTransactionInput,
  fallback: string,
): string {
  if (transaction.product_name && transaction.product_name !== "Item") {
    return transaction.product_name;
  }

  const metadata = asMetadataRecord(transaction.metadata);
  if (metadata) {
    const fromMeta =
      readMetadataString(metadata, "name") ||
      readMetadataString(metadata, "product_name");
    if (fromMeta) return fromMeta;
  }

  return fallback;
}

function isFiniteNumber(value: JsonValue): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function readMetadataLineItems(
  metadata: JsonObject | null,
): ReceiptLineItem[] | null {
  const raw = metadata?.line_items ?? metadata?.cart_items;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const items: ReceiptLineItem[] = [];
  for (const entry of raw) {
    if (!isJsonObject(entry)) continue;
    const named = readMetadataString(entry, "name");
    const name =
      named ?? readMetadataString(entry, "description") ?? "Item";
    const quantity = isFiniteNumber(entry.quantity)
      ? Math.max(1, entry.quantity)
      : 1;
    const unitPrice = isFiniteNumber(entry.unit_price)
      ? entry.unit_price
      : isFiniteNumber(entry.price)
        ? entry.price
        : 0;
    const title = stripEmojis(name);
    items.push({
      description: title,
      detail: resolveReceiptLineDetail(
        title,
        readMetadataString(entry, "product_description"),
        named ? readMetadataString(entry, "description") : undefined,
      ),
      quantity,
      unitPrice,
      amount: quantity * unitPrice,
      isFee: false,
    });
  }
  return items.length > 0 ? items : null;
}

function resolveSubscriptionName(transaction: ReceiptTransactionInput): string {
  if (transaction.plan_name && transaction.plan_name !== "Item") {
    return transaction.plan_name;
  }

  const metadata = asMetadataRecord(transaction.metadata);
  return (
    readMetadataString(metadata, "plan_name") ||
    readMetadataString(metadata, "name") ||
    "Subscription"
  );
}

function transactionLineDetail(
  title: string,
  transaction: ReceiptTransactionInput,
): string | undefined {
  const metadata = asMetadataRecord(transaction.metadata);
  return resolveReceiptLineDetail(
    title,
    transaction.product_description,
    transaction.plan_description,
    readMetadataString(metadata, "product_description"),
    readMetadataString(metadata, "plan_description"),
    readMetadataString(metadata, "description"),
  );
}

export function buildReceiptLineItems(
  transaction: ReceiptTransactionInput,
  isMerchantReceipt: boolean,
): ReceiptLineItemsResult {
  const items: ReceiptLineItem[] = [];
  let subtotal = 0;
  let platformFee = 0;

  const grossAmount = transaction.gross_amount ?? 0;
  const netAmount = transaction.net_amount ?? 0;
  const metadataItems = readMetadataLineItems(
    asMetadataRecord(transaction.metadata),
  );

  if (metadataItems) {
    const subtotalFromItems = metadataItems.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    let fee = 0;
    if (isMerchantReceipt) {
      fee = netAmount > 0 ? subtotalFromItems - netAmount : 0;
      if (fee < 0.01) fee = 0;
    }
    const pricedItems = [...metadataItems];
    if (isMerchantReceipt && fee > 0.01) {
      pricedItems.push({
        description: "Fees",
        quantity: 1,
        unitPrice: fee,
        amount: fee,
        isFee: true,
      });
    }
    return {
      items: pricedItems,
      subtotal: subtotalFromItems,
      platformFee: fee,
    };
  }

  const isTrial = isTrialSubscriptionStatus(transaction.subscription_status);
  const namedProduct =
    transaction.product_name &&
    !isGenericReceiptItemName(transaction.product_name)
      ? transaction.product_name
      : null;

  if (
    !isTrial &&
    transaction.product_id &&
    transaction.product_id !== "" &&
    namedProduct &&
    (transaction.product_price ?? 0) > 0
  ) {
    const quantity = transaction.quantity ?? 1;
    const unitPrice = transaction.product_price ?? 0;
    subtotal = unitPrice * quantity;

    if (subtotal === 0 && grossAmount > 0) {
      subtotal = grossAmount;
    }

    if (isMerchantReceipt) {
      if (netAmount > 0) {
        platformFee = subtotal - netAmount;
      } else {
        platformFee = grossAmount - subtotal;
      }
      if (platformFee < 0.01) platformFee = 0;
    }

    const title = stripEmojis(resolveProductName(transaction, namedProduct));
    items.push({
      description: title,
      detail: transactionLineDetail(title, transaction),
      quantity,
      unitPrice,
      amount: subtotal,
      isFee: false,
    });
  } else if (transaction.subscription_id) {
    subtotal = grossAmount;

    if (isMerchantReceipt) {
      platformFee = netAmount > 0 ? subtotal - netAmount : 0;
    }

    const title = stripEmojis(resolveSubscriptionName(transaction));
    items.push({
      description: title,
      detail: transactionLineDetail(title, transaction),
      quantity: 1,
      unitPrice: subtotal,
      amount: subtotal,
      isFee: false,
    });
  } else if (namedProduct && grossAmount > 0) {
    const quantity = transaction.quantity ?? 1;
    const unitPrice = grossAmount / quantity;
    subtotal = grossAmount;

    if (isMerchantReceipt) {
      platformFee = netAmount > 0 ? subtotal - netAmount : 0;
    }

    const title = stripEmojis(resolveProductName(transaction, namedProduct));
    items.push({
      description: title,
      detail: transactionLineDetail(title, transaction),
      quantity,
      unitPrice,
      amount: subtotal,
      isFee: false,
    });
  } else {
    subtotal = grossAmount;

    if (isMerchantReceipt) {
      platformFee = netAmount > 0 ? subtotal - netAmount : 0;
    }
  }

  if (isMerchantReceipt && platformFee > 0.01) {
    items.push({
      description: "Fees",
      quantity: 1,
      unitPrice: platformFee,
      amount: platformFee,
      isFee: true,
    });
  }

  return { items, subtotal, platformFee };
}

export function buildReceiptDocumentData(
  transaction: ReceiptTransactionInput,
  options: ReceiptBuildOptions,
): ReceiptDocumentData {
  const isMerchantReceipt = options.isMerchantReceipt ?? false;
  const currency = transaction.currency || transaction.currency_code || "XOF";
  const { items, subtotal, platformFee } = buildReceiptLineItems(
    transaction,
    isMerchantReceipt,
  );

  const productItems = items.filter((item) => !item.isFee);
  const showQuantityAndPrice =
    productItems.length > 1 || productItems.some((item) => item.quantity !== 1);
  const isTrial = isTrialSubscriptionStatus(transaction.subscription_status);
  const chargedAmount = transaction.gross_amount ?? 0;
  const totalAmount = isTrial
    ? chargedAmount
    : isMerchantReceipt
      ? subtotal - platformFee
      : subtotal;
  const isFree = !isTrial && (isFreeReceiptRail(transaction) || totalAmount <= 0);
  const totalLabel = isMerchantReceipt ? "Amount received" : "Total paid";

  const logoUrl =
    options.organizationLogo && options.organizationLogo !== DEFAULT_LOGO_URL
      ? options.organizationLogo
      : undefined;

  const formatBilling =
    options.formatBillingFrequency ?? ((frequency) => frequency || "N/A");

  const document: ReceiptDocumentData = {
    title: options.receiptTitle || "Receipt",
    transactionId: transaction.transaction_id,
    providerTransactionId: transaction.provider_transaction_id || undefined,
    date: formatReceiptDate(transaction.date || transaction.created_at, {
      includeTime: true,
    }),
    paymentMethod: formatReceiptPaymentMethod(
      transaction,
      options.formatPaymentMethod,
    ),
    currency,
    from: {
      name: stripEmojis(options.organizationName || "lomi."),
      street: options.organizationStreet,
      district: options.organizationDistrict,
      city: options.organizationCity,
      region: options.organizationRegion,
      postalCode: options.organizationPostalCode,
      country: options.organizationCountry,
      email: options.organizationEmail,
    },
    to: {
      name: stripEmojis(transaction.customer_name || "Valued Customer"),
      street: transaction.customer_address || undefined,
      city: transaction.customer_city || undefined,
      postalCode: transaction.customer_postal_code || undefined,
      country: transaction.customer_country || undefined,
      email: transaction.customer_email || undefined,
      phone: transaction.customer_phone
        ? formatPhoneNumber(transaction.customer_phone)
        : undefined,
    },
    lineItems: items,
    showQuantityAndPrice,
    totalAmount,
    totalLabel,
    isFree,
    logoUrl,
    isMerchantReceipt,
    subtotal,
    platformFee,
    addressLocale: options.addressLocale,
  };

  if (transaction.subscription_id) {
    const billingFrequency = formatBilling(transaction.plan_billing_frequency);
    const nextBillingDate = formatReceiptDate(
      transaction.subscription_next_billing_date,
    );
    const recurringAmount = resolveRecurringAmount(transaction);
    document.subscription = {
      planName: stripEmojis(transaction.plan_name || "N/A"),
      billingFrequency,
      nextBillingDate,
      recurringAmount,
      isTrial,
    };
    if (
      isTrial &&
      recurringAmount > 0 &&
      !isPlaceholderReceiptValue(billingFrequency) &&
      !isPlaceholderReceiptValue(nextBillingDate)
    ) {
      const formatStarting =
        options.formatTrialStarting ?? formatTrialStartingLine;
      document.amountHint = formatStarting({
        amount: formatCurrencyForReceipt(recurringAmount, currency),
        interval: billingFrequency,
        date: nextBillingDate,
      });
    }
  }

  return document;
}
