/* @proprietary license */

import {
  ADD_ON_INTERNATIONAL_CARDS_PERCENT,
  ADD_ON_SUBSCRIPTION_PERCENT,
  CHARGEBACK_INTL_FIXED,
  DYNAMIC_FEES_XOF,
  FIXED_FEES_CARD_INTL,
  FIXED_FEES_XOF,
  formatFee,
  type PricingTier,
} from '@lomi./shared';
import {
  exampleFixedMmFee,
  exampleGrowthMmFee,
  feeLabel,
  PRICING_TIER_ORDER,
  volumeLabel,
} from '@/lib/docs/pricing-facts';
import { getDocsLocale } from '@/lib/utils/docs-locale';

type PricingTableKind =
  | 'volume-tiers'
  | 'dynamic'
  | 'fixed-xof'
  | 'fixed-intl'
  | 'examples'
  | 'refunds'
  | 'payouts';

const TIER_LABEL = {
  starter: 'Starter',
  growth: 'Growth',
  professional: 'Professional',
  enterprise: 'Enterprise',
} as const satisfies { [K in PricingTier]: string };

export async function PricingTable({ kind }: { kind: PricingTableKind }) {
  const locale = await getDocsLocale();
  const xof = (parts: {
    percent: number;
    fixed: number;
    currency: 'XOF' | 'USD' | 'EUR';
  }) => feeLabel(parts, locale);

  switch (kind) {
    case 'volume-tiers':
      return (
        <table>
          <thead>
            <tr>
              <th>{locale === 'fr' ? 'Palier' : 'Tier'}</th>
              <th>
                {locale === 'fr'
                  ? 'Volume mensuel (F CFA)'
                  : 'Monthly volume (F CFA)'}
              </th>
            </tr>
          </thead>
          <tbody>
            {PRICING_TIER_ORDER.map((tier) => (
              <tr key={tier}>
                <td>
                  <strong>{TIER_LABEL[tier]}</strong>
                </td>
                <td>{volumeLabel(tier, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'dynamic':
      return (
        <table>
          <thead>
            <tr>
              <th> </th>
              {PRICING_TIER_ORDER.map((tier) => (
                <th key={tier}>{TIER_LABEL[tier]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              [
                ['Mobile Money', DYNAMIC_FEES_XOF.mobileMoney],
                [locale === 'fr' ? 'Cartes' : 'Cards', DYNAMIC_FEES_XOF.cards],
                ['Tap to Pay', DYNAMIC_FEES_XOF.tapToPay],
                ['POS (Mobile Money)', DYNAMIC_FEES_XOF.posMobileMoney],
                [
                  locale === 'fr'
                    ? 'Payout bénéficiaire (MM)'
                    : 'Beneficiary payout (MM)',
                  DYNAMIC_FEES_XOF.beneficiaryPayoutMm,
                ],
              ] as const
            ).map(([label, row]) => (
              <tr key={label}>
                <td>
                  <strong>{label}</strong>
                </td>
                {PRICING_TIER_ORDER.map((tier) => (
                  <td key={tier}>{xof(row[tier])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'fixed-xof':
      return (
        <table>
          <thead>
            <tr>
              <th>{locale === 'fr' ? 'Catégorie' : 'Category'}</th>
              <th>{locale === 'fr' ? 'Frais' : 'Fee'}</th>
            </tr>
          </thead>
          <tbody>
            {(
              [
                ['Mobile Money', FIXED_FEES_XOF.mobileMoney],
                [
                  locale === 'fr' ? 'Cartes' : 'Credit cards',
                  FIXED_FEES_XOF.cards,
                ],
                ['Tap to Pay', FIXED_FEES_XOF.tapToPay],
                ['POS (Mobile Money)', FIXED_FEES_XOF.posMobileMoney],
                [
                  locale === 'fr'
                    ? 'Payout banque locale (UEMOA)'
                    : 'Local bank payout (UEMOA)',
                  FIXED_FEES_XOF.localBankPayout,
                ],
                [
                  locale === 'fr'
                    ? 'Payout banque internationale'
                    : 'International bank payout',
                  FIXED_FEES_XOF.internationalBankPayout,
                ],
                [
                  locale === 'fr'
                    ? 'Payout banque bénéficiaire'
                    : 'Beneficiary bank payout',
                  FIXED_FEES_XOF.beneficiaryBankPayout,
                ],
                [
                  locale === 'fr'
                    ? 'Payout Mobile Money bénéficiaire'
                    : 'Beneficiary Mobile Money payout',
                  FIXED_FEES_XOF.beneficiaryMmPayout,
                ],
                [
                  locale === 'fr'
                    ? 'Remboursement partiel (total gratuit)'
                    : 'Partial refund (full refunds are free)',
                  FIXED_FEES_XOF.refund,
                ],
                ['Chargeback', FIXED_FEES_XOF.chargeback],
              ] as const
            ).map(([label, parts]) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{xof(parts)}</td>
              </tr>
            ))}
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Cartes internationales (extra)'
                  : 'International cards (add-on)'}
              </td>
              <td>+{ADD_ON_INTERNATIONAL_CARDS_PERCENT}%</td>
            </tr>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Paiements d’abonnement (extra)'
                  : 'Subscription payments (add-on)'}
              </td>
              <td>+{ADD_ON_SUBSCRIPTION_PERCENT}%</td>
            </tr>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Conversion de devise'
                  : 'Currency conversion'}
              </td>
              <td>{xof(FIXED_FEES_XOF.currencyConversion)}</td>
            </tr>
          </tbody>
        </table>
      );
    case 'fixed-intl':
      return (
        <table>
          <thead>
            <tr>
              <th>{locale === 'fr' ? 'Catégorie' : 'Category'}</th>
              <th>{locale === 'fr' ? 'Frais' : 'Fee'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{locale === 'fr' ? 'Cartes' : 'Credit cards'}</td>
              <td>{formatFee(FIXED_FEES_CARD_INTL)} / €</td>
            </tr>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Payout banque internationale'
                  : 'International bank payout'}
              </td>
              <td>1% + 5 $ {locale === 'fr' ? 'ou' : 'or'} €</td>
            </tr>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Remboursement partiel (total gratuit)'
                  : 'Partial refund (full refunds are free)'}
              </td>
              <td>2% + 0</td>
            </tr>
            <tr>
              <td>Chargeback</td>
              <td>
                0% + {CHARGEBACK_INTL_FIXED} $ {locale === 'fr' ? 'ou' : 'or'} €
              </td>
            </tr>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Cartes internationales (extra)'
                  : 'International cards (add-on)'}
              </td>
              <td>+{ADD_ON_INTERNATIONAL_CARDS_PERCENT}%</td>
            </tr>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Paiements d’abonnement (extra)'
                  : 'Subscription payments (add-on)'}
              </td>
              <td>+{ADD_ON_SUBSCRIPTION_PERCENT}%</td>
            </tr>
          </tbody>
        </table>
      );
    case 'examples': {
      const fixed = exampleFixedMmFee();
      const growth = exampleGrowthMmFee();
      const fmt = (n: number) =>
        `${n.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} F CFA`;
      return (
        <>
          <table>
            <thead>
              <tr>
                <th>{locale === 'fr' ? 'Exemple fixe' : 'Fixed example'}</th>
                <th>{locale === 'fr' ? 'Montant' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{locale === 'fr' ? 'Prix' : 'Price'}</td>
                <td>{fmt(fixed.amount)}</td>
              </tr>
              <tr>
                <td>
                  {locale === 'fr' ? 'Frais' : 'Fee'} ({fixed.feeLabel})
                </td>
                <td>{fmt(fixed.fee)}</td>
              </tr>
              <tr>
                <td>{locale === 'fr' ? 'Net reçu' : 'Net received'}</td>
                <td>{fmt(fixed.net)}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>{locale === 'fr' ? 'Exemple Growth' : 'Growth example'}</th>
                <th>{locale === 'fr' ? 'Montant' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{locale === 'fr' ? 'Prix' : 'Price'}</td>
                <td>{fmt(growth.amount)}</td>
              </tr>
              <tr>
                <td>
                  {locale === 'fr' ? 'Frais' : 'Fee'} ({growth.feeLabel})
                </td>
                <td>{fmt(growth.fee)}</td>
              </tr>
              <tr>
                <td>{locale === 'fr' ? 'Net reçu' : 'Net received'}</td>
                <td>{fmt(growth.net)}</td>
              </tr>
            </tbody>
          </table>
        </>
      );
    }
    case 'refunds':
      return (
        <table>
          <thead>
            <tr>
              <th>{locale === 'fr' ? 'Élément' : 'Item'}</th>
              <th>{locale === 'fr' ? 'Montant' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Remboursement partiel (le remboursement total est gratuit)'
                  : 'Partial refund (full refunds are free)'}
              </td>
              <td>{FIXED_FEES_XOF.refund.percent}%</td>
            </tr>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Litige carte / chargeback'
                  : 'Card dispute / chargeback'}
              </td>
              <td>
                {CHARGEBACK_INTL_FIXED} $ {locale === 'fr' ? 'ou' : 'or'}{' '}
                {FIXED_FEES_XOF.chargeback.fixed.toLocaleString('fr-FR')} F CFA
              </td>
            </tr>
          </tbody>
        </table>
      );
    case 'payouts':
      return (
        <table>
          <thead>
            <tr>
              <th>{locale === 'fr' ? 'Méthode' : 'Method'}</th>
              <th>{locale === 'fr' ? 'Frais' : 'Fee'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Virement international'
                  : 'International bank transfer'}
              </td>
              <td>{xof(FIXED_FEES_XOF.internationalBankPayout)}</td>
            </tr>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Virement local (UEMOA)'
                  : 'Local bank transfer (UEMOA)'}
              </td>
              <td>{xof(FIXED_FEES_XOF.localBankPayout)}</td>
            </tr>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Retrait Mobile Money marchand'
                  : 'Merchant Mobile Money withdrawal'}
              </td>
              <td>{locale === 'fr' ? 'Gratuit' : 'Free'}</td>
            </tr>
            <tr>
              <td>
                {locale === 'fr'
                  ? 'Mobile Money bénéficiaire'
                  : 'Beneficiary Mobile Money'}
              </td>
              <td>{xof(FIXED_FEES_XOF.beneficiaryMmPayout)}</td>
            </tr>
          </tbody>
        </table>
      );
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
