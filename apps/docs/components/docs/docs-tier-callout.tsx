/* @proprietary license */

'use client';

import { DYNAMIC_FEES_XOF, FIXED_FEES_XOF, formatFee } from '@lomi./shared';
import { useDocsWorkspace } from '@/lib/docs/workspace-context';
import { useTranslation } from '@/lib/utils/translation-context';
import { t as translate } from '@/lib/i18n/translations';

/** Plan-aware published rates for signed-in docs readers. Does not alter MDX export. */
export function DocsTierCallout() {
  const { currentLanguage } = useTranslation();
  const t = (key: string) => translate(key, currentLanguage);
  const { ready, signedIn, pricingPlan, volumeTier } = useDocsWorkspace();

  if (!ready || !signedIn) return null;

  const locale = currentLanguage === 'fr' ? 'fr' : 'en';
  const mm =
    pricingPlan === 'dynamic' && volumeTier
      ? formatFee(DYNAMIC_FEES_XOF.mobileMoney[volumeTier], locale)
      : formatFee(FIXED_FEES_XOF.mobileMoney, locale);
  const cards =
    pricingPlan === 'dynamic' && volumeTier
      ? formatFee(DYNAMIC_FEES_XOF.cards[volumeTier], locale)
      : formatFee(FIXED_FEES_XOF.cards, locale);

  const planKey =
    pricingPlan === 'custom'
      ? 'tier.custom'
      : pricingPlan === 'dynamic' && volumeTier
        ? `tier.${volumeTier}`
        : pricingPlan === 'fixed'
          ? 'tier.fixed'
          : 'tier.unknown';

  return (
    <aside className="docs-well not-prose my-6 rounded-[var(--docs-callout-radius)] px-4 py-3 text-[13px] leading-relaxed">
      <p className="font-medium">{t('tier.signedIn')}</p>
      <p className="mt-1 text-fd-muted-foreground">{t(planKey)}</p>
      {pricingPlan === 'custom' ? null : (
        <p className="mt-1 text-fd-muted-foreground">
          {t('tier.mobileMoney')}: {mm}. {t('tier.cards')}: {cards}.
        </p>
      )}
      <p className="mt-1 text-fd-muted-foreground">{t('tier.dashboard')}</p>
    </aside>
  );
}
