/* @proprietary license */

import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Body } from '@/app/layout.client';
import { Provider } from './provider';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ApolloTracker } from '@/components/analytics/apollo-tracker';
import { StructuredData } from '@/components/structured-data';

const title = "lomi. | West Africa's Payment Processing Platform";
const description =
  'lomi. is a suite of APIs powering online payment processing and e-commerce solutions in West Africa. Accept payments, send payouts, and automate financial workflows with ease.';

export const metadata: Metadata = {
  title: {
    default: title,
    template: 'lomi. | %s',
  },
  description,
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
    'orange',
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
  metadataBase: new URL('https://lomi.africa'),
  verification: {
    google: 'fD_UOOSaZDjO5rdngNSUYtYQK-sfA5DhMyiUNW7GyAs',
  },
  robots: 'index, follow',
  authors: [{ name: 'Babacar Diop', url: 'https://github.com/lomiafrica/' }],
  alternates: {
    canonical: 'https://lomi.africa',
    languages: {
      en: 'https://lomi.africa',
      'x-default': 'https://lomi.africa',
    },
  },
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
  ],
  openGraph: {
    type: 'website',
    url: 'https://lomi.africa/',
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
    'og:title[fr]':
      "lomi. | La meilleure façon d'accepter des paiements en Afrique de l'Ouest",
    'og:description[fr]':
      "lomi. est une suite d'APIs qui facilitent le traitement des paiements en ligne et les solutions de e-commerce en Afrique de l'Ouest. Acceptez des paiements, effectuez des versements et automatisez vos flux financiers en toute simplicité.",
    'twitter:title[fr]':
      "lomi. | La meilleure façon d'accepter des paiements en Afrique de l'Ouest",
    'twitter:description[fr]':
      "lomi. est une suite d'APIs qui facilitent le traitement des paiements en ligne et les solutions e-commerce en Afrique de l'Ouest. Acceptez des paiements, effectuez des versements et automatisez vos flux financiers en toute simplicité.",
    'msapplication-TileColor': '#da532c',
    preconnect: ['https://api.producthunt.com', 'https://res.cloudinary.com'],
  },
};

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
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${font.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to critical origins for better performance */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link
          rel="preconnect"
          href="https://mdswvokxrnfggrujsfjd.supabase.co"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://api.producthunt.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="//cdn.sanity.io" />
        <link rel="dns-prefetch" href="//mdswvokxrnfggrujsfjd.supabase.co" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//api.producthunt.com" />
        {/* Structured Data JSON-LD for rich results - must be in head for crawlers */}
        <StructuredData />
      </head>
      <Body>
        <Provider>{children}</Provider>
        <Analytics />
        <SpeedInsights />
        <ApolloTracker />
      </Body>
    </html>
  );
}
