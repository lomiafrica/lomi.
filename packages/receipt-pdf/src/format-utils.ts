const GENERIC_RECEIPT_ITEM_NAMES = new Set([
  "payment",
  "direct charge",
  "product",
  "product/service",
  "payment/service",
  "service",
  "item",
  "produit",
  "paiement",
  "article",
]);

/** True when the name is a charge fallback, not a real product. */
export function isGenericReceiptItemName(
  value: string | null | undefined,
): boolean {
  if (!value?.trim()) return true;
  return GENERIC_RECEIPT_ITEM_NAMES.has(value.trim().toLowerCase());
}

export function stripEmojis(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(
      /([\u{1F300}-\u{1F5FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{200D}])/gu,
      "",
    )
    .trim();
}

export function formatPhoneNumber(phoneNumber: string | null | undefined): string {
  if (!phoneNumber) return "";

  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.startsWith("225") && cleaned.length >= 12) {
    return `+225 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)} ${cleaned.slice(11, 13)}`;
  }

  if (cleaned.startsWith("221") && cleaned.length >= 12) {
    return `+221 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
  }

  if (cleaned.length > 3) {
    const countryCodeMatch = phoneNumber.match(/^\+(\d{1,3})/);
    const countryCode = countryCodeMatch ? countryCodeMatch[1] : "";

    if (countryCode) {
      let formatted = `+${countryCode} `;
      const remainingDigits = cleaned.slice(countryCode.length);

      for (let i = 0; i < remainingDigits.length; i += 2) {
        formatted += `${remainingDigits.slice(i, i + 2)} `;
      }

      return formatted.trim();
    }
  }

  return phoneNumber.startsWith("+") ? phoneNumber : `+${cleaned}`;
}

export function formatReceiptDate(
  dateString: string | undefined | null,
): string {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      const parsedDate = Date.parse(dateString);
      if (!Number.isNaN(parsedDate)) {
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(new Date(parsedDate));
      }
      return "Invalid Date";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return "Invalid Date";
  }
}

export function formatSubscriptionStatus(
  status: string | undefined | null,
): string {
  if (!status) return "N/A";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatReceiptLineDetail(
  quantity: number,
  unitPrice: number,
  currency: string,
): string | null {
  if (quantity <= 1) return null;
  return `${quantity} × ${formatCurrencyForReceipt(unitPrice, currency)}`;
}

export function formatCurrencyForReceipt(
  amount: number,
  currency = "XOF",
): string {
  const normalizedCurrency = currency === "F CFA" ? "XOF" : currency;
  const locale =
    normalizedCurrency === "XOF" ||
    normalizedCurrency === "USD" ||
    normalizedCurrency === "EUR"
      ? "fr-FR"
      : "en-US";

  const maximumFractionDigits = normalizedCurrency === "XOF" ? 0 : 2;

  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: "decimal",
      maximumFractionDigits,
      minimumFractionDigits: 0,
    }).format(amount);

    if (normalizedCurrency === "XOF") {
      return `${formatted.replace(/\s/g, " ")} F CFA`;
    }

    if (normalizedCurrency === "USD") return `$${formatted}`;
    if (normalizedCurrency === "EUR") return `€${formatted}`;

    return `${formatted} ${normalizedCurrency}`;
  } catch {
    return `${amount} ${normalizedCurrency}`;
  }
}
