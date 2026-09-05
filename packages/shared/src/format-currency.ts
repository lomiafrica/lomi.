export type FormatCurrencyOptions = {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  style?: "currency" | "decimal";
  notation?: "standard" | "compact";
  /** When true, round XOF amounts up to the nearest 50 (0 stays 0). Default false. */
  roundXof?: boolean;
};

/**
 * Rounds XOF amounts up to the nearest 50.
 * Free (0 or less) stays 0.
 */
export function roundXofAmount(amount: number): number {
  if (amount <= 0) return 0;
  if (amount < 50) return 50;
  return Math.ceil(amount / 50) * 50;
}

/**
 * Formats a currency amount for customer-facing display.
 * XOF is shown as "F CFA". Accepts both ISO codes and the display label "F CFA".
 */
export function formatCurrency(
  amount: number,
  currency = "XOF",
  options?: FormatCurrencyOptions,
): string {
  const normalizedCurrency = currency === "F CFA" ? "XOF" : currency;

  const defaultMaxDigits = normalizedCurrency === "XOF" ? 1 : 2;
  const defaultMinDigits = 0;

  const {
    maximumFractionDigits = defaultMaxDigits,
    minimumFractionDigits = defaultMinDigits,
    style = "currency",
    notation = "standard",
    roundXof = false,
  } = options || {};

  const finalAmount =
    roundXof && normalizedCurrency === "XOF" ? roundXofAmount(amount) : amount;

  const locale =
    normalizedCurrency === "XOF" ||
    normalizedCurrency === "USD" ||
    normalizedCurrency === "EUR"
      ? "fr-FR"
      : "en-US";

  try {
    const effectiveMinDigits = Math.max(0, minimumFractionDigits);
    const effectiveMaxDigits = Math.max(
      effectiveMinDigits,
      maximumFractionDigits,
    );

    const numberFormatter = new Intl.NumberFormat(locale, {
      style: "decimal",
      maximumFractionDigits: effectiveMaxDigits,
      minimumFractionDigits: effectiveMinDigits,
      notation,
    });
    let formattedNumber = numberFormatter.format(finalAmount);

    if (locale === "fr-FR") {
      formattedNumber = formattedNumber.replace(",", ".");
    }

    formattedNumber = formattedNumber.replace(/\s/g, " ");

    if (style === "currency") {
      if (normalizedCurrency === "XOF") {
        const xofFormatted = new Intl.NumberFormat("fr-FR", {
          style: "decimal",
          maximumFractionDigits: effectiveMaxDigits,
          minimumFractionDigits: effectiveMinDigits,
          notation,
        })
          .format(finalAmount)
          .replace(/\s/g, " ");
        return `${xofFormatted} F CFA`;
      }
      if (normalizedCurrency === "USD") {
        return `${formattedNumber} $`;
      }
      if (normalizedCurrency === "EUR") {
        return `${formattedNumber} €`;
      }
      return new Intl.NumberFormat("en-US", {
        style,
        currency: normalizedCurrency,
        maximumFractionDigits: effectiveMaxDigits,
        minimumFractionDigits: effectiveMinDigits,
        notation,
      }).format(finalAmount);
    }

    return formattedNumber;
  } catch {
    console.warn(
      `Invalid currency code: ${normalizedCurrency}. Using default format.`,
    );
    const fallbackFormatted = finalAmount.toLocaleString("en-US", {
      maximumFractionDigits: options?.maximumFractionDigits ?? defaultMaxDigits,
      minimumFractionDigits: options?.minimumFractionDigits ?? defaultMinDigits,
    });
    if (style === "currency") {
      if (normalizedCurrency === "USD")
        return `${fallbackFormatted.replace(/\s/g, " ")} $`;
      if (normalizedCurrency === "EUR")
        return `${fallbackFormatted.replace(/\s/g, " ")} €`;
      if (normalizedCurrency === "XOF") {
        return `${fallbackFormatted.replace(/\s/g, " ")} F CFA`;
      }
      return `${fallbackFormatted.replace(/\s/g, " ")} ${normalizedCurrency}`;
    }
    return fallbackFormatted;
  }
}

/** Alias — XOF is shown as F CFA. */
export function formatCurrencyDisplay(
  amount: number,
  currency = "XOF",
  options?: FormatCurrencyOptions,
): string {
  return formatCurrency(amount, currency, options);
}

/** Checkout alias for formatCurrencyDisplay. */
export function formatCheckoutCurrency(
  amount: number,
  currency = "XOF",
  options?: FormatCurrencyOptions,
): string {
  return formatCurrencyDisplay(amount, currency, options);
}

/** Maps ISO currency codes to customer-facing labels (XOF → F CFA, EUR → €, USD → $). */
export function getDisplayCurrencyCode(currencyCode: string): string {
  if (!currencyCode) return currencyCode;
  const normalized = currencyCode === "F CFA" ? "XOF" : currencyCode;
  if (normalized === "XOF") return "F CFA";
  if (normalized === "EUR") return "€";
  if (normalized === "USD") return "$";
  return currencyCode;
}
