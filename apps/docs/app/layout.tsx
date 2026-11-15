/* @proprietary license */

import './globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getDocsSiteOrigin } from '@/lib/utils/metadata';
import { SiteJsonLd } from '@/components/seo/site-json-ld';

const docsOrigin = getDocsSiteOrigin();

const title = 'lomi.';
const descriptionEn =
  'A suite of APIs for online payment processing and commerce in Africa. Collect, pay out, and automate financial workflows.';

/**
 * The default description is English: crawlers get the English default, and
 * per-locale pages override it in their own metadata. Reading `headers()` here
 * for the locale would opt every docs page out of static generation (the
 * `[[...slug]]` pages require static output), and layouts only receive params
 * for their own segment, so `/l/[lang]` is not visible at this level.
 */
const description = descriptionEn;

export async function generateMetadata(): Promise<Metadata> {
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
      locale: 'en_US',
      alternateLocale: ['fr_FR'],
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

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // The html lang is corrected per locale at parse time by the [lang] layout —
  // layouts only receive params for their own segment, so the root layout
  // cannot see `/l/[lang]` and must stay 'en' in the raw document.
  return (
    <html lang="en" className={font.className} suppressHydrationWarning>
      <body className="relative flex min-h-screen flex-col">
        <SiteJsonLd />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
