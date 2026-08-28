const COUNTRY_NAME_NORMALIZATIONS = {
  "Ivory Coast": "Côte d'Ivoire",
  CI: "Côte d'Ivoire",
  "Cote d'Ivoire": "Côte d'Ivoire",
  "Cote dIvoire": "Côte d'Ivoire",
  "Côte dIvoire": "Côte d'Ivoire",
  "cote d'ivoire": "Côte d'Ivoire",
  "ivory coast": "Côte d'Ivoire",
  ci: "Côte d'Ivoire",
} as const;

const COUNTRY_CODE_TO_NAME = {
  CI: "Côte d'Ivoire",
  MR: "Mauritania",
  SN: "Senegal",
  NG: "Nigeria",
  FR: "France",
  GB: "United Kingdom",
  IT: "Italy",
  DE: "Germany",
  CH: "Switzerland",
  CA: "Canada",
  MX: "Mexico",
  US: "United States",
} as const;

function isNormalizationKey(
  key: string,
): key is keyof typeof COUNTRY_NAME_NORMALIZATIONS {
  return Object.prototype.hasOwnProperty.call(COUNTRY_NAME_NORMALIZATIONS, key);
}

function isCountryCodeKey(
  key: string,
): key is keyof typeof COUNTRY_CODE_TO_NAME {
  return Object.prototype.hasOwnProperty.call(COUNTRY_CODE_TO_NAME, key);
}

function lookupNormalization(key: string): string | undefined {
  if (isNormalizationKey(key)) return COUNTRY_NAME_NORMALIZATIONS[key];
  return undefined;
}

export function normalizeCountryName(
  countryName: string | undefined | null,
): string {
  if (!countryName) return "";

  const trimmed = countryName.trim();
  if (!trimmed) return "";

  const unicodeNormalized = trimmed
    .replace(/[\u0027\u2018\u2019]/g, "'")
    .replace(/[\u0022\u201C\u201D]/g, '"')
    .replace(/–/g, "-");

  if (lookupNormalization(unicodeNormalized)) {
    return lookupNormalization(unicodeNormalized) ?? unicodeNormalized;
  }

  const lowercased = unicodeNormalized.toLowerCase();
  if (lookupNormalization(lowercased)) {
    return lookupNormalization(lowercased) ?? unicodeNormalized;
  }

  return unicodeNormalized;
}

export function isCoteDIvoire(countryName: string | undefined | null): boolean {
  if (!countryName) return false;
  return normalizeCountryName(countryName) === "Côte d'Ivoire";
}

export function countryCodeToName(
  countryCode: string | undefined | null,
  locale: string = "en",
): string {
  if (!countryCode) return "";

  const upperCode = countryCode.toUpperCase();

  try {
    const regionNames = new Intl.DisplayNames([locale], { type: "region" });
    const name = regionNames.of(upperCode);
    if (name) return name;
  } catch {
    // Ignore invalid code errors, try English fallback
  }

  if (locale !== "en") {
    try {
      const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
      const name = regionNames.of(upperCode);
      if (name) return name;
    } catch {
      // Ignore errors
    }
  }

  return isCountryCodeKey(upperCode)
    ? COUNTRY_CODE_TO_NAME[upperCode]
    : upperCode;
}

export function getLocalizedCountryName(
  countryCode: string | undefined | null,
  language: string = "en",
): string {
  const localeMap = {
    en: "en",
    fr: "fr",
  } as const;

  function isLocaleKey(key: string): key is keyof typeof localeMap {
    return Object.prototype.hasOwnProperty.call(localeMap, key);
  }

  const locale = isLocaleKey(language) ? localeMap[language] : language;
  return countryCodeToName(countryCode, locale);
}

export function getCountryCodeByName(
  country: string | undefined | null,
): string | null {
  if (!country) return null;

  const trimmed = country.trim();
  if (!trimmed) return null;

  if (trimmed.length === 2) {
    return trimmed.toUpperCase();
  }

  const normalizedName = normalizeCountryName(trimmed);

  if (isCoteDIvoire(normalizedName)) {
    return "CI";
  }

  for (const [code, name] of Object.entries(COUNTRY_CODE_TO_NAME)) {
    if (
      name === normalizedName ||
      name.toLowerCase() === trimmed.toLowerCase()
    ) {
      return code;
    }
  }

  for (const [key, canonical] of Object.entries(COUNTRY_NAME_NORMALIZATIONS)) {
    if (
      /^[A-Za-z]{2}$/.test(key) &&
      (canonical === normalizedName ||
        key.toLowerCase() === trimmed.toLowerCase())
    ) {
      return key.toUpperCase();
    }
  }

  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    const lowerTrimmed = trimmed.toLowerCase();
    const lowerNormalized = normalizedName.toLowerCase();
    for (const code of ISO_3166_1_ALPHA2_CODES) {
      const displayName = regionNames.of(code);
      if (!displayName) continue;
      if (
        displayName === trimmed ||
        displayName === normalizedName ||
        displayName.toLowerCase() === lowerTrimmed ||
        displayName.toLowerCase() === lowerNormalized
      ) {
        return code;
      }
    }
  } catch {
    // Ignore Intl errors
  }

  return null;
}

export function resolveStripeCountry(
  country: string | undefined | null,
  fallback = "CI",
): string {
  return getCountryCodeByName(country) ?? fallback;
}

const ISO_3166_1_ALPHA2_CODES = [
  "AC",
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AR",
  "AS",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BQ",
  "BR",
  "BS",
  "BT",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CC",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CU",
  "CV",
  "CW",
  "CX",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FM",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IR",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KP",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MH",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MP",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NF",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PR",
  "PS",
  "PT",
  "PW",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SY",
  "SZ",
  "TA",
  "TC",
  "TD",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VI",
  "VN",
  "VU",
  "WF",
  "WS",
  "XK",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
] as const;


export type BillingCountryOption = {
  code: string;
  name: string;
};

let cachedBillingCountryOptions: BillingCountryOption[] | null = null;

/** All billing countries with English display names, sorted by name. */
export function getBillingCountryOptions(): BillingCountryOption[] {
  if (cachedBillingCountryOptions) {
    return cachedBillingCountryOptions;
  }

  cachedBillingCountryOptions = ISO_3166_1_ALPHA2_CODES.map((code) => ({
    code,
    name: normalizeCountryName(countryCodeToName(code, "en") || code),
  })).sort((a, b) => a.name.localeCompare(b.name));

  return cachedBillingCountryOptions;
}

/** Billing countries with the detected country first when present. */
export function getBillingCountriesWithDetectedFirst(
  detectedCountry?: string | null,
): BillingCountryOption[] {
  const allCountries = getBillingCountryOptions();
  if (!detectedCountry) {
    return allCountries;
  }

  const upper = detectedCountry.toUpperCase();
  const detectedCountryOption = allCountries.find(
    (country) => country.code === upper,
  );
  if (!detectedCountryOption) {
    return allCountries;
  }

  return [
    detectedCountryOption,
    ...allCountries.filter((country) => country.code !== upper),
  ];
}
