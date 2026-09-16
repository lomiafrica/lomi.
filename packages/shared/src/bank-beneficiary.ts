/** Bank payout-method fields for international and CI withdrawals. */

const UEMOA_COUNTRIES = new Set([
  "BJ",
  "BF",
  "CI",
  "GW",
  "ML",
  "NE",
  "SN",
  "TG",
]);

const IBAN_COUNTRIES = new Set([
  "AD",
  "AT",
  "BE",
  "BG",
  "CH",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GI",
  "GR",
  "HR",
  "HU",
  "IE",
  "IS",
  "IT",
  "LI",
  "LT",
  "LU",
  "LV",
  "MC",
  "MT",
  "NL",
  "NO",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
]);

const EUROZONE = new Set([
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
]);

const SWIFT_PATTERN = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
const IBAN_PATTERN = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$/;
/** UEMOA local account numbers (CI, SN, …) are 24 alphanumeric characters. */
const UEMOA_ACCOUNT_PATTERN = /^[A-Z0-9]{24}$/;
const US_ROUTING_PATTERN = /^[0-9]{9}$/;

export type BankBeneficiaryInput = {
  country: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode?: string | null;
  branchCode?: string | null;
};

export type BankBeneficiaryFieldLayout = {
  accountNumberKind: "iban" | "uemoa_account" | "account";
  bankCodeKind: "swift" | "hidden";
  branchCodeKind: "routing" | "branch" | "hidden";
};

export function normalizeBankCountry(country: string): string {
  return country.trim().toUpperCase();
}

export function isUemoaBankCountry(country: string): boolean {
  return UEMOA_COUNTRIES.has(normalizeBankCountry(country));
}

export function bankBeneficiaryFieldLayout(
  country: string,
): BankBeneficiaryFieldLayout {
  const code = normalizeBankCountry(country);
  if (code === "US") {
    return {
      accountNumberKind: "account",
      bankCodeKind: "hidden",
      branchCodeKind: "routing",
    };
  }
  // UEMOA local bank form (CI, SN, …): 24-char account + SWIFT. Not Airwallex.
  if (UEMOA_COUNTRIES.has(code)) {
    return {
      accountNumberKind: "uemoa_account",
      bankCodeKind: "swift",
      branchCodeKind: "hidden",
    };
  }
  if (IBAN_COUNTRIES.has(code)) {
    return {
      accountNumberKind: "iban",
      bankCodeKind: "swift",
      branchCodeKind: "hidden",
    };
  }
  return {
    accountNumberKind: "account",
    bankCodeKind: "swift",
    branchCodeKind: "branch",
  };
}

export function transferCurrencyForBankCountry(
  country: string,
  fallback: string,
): string {
  const code = normalizeBankCountry(country);
  if (code === "US") return "USD";
  if (code === "GB") return "GBP";
  if (code === "CH") return "CHF";
  if (code === "CA") return "CAD";
  if (code === "AU") return "AUD";
  if (code === "JP") return "JPY";
  if (UEMOA_COUNTRIES.has(code)) return "XOF";
  if (EUROZONE.has(code)) return "EUR";
  return fallback.trim().toUpperCase() || "USD";
}

function compactAlphanumeric(value: string): string {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

function isValidIban(value: string): boolean {
  if (!IBAN_PATTERN.test(value)) return false;
  const rearranged = value.slice(4) + value.slice(0, 4);
  let expanded = "";
  for (const char of rearranged) {
    const code = char.charCodeAt(0);
    expanded += code >= 65 ? String(code - 55) : char;
  }
  let remainder = 0;
  for (const digit of expanded) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
}

export const BANK_BENEFICIARY_ERROR_MESSAGES = {
  country_required: "Country is required",
  bank_name_required: "Bank name is required",
  account_holder_required: "Account holder name is required",
  invalid_iban: "Enter a valid IBAN",
  /** @deprecated Prefer uemoa_account_invalid; kept for existing locale keys. */
  ci_account_invalid: "UEMOA account numbers must be 24 characters",
  uemoa_account_invalid: "UEMOA account numbers must be 24 characters",
  invalid_account_number: "Enter a valid account number",
  swift_required: "SWIFT / BIC is required",
  us_routing_invalid: "US routing number must be 9 digits",
} as const;

export type BankBeneficiaryErrorCode =
  keyof typeof BANK_BENEFICIARY_ERROR_MESSAGES;

/** Returns an error code, or null when the bank details can be saved. */
export function validateBankBeneficiaryCode(
  input: BankBeneficiaryInput,
): BankBeneficiaryErrorCode | null {
  const country = normalizeBankCountry(input.country);
  if (!/^[A-Z]{2}$/.test(country)) {
    return "country_required";
  }
  if (!input.bankName.trim()) {
    return "bank_name_required";
  }
  if (!input.accountName.trim()) {
    return "account_holder_required";
  }

  const accountNumber = compactAlphanumeric(input.accountNumber);
  const swift = compactAlphanumeric(input.bankCode ?? "");
  const routing = compactAlphanumeric(input.branchCode ?? "");
  const layout = bankBeneficiaryFieldLayout(country);

  if (layout.accountNumberKind === "iban") {
    if (!isValidIban(accountNumber)) {
      return "invalid_iban";
    }
  } else if (layout.accountNumberKind === "uemoa_account") {
    if (!UEMOA_ACCOUNT_PATTERN.test(accountNumber)) {
      return "uemoa_account_invalid";
    }
  } else if (accountNumber.length < 4 || accountNumber.length > 34) {
    return "invalid_account_number";
  }

  if (layout.bankCodeKind === "swift") {
    if (!SWIFT_PATTERN.test(swift)) {
      return "swift_required";
    }
  }

  if (layout.branchCodeKind === "routing") {
    if (!US_ROUTING_PATTERN.test(routing)) {
      return "us_routing_invalid";
    }
  }

  return null;
}

/** Returns a merchant-facing error, or null when the bank details can be saved. */
export function validateBankBeneficiary(
  input: BankBeneficiaryInput,
): string | null {
  const code = validateBankBeneficiaryCode(input);
  return code ? BANK_BENEFICIARY_ERROR_MESSAGES[code] : null;
}

export function compactBankAccountNumber(value: string): string {
  return compactAlphanumeric(value);
}

export function compactSwiftCode(value: string): string {
  return compactAlphanumeric(value);
}
