import { DGIPAY_PAYMENT_MODES, type DgiPayPaymentMode } from "./types.js";

/** Org fiscal regime and certification routing. One DGI rail per sale. */

export const FISCAL_REGIMES = ["off", "fne", "rne"] as const;
export type FiscalRegime = (typeof FISCAL_REGIMES)[number];

export const FISCAL_JOB_KINDS = ["sign", "sticker", "refund"] as const;
export type FiscalJobKind = (typeof FISCAL_JOB_KINDS)[number];

export const FISCAL_HOLD_CHANNELS = ["terminal", "card_present"] as const;

const FISCAL_HOLD_CHANNEL_SET: ReadonlySet<string> = new Set(
  FISCAL_HOLD_CHANNELS,
);

const CI_COUNTRY_HINTS = [
  "ci",
  "civ",
  "cote divoire",
  "cote d'ivoire",
  "côte d'ivoire",
  "ivory coast",
];

export function parseFiscalRegime(
  value: string | null | undefined,
): FiscalRegime {
  const normalized = value?.trim().toLowerCase() ?? "";
  if (normalized === "fne" || normalized === "rne") return normalized;
  return "off";
}

export function isFiscalHoldChannel(
  channel: string | null | undefined,
): boolean {
  const normalized = channel?.trim().toLowerCase() ?? "";
  return FISCAL_HOLD_CHANNEL_SET.has(normalized);
}

export function isFiscalCoteDIvoireCountry(
  country: string | null | undefined,
): boolean {
  if (!country) return false;
  const normalized = country
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "'");
  const compact = normalized.replace(/\s+/g, " ");
  return CI_COUNTRY_HINTS.some(
    (hint) => compact === hint || compact.startsWith(`${hint} `),
  );
}

export type FiscalCertificationPlan =
  | { action: "skip"; reason: string }
  | { action: "sign" }
  | { action: "sticker" }
  | { action: "refund" };

/** Decide which DGI call a completed sale or refund should make. */
export function planFiscalCertification(args: {
  regime: FiscalRegime;
  jobKind: FiscalJobKind;
  isPos: boolean;
  channel: string | null | undefined;
  currency: string | null | undefined;
  country: string | null | undefined;
  fneEnabled: boolean;
  dgiPayEnabled: boolean;
  alreadyCertified: boolean;
}): FiscalCertificationPlan {
  if (args.alreadyCertified && args.jobKind !== "refund") {
    return { action: "skip", reason: "already_certified" };
  }
  if (args.regime === "off") {
    return { action: "skip", reason: "regime_off" };
  }
  if (!isFiscalCoteDIvoireCountry(args.country)) {
    return { action: "skip", reason: "not_ci" };
  }
  if ((args.currency ?? "").trim().toUpperCase() !== "XOF") {
    return { action: "skip", reason: "not_xof" };
  }
  if (isFiscalHoldChannel(args.channel)) {
    return { action: "skip", reason: "tap_to_pay_hold" };
  }

  if (args.regime === "fne") {
    if (!args.fneEnabled) {
      return { action: "skip", reason: "flag_off" };
    }
    if (args.jobKind === "refund") return { action: "refund" };
    return { action: "sign" };
  }

  if (!args.isPos) {
    return { action: "skip", reason: "rne_online" };
  }
  if (!args.dgiPayEnabled) {
    return { action: "skip", reason: "flag_off" };
  }
  if (args.jobKind === "refund") {
    return { action: "skip", reason: "rne_refund_unsupported" };
  }
  return { action: "sticker" };
}

const DGIPAY_MODE_ALIASES = {
  cash: "ESPECE",
  espece: "ESPECE",
  card: "CARTE",
  cards: "CARTE",
  stripe: "CARTE",
  "mobile-money": "MOBILE",
  mobile_money: "MOBILE",
  wave: "MOBILE",
  mtn: "MOBILE",
  transfer: "VIREMENT",
  spi: "VIREMENT",
  bank_transfer: "VIREMENT",
} as const;

type DgiPayModeAlias = keyof typeof DGIPAY_MODE_ALIASES;

const DGIPAY_PAYMENT_MODE_SET: ReadonlySet<string> = new Set(
  DGIPAY_PAYMENT_MODES,
);

function isDgiPayPaymentMode(value: string): value is DgiPayPaymentMode {
  return DGIPAY_PAYMENT_MODE_SET.has(value);
}

function isDgiPayModeAlias(value: string): value is DgiPayModeAlias {
  return Object.hasOwn(DGIPAY_MODE_ALIASES, value);
}

/** Map a lomi. rail onto a DGIPay PaymentMode. */
export function mapLomiPaymentMethodToDgiPay(
  method: string | null | undefined,
): string | null {
  if (!method) return null;
  if (isDgiPayPaymentMode(method)) return method;
  const normalized = method.trim().toLowerCase();
  if (isDgiPayModeAlias(normalized)) return DGIPAY_MODE_ALIASES[normalized];
  return null;
}
