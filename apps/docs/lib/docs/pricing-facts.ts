/* @proprietary license */

import {
  ADD_ON_SUBSCRIPTION_PERCENT,
  calculateFee,
  DYNAMIC_FEES_XOF,
  FIXED_FEES_CARD_INTL,
  FIXED_FEES_XOF,
  formatFee,
  VOLUME_TIER_XOF,
  type PricingTier,
} from '@lomi./shared';

export const PRICING_TIER_ORDER: readonly PricingTier[] = [
  'starter',
  'growth',
  'professional',
  'enterprise',
];

export function feeLabel(
  parts: { percent: number; fixed: number; currency: 'XOF' | 'USD' | 'EUR' },
  locale: 'en' | 'fr' = 'en',
): string {
  return formatFee(parts, locale);
}

export function volumeLabel(tier: PricingTier, locale: 'en' | 'fr'): string {
  const range = VOLUME_TIER_XOF[tier];
  const fmt = (n: number) =>
    n.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US');
  if (range.max === null) {
    return locale === 'fr'
      ? `${fmt(range.min)} et plus`
      : `${fmt(range.min)} and above`;
  }
  return `${fmt(range.min)} – ${fmt(range.max)}`;
}

export type ExampleFee = {
  amount: number;
  fee: number;
  net: number;
  feeLabel: string;
};

export function exampleFixedMmFee(amount = 30_000): ExampleFee {
  const fee = calculateFee(amount, FIXED_FEES_XOF.mobileMoney);
  return {
    amount,
    fee,
    net: amount - fee,
    feeLabel: formatFee(FIXED_FEES_XOF.mobileMoney),
  };
}

export function exampleGrowthMmFee(amount = 20_000): ExampleFee {
  const fee = calculateFee(amount, DYNAMIC_FEES_XOF.mobileMoney.growth);
  return {
    amount,
    fee,
    net: amount - fee,
    feeLabel: formatFee(DYNAMIC_FEES_XOF.mobileMoney.growth),
  };
}

export const PUBLISHED_FEE_FACTS = [
  `Fixed Mobile Money: ${formatFee(FIXED_FEES_XOF.mobileMoney)}`,
  `Fixed cards (XOF): ${formatFee(FIXED_FEES_XOF.cards)}`,
  `Fixed cards (USD/EUR): ${formatFee(FIXED_FEES_CARD_INTL)}`,
  `Subscription add-on: +${ADD_ON_SUBSCRIPTION_PERCENT}%`,
] as const;
