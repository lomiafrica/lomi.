import {
  countryCodeToName,
  getCountryCodeByName,
  normalizeCountryName,
} from "./country.js";
import { readString, type JsonObject } from "./json-value.js";

export type OfficialAddressInput = {
  street?: string | null;
  district?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

export type MerchantCompanyInput = OfficialAddressInput & {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

const ANGLOPHONE_POSTAL_COUNTRY_CODES = new Set([
  "AU",
  "CA",
  "GB",
  "IE",
  "NZ",
  "US",
]);

function trimPart(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function sameAddressPart(left: string, right: string): boolean {
  return left.localeCompare(right, undefined, { sensitivity: "accent" }) === 0;
}

function pushUniqueLine(lines: string[], line: string): void {
  const trimmed = line.trim();
  if (!trimmed) return;
  const last = lines[lines.length - 1];
  if (last && sameAddressPart(last, trimmed)) return;
  lines.push(trimmed);
}

export function formatOfficialCountryName(
  country: string | null | undefined,
  locale = "en",
): string {
  const trimmed = trimPart(country);
  if (!trimmed) return "";

  const code = getCountryCodeByName(trimmed);
  if (code) {
    const localized = countryCodeToName(code, locale).trim();
    if (localized) return localized;
  }

  return normalizeCountryName(trimmed);
}

function usesAnglophonePostalOrder(country: string | null | undefined): boolean {
  const code = getCountryCodeByName(country);
  return code !== null && ANGLOPHONE_POSTAL_COUNTRY_CODES.has(code);
}

function francophoneLocalityLine(city: string, postalCode: string): string {
  if (postalCode && city) return `${postalCode} ${city}`;
  return postalCode || city;
}

function anglophoneLocalityLine(
  city: string,
  region: string,
  postalCode: string,
): string {
  const locality = [city, region].filter((part) => part.length > 0).join(", ");
  return [locality, postalCode].filter((part) => part.length > 0).join(" ");
}

export function formatOfficialAddressLines(
  address: OfficialAddressInput,
  locale = "en",
): string[] {
  const street = trimPart(address.street);
  const district = trimPart(address.district);
  const city = trimPart(address.city);
  const region = trimPart(address.region);
  const postalCode = trimPart(address.postalCode);
  const country = formatOfficialCountryName(address.country, locale);

  const lines: string[] = [];
  pushUniqueLine(lines, street);
  if (district && !sameAddressPart(district, street)) {
    pushUniqueLine(lines, district);
  }

  if (usesAnglophonePostalOrder(address.country)) {
    pushUniqueLine(lines, anglophoneLocalityLine(city, region, postalCode));
  } else {
    pushUniqueLine(lines, francophoneLocalityLine(city, postalCode));
    if (
      region &&
      !sameAddressPart(region, city) &&
      !sameAddressPart(region, district)
    ) {
      pushUniqueLine(lines, region);
    }
  }

  if (
    country &&
    !sameAddressPart(country, city) &&
    !sameAddressPart(country, region)
  ) {
    pushUniqueLine(lines, country);
  }

  return lines;
}

export function formatMerchantCompanyLines(
  company: MerchantCompanyInput,
  locale = "en",
): string[] {
  const lines: string[] = [];
  pushUniqueLine(lines, trimPart(company.name));
  for (const line of formatOfficialAddressLines(company, locale)) {
    pushUniqueLine(lines, line);
  }
  pushUniqueLine(lines, trimPart(company.email));
  pushUniqueLine(lines, trimPart(company.phone));
  return lines;
}

export type InvoicePartyAddress = {
  name?: string;
  email?: string;
  phone?: string;
  formattedLines: string[];
};

export function invoicePartyAddress(
  details: JsonObject | undefined,
  locale = "en",
): InvoicePartyAddress {
  if (!details) {
    return { formattedLines: [] };
  }

  const content = readString(details, "content") ?? "";
  const contentLines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const name = readString(details, "name") ?? contentLines[0];
  const email = readString(details, "email");
  const phone =
    readString(details, "phone_number") ?? readString(details, "phone");
  const address = readString(details, "address");
  const structuredLines = formatOfficialAddressLines(
    {
      street: address && !address.includes("\n") ? address : undefined,
      city: readString(details, "city"),
      postalCode:
        readString(details, "postal_code") ?? readString(details, "postalCode"),
      country: readString(details, "country"),
    },
    locale,
  );

  const formattedLines =
    address && address.includes("\n")
      ? address
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      : structuredLines.length > 0
        ? structuredLines
        : contentLines.slice(name && contentLines[0] === name ? 1 : 0);

  return {
    name,
    email,
    phone,
    formattedLines: formattedLines.filter(
      (line) => line !== name && line !== email && line !== phone,
    ),
  };
}
