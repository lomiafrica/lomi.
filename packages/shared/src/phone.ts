import parsePhoneNumberFromString, {
  isSupportedCountry,
  type CountryCode,
} from "libphonenumber-js";
import { getCountryCodeByName } from "./country.js";

export type { CountryCode };

/** Parse a country name/code into a libphonenumber CountryCode, defaulting to CI. */
export function toCountryCode(
  countryHint?: string | null,
  fallback: CountryCode = "CI",
): CountryCode {
  const code = getCountryCodeByName(countryHint);
  if (code !== null && isSupportedCountry(code)) {
    return code;
  }
  return fallback;
}

export function isValidPhoneNumber(
  phoneNumber: string | null | undefined,
  defaultCountry?: CountryCode,
): boolean {
  if (!phoneNumber) return false;

  try {
    const parsedNumber = parsePhoneNumberFromString(
      phoneNumber,
      defaultCountry ?? "CI",
    );

    return parsedNumber?.isValid() ?? false;
  } catch (error) {
    console.error("Error validating phone number:", error);
    return false;
  }
}

export function formatPhoneNumber(
  phoneNumber: string | null | undefined,
  defaultCountry?: CountryCode,
): string {
  if (!phoneNumber) return "—";

  try {
    const parsedNumber = parsePhoneNumberFromString(
      phoneNumber,
      defaultCountry ?? "CI",
    );

    if (parsedNumber?.isValid()) {
      if (parsedNumber.country === "CI") {
        const nationalNumber = parsedNumber.nationalNumber;

        if (nationalNumber.length === 10) {
          return `+${parsedNumber.countryCallingCode} ${nationalNumber.substring(0, 2)} ${nationalNumber.substring(2, 4)} ${nationalNumber.substring(4, 7)} ${nationalNumber.substring(7)}`;
        }
        if (nationalNumber.length === 9) {
          return `+${parsedNumber.countryCallingCode} ${nationalNumber.substring(0, 1)} ${nationalNumber.substring(1, 3)} ${nationalNumber.substring(3, 6)} ${nationalNumber.substring(6)}`;
        }
        if (nationalNumber.length === 8) {
          return `+${parsedNumber.countryCallingCode} ${nationalNumber.substring(0, 2)} ${nationalNumber.substring(2, 5)} ${nationalNumber.substring(5)}`;
        }
        return parsedNumber.formatInternational();
      }

      return parsedNumber.formatInternational();
    }

    const cleanedNumber = phoneNumber.replace(/[\s\-().]/g, "");

    if (cleanedNumber.match(/^(\+225|00225)?[0-9]{8,10}$/)) {
      const digits = cleanedNumber.replace(/^(\+225|00225)/, "");

      if (digits.length >= 8 && digits.length <= 10) {
        if (digits.length === 10) {
          return `+225 ${digits.substring(0, 2)} ${digits.substring(2, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
        }
        if (digits.length === 9) {
          return `+225 ${digits.substring(0, 1)} ${digits.substring(1, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
        }
        if (digits.length === 8) {
          return `+225 ${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`;
        }
      }
    }

    return phoneNumber;
  } catch (error) {
    console.error("Error formatting phone number:", error);
    return phoneNumber;
  }
}

/** Legacy bug stored phones as `Côte d'Ivoire+225…` — strip before Stripe/API use. */
const LEGACY_COUNTRY_NAME_PHONE_PREFIX =
  /^(?:C[oô]te d[\u0027\u2019]Ivoire|Ivory Coast)\+?/i;

export function stripLegacyCountryPhonePrefix(phone: string): string {
  if (!LEGACY_COUNTRY_NAME_PHONE_PREFIX.test(phone)) {
    return phone;
  }
  const stripped = phone.replace(LEGACY_COUNTRY_NAME_PHONE_PREFIX, "");
  return stripped.startsWith("+") ? stripped : `+${stripped}`;
}

/**
 * Normalize a phone number to Stripe-compatible E.164 (max 20 chars).
 * Never concatenates country names with the national number.
 */
export function normalizePhoneForStripe(
  phone: string | null | undefined,
  countryHint?: string | null,
): string | undefined {
  if (!phone?.trim()) return undefined;

  const cleaned = stripLegacyCountryPhonePrefix(phone.trim());
  const isoHint = toCountryCode(countryHint);

  try {
    const parsed = parsePhoneNumberFromString(
      cleaned,
      cleaned.startsWith("+") ? undefined : isoHint,
    );
    if (parsed?.isValid()) {
      const e164 = parsed.format("E.164");
      if (e164.length <= 20) {
        return e164;
      }
    }
  } catch {
    // fall through to compact check
  }

  const compact = cleaned.replace(/[\s\-().]/g, "");
  if (
    compact.startsWith("+") &&
    compact.length >= 8 &&
    compact.length <= 20 &&
    /^\+[1-9]\d+$/.test(compact)
  ) {
    return compact;
  }

  return undefined;
}
