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

export type AssistedDialCountry = {
  id: string;
  /** Country calling code digits, without "+". */
  dial: string;
};

export type AssistedPhoneSelection<T extends AssistedDialCountry> = {
  country: T;
  /** National digits only. The country indicator stays outside this string. */
  national: string;
};

const NATIONAL_DIGITS_WITH_DIAL = 6;

function compactAssistedPhone(value: string): string {
  return value.replace(/[\s().-]/g, "");
}

function matchAssistedDial<T extends AssistedDialCountry>(
  digits: string,
  countries: readonly T[],
  prefer: T,
): { country: T; rest: string } | null {
  let best: { country: T; rest: string } | null = null;
  for (const country of countries) {
    if (!country.dial || !digits.startsWith(country.dial)) continue;
    const rest = digits.slice(country.dial.length);
    if (!best || country.dial.length > best.country.dial.length) {
      best = { country, rest };
      continue;
    }
    if (
      country.dial.length === best.country.dial.length &&
      country.id === prefer.id
    ) {
      best = { country, rest };
    }
  }
  return best;
}

/**
 * Apply an assisted fill, paste, or edit without dropping the country.
 * No calling code keeps the selected country. A calling code for that country
 * is stripped once. A calling code for another country switches the selection.
 * Short edits stay on the selected country so national digits can still be deleted.
 */
export function applyAssistedPhone<T extends AssistedDialCountry>(
  raw: string,
  selected: T,
  countries: readonly T[],
): AssistedPhoneSelection<T> {
  const compact = compactAssistedPhone(raw.trim());
  if (!compact || compact === "+" || compact === "00") {
    return { country: selected, national: "" };
  }

  const explicit = compact.startsWith("+")
    ? compact.slice(1)
    : compact.startsWith("00")
      ? compact.slice(2)
      : null;
  const digits = (explicit ?? compact).replace(/\D/g, "");
  const matched = matchAssistedDial(digits, countries, selected);
  if (!matched) {
    return { country: selected, national: digits };
  }

  const sameCountry = matched.country.id === selected.id;
  const fullEnough = matched.rest.length >= NATIONAL_DIGITS_WITH_DIAL;

  if (explicit !== null) {
    if (sameCountry || fullEnough) {
      return { country: matched.country, national: matched.rest };
    }
    return { country: selected, national: digits };
  }

  if (sameCountry && fullEnough) {
    return { country: selected, national: matched.rest };
  }

  // Local numbers often start with 0, and a 1-digit calling code (7, 1)
  // collides with those digits. Only a full prefill with a real calling code
  // may replace the selected country when "+" / "00" was omitted.
  if (
    fullEnough &&
    matched.country.dial.length >= 2 &&
    !digits.startsWith("0") &&
    matched.country.id !== selected.id
  ) {
    return { country: matched.country, national: matched.rest };
  }

  return { country: selected, national: digits };
}

export type AssistedFieldAction =
  { kind: "library"; value: string } | { kind: "replace"; value: string };

/**
 * Decide what an international phone field should do with the next keystroke
 * or assisted fill. National edits stay with the library so the calling code
 * can be locked. A full number for another country is returned as E.164 so
 * the field can switch country without the library erasing the indicator.
 */
export function classifyAssistedPhoneField<T extends AssistedDialCountry>(
  raw: string,
  selected: T,
  countries: readonly T[],
): AssistedFieldAction {
  const compact = compactAssistedPhone(raw);
  const prefix = `+${selected.dial}`;
  if (
    compact.startsWith(prefix) ||
    compact === "" ||
    compact === "+" ||
    compact === "00"
  ) {
    return { kind: "library", value: raw };
  }

  if (!compact.startsWith("+") && !compact.startsWith("00")) {
    const digits = compact.replace(/\D/g, "");
    if (
      digits.startsWith(selected.dial) &&
      digits.length >= selected.dial.length + NATIONAL_DIGITS_WITH_DIAL
    ) {
      return { kind: "library", value: digits.slice(selected.dial.length) };
    }
  }

  const applied = applyAssistedPhone(raw, selected, countries);
  if (
    applied.country.id !== selected.id &&
    applied.national.length >= NATIONAL_DIGITS_WITH_DIAL
  ) {
    return {
      kind: "replace",
      value: `+${applied.country.dial}${applied.national}`,
    };
  }

  return { kind: "library", value: raw };
}
