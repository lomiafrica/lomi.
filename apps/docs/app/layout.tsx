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
const descriptionFr =
  "Suite d'API pour le traitement des paiements en ligne et le commerce en Afrique de l'Ouest francophone. Encaissez, versez et automatisez vos flux financiers.";

export function generateMetadata(): Metadata {
  return {
    title: {
      default: title,
      template: 'lomi. | %s',
    },
    description: descriptionFr,
    keywords: [
      'payment processing',
      'online payments',
      'West Africa',
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
      "Afrique de l'Ouest",
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
      description: descriptionFr,
      siteName: 'lomi.',
      locale: 'fr_FR',
      alternateLocale: ['en_US'],
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
      description: descriptionFr,
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

// Use single system font stack for everything
const font = {
  style: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  variable: '--font-main',
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
  return (
    <html
      lang="fr"
      className={font.className}
      style={font.style}
      suppressHydrationWarning
    >
      <body className="relative flex min-h-screen flex-col">
        <SiteJsonLd />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
