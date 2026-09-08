import { isCheckoutCurrencyCode, type CheckoutCurrencyCode } from "./currency-code.js";

export const MONEY_MAX_MINOR = 9_999_999_999;
export const MONEY_MIN_CHARGEABLE_MINOR = 1;

const CURRENCY_EXPONENTS = {
  XOF: 0,
  USD: 2,
  EUR: 2,
} as const satisfies Record<CheckoutCurrencyCode, number>;

export function currencyExponent(currencyCode: string): number {
  if (isCheckoutCurrencyCode(currencyCode)) {
    return CURRENCY_EXPONENTS[currencyCode];
  }
  return 0;
}

export function isAmountMinor(value: number): boolean {
  return Number.isInteger(value) && Number.isSafeInteger(value);
}

export type AssertAmountMinorOptions = {
  allowZero?: boolean;
  max?: number;
};

export type AssertAmountMinorResult =
  | { ok: true; amountMinor: number }
  | { ok: false; code: "amount_invalid"; message: string };

export function assertAmountMinor(
  value: number,
  currencyCode: string,
  options: AssertAmountMinorOptions = {},
): AssertAmountMinorResult {
  const max = options.max ?? MONEY_MAX_MINOR;
  const min = options.allowZero ? 0 : MONEY_MIN_CHARGEABLE_MINOR;

  if (!isAmountMinor(value)) {
    return {
      ok: false,
      code: "amount_invalid",
      message: "Amount must be an integer in minor currency units",
    };
  }
  if (value < min) {
    return {
      ok: false,
      code: "amount_invalid",
      message: options.allowZero
        ? "Amount must be zero or a positive integer"
        : "Amount must be a positive integer in minor currency units",
    };
  }
  if (value > max) {
    return {
      ok: false,
      code: "amount_invalid",
      message: `Amount exceeds the maximum of ${max} minor units`,
    };
  }

  const exponent = currencyExponent(currencyCode);
  if (exponent === 0 && !Number.isInteger(value)) {
    return {
      ok: false,
      code: "amount_invalid",
      message: `${currencyCode} amounts cannot have a fractional minor unit`,
    };
  }

  return { ok: true, amountMinor: value };
}

/** Convert API minor units to the NUMERIC major amount stored in Postgres. */
export function toLedgerMajor(
  minor: number,
  currencyCode: string,
): number {
  return minorToMajorUnits(minor, currencyCode);
}

/** Convert a Postgres NUMERIC major amount to API minor units. */
export function fromLedgerMajor(
  major: number,
  currencyCode: string,
): number {
  return majorToMinorUnits(major, currencyCode);
}

/** Convert a major-unit number to minor units at the API/DB boundary. */
export function majorToMinorUnits(
  major: number,
  currencyCode: string,
): number {
  const factor = 10 ** currencyExponent(currencyCode);
  return Math.round(major * factor);
}

/** Convert minor units to the NUMERIC major amount stored in Postgres. */
export function minorToMajorUnits(
  minor: number,
  currencyCode: string,
): number {
  const factor = 10 ** currencyExponent(currencyCode);
  return minor / factor;
}
