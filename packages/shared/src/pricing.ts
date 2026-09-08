export type PricingTier = 'starter' | 'growth' | 'professional' | 'enterprise';

export type FeeParts = {
  percent: number;
  fixed: number;
  currency: 'XOF' | 'USD' | 'EUR';
};

export type VolumeTierBounds = { min: number; max: number | null };

export const VOLUME_TIER_XOF = {
  starter: { min: 0, max: 2_148_659 },
  growth: { min: 2_148_660, max: 4_297_319 },
  professional: { min: 4_297_320, max: 8_594_660 },
  enterprise: { min: 8_594_661, max: null },
} as const satisfies Record<PricingTier, VolumeTierBounds>;

export const DYNAMIC_FEES_XOF = {
  mobileMoney: {
    starter: { percent: 3.2, fixed: 200, currency: 'XOF' },
    growth: { percent: 2.5, fixed: 150, currency: 'XOF' },
    professional: { percent: 2, fixed: 150, currency: 'XOF' },
    enterprise: { percent: 1.5, fixed: 100, currency: 'XOF' },
  },
  cards: {
    starter: { percent: 5, fixed: 250, currency: 'XOF' },
    growth: { percent: 4.5, fixed: 250, currency: 'XOF' },
    professional: { percent: 4, fixed: 250, currency: 'XOF' },
    enterprise: { percent: 3.5, fixed: 250, currency: 'XOF' },
  },
  tapToPay: {
    starter: { percent: 5, fixed: 200, currency: 'XOF' },
    growth: { percent: 4.5, fixed: 200, currency: 'XOF' },
    professional: { percent: 4, fixed: 100, currency: 'XOF' },
    enterprise: { percent: 3.5, fixed: 0, currency: 'XOF' },
  },
  posMobileMoney: {
    starter: { percent: 2, fixed: 0, currency: 'XOF' },
    growth: { percent: 1.5, fixed: 0, currency: 'XOF' },
    professional: { percent: 1, fixed: 0, currency: 'XOF' },
    enterprise: { percent: 0, fixed: 0, currency: 'XOF' },
  },
  beneficiaryPayoutMm: {
    starter: { percent: 2, fixed: 0, currency: 'XOF' },
    growth: { percent: 1.8, fixed: 0, currency: 'XOF' },
    professional: { percent: 1.5, fixed: 0, currency: 'XOF' },
    enterprise: { percent: 1.2, fixed: 0, currency: 'XOF' },
  },
} as const satisfies Record<string, Record<PricingTier, FeeParts>>;

export const FIXED_FEES_XOF = {
  mobileMoney: { percent: 2.9, fixed: 200, currency: 'XOF' },
  cards: { percent: 4.5, fixed: 250, currency: 'XOF' },
  tapToPay: { percent: 4.5, fixed: 250, currency: 'XOF' },
  posMobileMoney: { percent: 1.5, fixed: 0, currency: 'XOF' },
  localBankPayout: { percent: 0, fixed: 1500, currency: 'XOF' },
  internationalBankPayout: { percent: 1, fixed: 3500, currency: 'XOF' },
  beneficiaryBankPayout: { percent: 2, fixed: 0, currency: 'XOF' },
  beneficiaryMmPayout: { percent: 2, fixed: 0, currency: 'XOF' },
  refund: { percent: 2, fixed: 0, currency: 'XOF' },
  chargeback: { percent: 0, fixed: 10_000, currency: 'XOF' },
  currencyConversion: { percent: 3, fixed: 0, currency: 'XOF' },
} as const satisfies Record<string, FeeParts>;

export const FIXED_FEES_CARD_INTL: FeeParts = {
  percent: 4.5,
  fixed: 0.4,
  currency: 'USD',
};

export const ADD_ON_INTERNATIONAL_CARDS_PERCENT = 2;
export const ADD_ON_SUBSCRIPTION_PERCENT = 0.5;
export const CHARGEBACK_INTL_FIXED = 15;

export function formatFee(parts: FeeParts, locale: 'en' | 'fr' = 'en'): string {
  const percent = `${parts.percent}%`;
  if (parts.currency === 'XOF') {
    const unit = locale === 'fr' ? 'F CFA' : 'F CFA';
    return `${percent} + ${parts.fixed.toLocaleString('fr-FR')} ${unit}`;
  }
  const symbol = parts.currency === 'EUR' ? '€' : '$';
  return `${percent} + ${parts.fixed} ${symbol}`;
}

export function calculateFee(amount: number, parts: FeeParts): number {
  const raw = (parts.percent / 100) * amount + parts.fixed;
  if (parts.currency === 'XOF') return Math.round(raw);
  return Math.round(raw * 100) / 100;
}
