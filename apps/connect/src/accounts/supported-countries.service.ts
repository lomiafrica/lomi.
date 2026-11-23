import { Injectable } from "@nestjs/common";

/**
 * Countries where the platform can open connected accounts for merchants.
 * Mirrors apps/web stripe-connect-countries (rill). CI, BJ, RW and the rest
 * of UEMOA stay on the aggregate rail — this list is the eligibility gate.
 * SN is present: verify against current provider docs before enabling there.
 */
const SUPPORTED_ACCOUNT_COUNTRIES = new Set([
  "AT",
  "AU",
  "BE",
  "BG",
  "BR",
  "CA",
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
  "GR",
  "HK",
  "HR",
  "HU",
  "IE",
  "IT",
  "JP",
  "LT",
  "LU",
  "LV",
  "MT",
  "MX",
  "NL",
  "NO",
  "NZ",
  "PL",
  "PT",
  "RO",
  "SE",
  "SG",
  "SI",
  "SK",
  "SN",
  "TH",
  "US",
]);

/** Free-text KYB countries that must read as ISO codes. */
const COUNTRY_ALIASES = {
  FRANCE: "FR",
  "UNITED KINGDOM": "GB",
  "GREAT BRITAIN": "GB",
  "UNITED STATES": "US",
  "UNITED STATES OF AMERICA": "US",
  USA: "US",
  GERMANY: "DE",
  SPAIN: "ES",
  ITALY: "IT",
  BELGIUM: "BE",
  NETHERLANDS: "NL",
  SWITZERLAND: "CH",
  SENEGAL: "SN",
  "SOUTH AFRICA": "ZA",
} satisfies Record<string, string>;

@Injectable()
export class SupportedCountriesService {
  /** ISO 3166-1 alpha-2 when the KYB country is Connect-eligible, else null. */
  eligibleCountry(legalCountry: string | null | undefined): string | null {
    if (!legalCountry) {
      return null;
    }
    const raw = legalCountry.trim();
    const upper = raw.toUpperCase();
    const iso = raw.length === 2 ? upper : (COUNTRY_ALIASES[upper] ?? null);
    if (!iso) {
      return null;
    }
    return SUPPORTED_ACCOUNT_COUNTRIES.has(iso) ? iso : null;
  }
}
