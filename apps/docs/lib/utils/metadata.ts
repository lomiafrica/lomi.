/* @proprietary license */

import type { Metadata } from 'next/types';

/** Public origin for this docs deployment (no trailing slash). */
export function getDocsSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://docs.lomi.africa';
}

export function createMetadata(override: Metadata): Metadata {
  const origin = getDocsSiteOrigin();
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: origin,
      images: '/lomi_d.webp',
      siteName: 'lomi. docs',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@lomiafrica',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: '/lomi_d.webp',
      ...override.twitter,
    },
    alternates: {
      ...override.alternates,
    },
  };
}

export const baseUrl = new URL(getDocsSiteOrigin());
