/** Org fiscal regime and certification routing. One DGI rail per sale. */

export const FISCAL_REGIMES = ["off", "fne", "rne"] as const;
export type FiscalRegime = (typeof FISCAL_REGIMES)[number];

export const FISCAL_JOB_KINDS = ["sign", "sticker", "refund"] as const;
export type FiscalJobKind = (typeof FISCAL_JOB_KINDS)[number];

export const FISCAL_HOLD_CHANNELS = ["terminal", "card_present"] as const;

const CI_COUNTRY_HINTS = [
  "ci",
  "civ",
  "cote divoire",
  "cote d'ivoire",
  "côte d'ivoire",
  "ivory coast",
];

export function parseFiscalRegime(value: string | null | undefined): FiscalRegime {
  const normalized = value?.trim().toLowerCase() ?? "";
  if (normalized === "fne" || normalized === "rne") return normalized;
  return "off";
}

export function isFiscalHoldChannel(channel: string | null | undefined): boolean {
  const normalized = channel?.trim().toLowerCase() ?? "";
  return (FISCAL_HOLD_CHANNELS as readonly string[]).includes(normalized);
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

const DGIPAY_MODE_ALIASES: Record<string, string> = {
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
};

/** Map a lomi. rail onto a DGIPay PaymentMode. */
export function mapLomiPaymentMethodToDgiPay(
  method: string | null | undefined,
): string | null {
  if (!method) return null;
  const normalized = method.trim().toLowerCase();
  if (["ESPECE", "CARTE", "MOBILE", "CHEQUE", "VIREMENT"].includes(method)) {
    return method;
  }
  return DGIPAY_MODE_ALIASES[normalized] ?? null;
}
