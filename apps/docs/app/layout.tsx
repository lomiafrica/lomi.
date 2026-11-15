/* @proprietary license */

import './globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { cookies, headers } from 'next/headers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getDocsSiteOrigin } from '@/lib/utils/metadata';
import { SiteJsonLd } from '@/components/seo/site-json-ld';
import {
  docsLanguageCookieValue,
  docsLocaleForRequest,
} from '@/lib/utils/docs-routing';
import type { Language } from '@/lib/i18n/config';

const docsOrigin = getDocsSiteOrigin();

const title = 'lomi.';
const descriptionEn =
  'A suite of APIs for online payment processing and commerce in Africa. Collect, pay out, and automate financial workflows.';
const descriptionFr =
  "Suite d'API pour le traitement des paiements en ligne et le commerce en Afrique. Encaissez, versez et automatisez vos flux financiers.";

async function requestDocsLocale(): Promise<Language> {
  const headerStore = await headers();
  const stamped = headerStore.get('x-docs-locale');
  if (stamped === 'en' || stamped === 'fr') return stamped;
  const cookieStore = await cookies();
  return docsLocaleForRequest(
    docsLanguageCookieValue(cookieStore),
    headerStore.get('accept-language'),
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestDocsLocale();
  const description = locale === 'fr' ? descriptionFr : descriptionEn;
  return {
    title: {
      default: title,
      template: 'lomi. | %s',
    },
    description,
    keywords: [
      'payment processing',
      'online payments',
      'Africa',
      'bank transfers',
      'mobile money',
      'credit card payments',
      'API',
      'unified checkout',
      'transaction management',
      'e-commerce',
      'sell online',
      'billing',
      'facturation',
      'javascript',
      'subscriptions',
      'visa',
      'mastercard',
      'mtn',
      'wave',
      'paiement en ligne',
      'paiement mobile',
      "transfert d'argent",
      'portefeuille électronique',
      'commerce électronique',
      'passerelle de paiement',
      'solution de paiement',
      'Afrique',
      'paiements africains',
      'plateforme de paiement',
      'intégration de paiement',
      'paiement par carte',
      'portefeuille mobile',
      'paiements numériques',
      'traitement des paiements',
      'gateway de paiement',
      'pagamento online',
      'pagamento móvel',
      'transferência de dinheiro',
      'comércio eletrônico',
      'pagamento com cartão',
      'pagamentos africanos',
      'processamento de pagamentos',
      'منصة الدفع',
      'المدفوعات عبر الإنترنت',
      'المدفوعات بالهاتف المحمول',
      'التجارة الإلكترونية',
      'معالجة المدفوعات',
      'بطاقة الائتمان',
      'crypto-monnaie',
      'abonnements',
      'infrastructure de paiement',
      'paiement sans friction',
      'paiement sécurisé',
    ],
    metadataBase: new URL(`${docsOrigin}/`),
    verification: {
      google: 'fD_UOOSaZDjO5rdngNSUYtYQK-sfA5DhMyiUNW7GyAs',
    },
    robots: 'index, follow',
    authors: [{ name: 'Babacar Diop', url: 'https://github.com/lomiafrica/' }],
    openGraph: {
      type: 'website',
      url: docsOrigin,
      title,
      description,
      siteName: 'lomi.',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: [locale === 'fr' ? 'en_US' : 'fr_FR'],
      images: [
        {
          url: '/banner.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        'https://res.cloudinary.com/dzrdlevfn/image/upload/v1759315964/x_banner_vu16vp.webp',
      ],
      site: '@lomiafrica',
      creator: '@lomiafrica',
    },
    other: {
      'msapplication-TileColor': '#da532c',
    },
  };
}

const font = {
  className: 'font-main',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await requestDocsLocale();
  return (
    <html lang={locale} className={font.className} suppressHydrationWarning>
      <body className="relative flex min-h-screen flex-col">
        <SiteJsonLd />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
