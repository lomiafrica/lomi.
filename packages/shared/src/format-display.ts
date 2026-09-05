function isDateString(value: Date | string | number): value is string {
  return typeof value === "string";
}

function isDateNumber(value: Date | string | number): value is number {
  return typeof value === "number";
}

export function formatDate(
  date: Date | string | number,
  options?: {
    format?: "short" | "medium" | "long" | "full";
    includeTime?: boolean;
  },
): string {
  const dateObj =
    isDateString(date) || isDateNumber(date) ? new Date(date) : date;

  const { format = "medium", includeTime = false } = options || {};

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: format,
  };
  if (includeTime) {
    dateFormatOptions.timeStyle = "short";
  }

  return new Intl.DateTimeFormat("en-US", dateFormatOptions).format(dateObj);
}

export function formatPercentage(
  value: number,
  options?: {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    includeSymbol?: boolean;
  },
): string {
  const {
    maximumFractionDigits = 1,
    minimumFractionDigits = 1,
    includeSymbol = true,
  } = options || {};

  if (includeSymbol) {
    const formattedNumber = new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      useGrouping: true,
    }).format(value);

    return `${formattedNumber}%`;
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    maximumFractionDigits,
    minimumFractionDigits,
    useGrouping: true,
  }).format(value);
}

export function formatProviderCode(providerCode: string): string {
  switch (providerCode) {
    case "WAVE":
      return "Wave";
    case "CYBERSOURCE":
      return "Cybersource";
    case "MTN":
      return "MTN";
    case "STRIPE":
      return "Cards";
    case "APPLE_PAY":
      return "Apple Pay";
    case "GOOGLE_PAY":
      return "Google Pay";
    case "FREE":
      return "Free";
    case "SPI":
      return "π-SPI";
    case "DJAMO":
      return "Djamo";
    case "ORANGE":
      return "Orange";
    default:
      return (
        providerCode.charAt(0).toUpperCase() +
        providerCode.slice(1).toLowerCase()
      );
  }
}

export function formatPaymentMethod(paymentMethod: string): string {
  switch (paymentMethod) {
    case "CARDS":
      return "Cards";
    case "MOBILE_MONEY":
      return "Mobile Money";
    case "BANK_TRANSFER":
      return "Bank Transfer";
    case "FREE":
      return "Free";
    default:
      return paymentMethod;
  }
}

export function formatNumber(
  amount: number | undefined,
  currency?: string,
  preserveDecimals?: boolean,
): string {
  if (!amount && amount !== 0) return "";

  const isCFA = currency === "F CFA" || currency === "XOF";
  const maxDecimals = isCFA ? 1 : preserveDecimals ? 2 : 0;

  let valueToFormat = amount;
  if (isCFA) {
    valueToFormat = Math.trunc(amount * 10) / 10;
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(valueToFormat);
}

export function parseNumber(formattedAmount: string): number {
  if (!formattedAmount) return 0;
  const normalized = formattedAmount.replace(/\s/g, "").replace(",", ".");
  return parseFloat(normalized) || 0;
}

export function getCurrencyPlaceholder(currency: string): string {
  if (currency === "F CFA" || currency === "XOF") return "10 000";
  if (currency === "EUR") return "15";
  if (currency === "USD") return "15";
  return "0";
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case "failed":
      return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    case "refunded":
      return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    case "expired":
      return "bg-slate-50 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300";
    case "processing":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "pending":
      return "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
    case "held":
      return "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
    default:
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  }
}

export const getLocale = (lang: string) => {
  switch (lang) {
    case "fr":
      return "fr-FR";
    case "es":
      return "es-ES";
    case "zh":
      return "zh-CN";
    case "en":
    default:
      return "en-US";
  }
};

export function formatDateLocalized(
  dateString: string | null,
  lang: string = "en",
): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString(getLocale(lang), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}
