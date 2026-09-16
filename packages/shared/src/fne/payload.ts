import {
  FNE_PAYMENT_METHODS,
  FNE_TAX_CODES,
  type FnePayloadError,
  type FnePaymentMethod,
  type FneSignItem,
  type FneSignPayload,
  type FneTaxCode,
  type MerchantInvoiceForFne,
} from "./types.js";

const PAYMENT_ALIASES: Record<string, FnePaymentMethod> = {
  cash: "cash",
  espece: "cash",
  espèces: "cash",
  card: "card",
  cards: "card",
  stripe: "card",
  "apple-pay": "card",
  apple_pay: "card",
  "google-pay": "card",
  google_pay: "card",
  check: "check",
  cheque: "check",
  chèque: "check",
  "mobile-money": "mobile-money",
  mobile_money: "mobile-money",
  wave: "mobile-money",
  mtn: "mobile-money",
  orange: "mobile-money",
  transfer: "transfer",
  virement: "transfer",
  spi: "transfer",
  bank_transfer: "transfer",
  "bank-transfer": "transfer",
  deferred: "deferred",
  "a-terme": "deferred",
};

/** Map a lomi. rail name onto the DGI annex paymentMethod enum. */
export function mapLomiPaymentMethodToFne(
  method: string | null,
): FnePaymentMethod | null {
  if (!method) return null;
  const normalized = method.trim().toLowerCase();
  if ((FNE_PAYMENT_METHODS as readonly string[]).includes(normalized)) {
    return normalized as FnePaymentMethod;
  }
  return PAYMENT_ALIASES[normalized] ?? null;
}

function isTaxCode(value: string): value is FneTaxCode {
  return (FNE_TAX_CODES as readonly string[]).includes(value);
}

/** Build the official POST /external/invoices/sign body. */
export function buildFneSignPayload(
  invoice: MerchantInvoiceForFne,
): FneSignPayload | FnePayloadError {
  const clientCompanyName = invoice.customerName.trim();
  if (clientCompanyName === "") {
    return {
      code: "missing_customer_name",
      message: "FNE sign requires clientCompanyName.",
    };
  }

  const pointOfSale = invoice.pointOfSale.trim();
  if (pointOfSale === "") {
    return {
      code: "missing_point_of_sale",
      message: "FNE sign requires pointOfSale.",
    };
  }

  const establishment = invoice.establishment.trim();
  if (establishment === "") {
    return {
      code: "missing_establishment",
      message: "FNE sign requires establishment.",
    };
  }

  if (invoice.template === "B2B") {
    const ncc = invoice.customerNcc?.trim() ?? "";
    if (ncc === "") {
      return {
        code: "b2b_ncc_required",
        message: "FNE B2B sign requires clientNcc.",
      };
    }
  }

  const isRne = invoice.isRne === true;
  const rne = invoice.rne?.trim() ?? "";
  if (isRne && rne === "") {
    return {
      code: "rne_number_required",
      message: "FNE sign requires rne when isRne is true.",
    };
  }

  if (invoice.lineItems.length === 0) {
    return {
      code: "missing_line_items",
      message: "FNE sign requires at least one item.",
    };
  }

  const paymentMethod = mapLomiPaymentMethodToFne(invoice.paymentMethod);
  if (paymentMethod === null) {
    return {
      code: "unmapped_payment_method",
      message:
        "Payment method is not a DGI annex value (cash, card, check, mobile-money, transfer, deferred).",
    };
  }

  if (invoice.template === "B2F") {
    const currency = invoice.foreignCurrency?.trim() ?? "";
    if (currency === "") {
      return {
        code: "b2f_currency_required",
        message: "FNE B2F sign requires foreignCurrency and foreignCurrencyRate.",
      };
    }
  }

  const items: FneSignItem[] = [];
  for (const line of invoice.lineItems) {
    const description = line.name.trim();
    const taxes = line.taxes.filter(isTaxCode);
    if (
      description === "" ||
      taxes.length === 0 ||
      !Number.isFinite(line.quantity) ||
      line.quantity <= 0 ||
      !Number.isFinite(line.unitPrice) ||
      line.unitPrice < 0
    ) {
      return {
        code: "invalid_line_item",
        message:
          "FNE line items need a description, at least one DGI tax code, positive quantity, and unit price.",
      };
    }
    const item: FneSignItem = {
      taxes,
      description,
      quantity: line.quantity,
      amount: line.unitPrice,
    };
    const reference = line.reference?.trim();
    if (reference) item.reference = reference;
    const measurementUnit = line.measurementUnit?.trim();
    if (measurementUnit) item.measurementUnit = measurementUnit;
    if (line.discount !== null && line.discount !== undefined) {
      item.discount = line.discount;
    }
    items.push(item);
  }

  const payload: FneSignPayload = {
    invoiceType: invoice.invoiceType ?? "sale",
    paymentMethod,
    template: invoice.template,
    isRne,
    clientCompanyName,
    clientPhone: invoice.customerPhone?.trim() ?? "",
    clientEmail: invoice.customerEmail?.trim() ?? "",
    pointOfSale,
    establishment,
    items,
  };

  const ncc = invoice.customerNcc?.trim();
  if (ncc) payload.clientNcc = ncc;
  if (isRne) payload.rne = rne;
  const seller = invoice.clientSellerName?.trim();
  if (seller) payload.clientSellerName = seller;
  const foreignCurrency = invoice.foreignCurrency?.trim();
  if (foreignCurrency) {
    payload.foreignCurrency = foreignCurrency;
    payload.foreignCurrencyRate = invoice.foreignCurrencyRate ?? 0;
  }

  return payload;
}

export function isFnePayloadError(
  value: FneSignPayload | FnePayloadError,
): value is FnePayloadError {
  return "code" in value && "message" in value && !("items" in value);
}
