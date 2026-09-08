/* @proprietary license */

import type { MetadataRoute } from 'next';
import { AGENT_CORPUS_ROUTES } from '@/lib/docs/agent-corpus/slugs';
import { isDocsSitemapPath } from '@/lib/seo/robots-policy';
import { source } from '@/lib/utils/source';
import { getDocsSiteOrigin } from '@/lib/utils/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getDocsSiteOrigin();
  const pages = source.getPages('en');

  const docEntries = pages
    .map((page) => {
      const path = page.url.startsWith('/') ? page.url : `/${page.url}`;
      return path;
    })
    .filter(isDocsSitemapPath)
    .map((path) => {
      // SAFETY: Boundary value matches the asserted domain type at this call site.
      const changeFrequency = (
        path.startsWith('/api/') ? 'weekly' : 'monthly'
      ) as 'weekly' | 'monthly';
      const priority =
        path === '/start/overview' ? 1 : path.startsWith('/start/') ? 0.9 : 0.7;

      return {
        url: `${origin}${path}`,
        changeFrequency,
        priority,
      };
    });

  const seen = new Set(docEntries.map((entry) => entry.url));
  const agentEntries: MetadataRoute.Sitemap = AGENT_CORPUS_ROUTES.filter(
    isDocsSitemapPath,
  )
    .map((path) => ({
      url: `${origin}${path}`,
      changeFrequency: 'monthly' as const,
      priority: path === '/agents' ? 0.75 : 0.7,
    }))
    .filter((entry) => {
      if (seen.has(entry.url)) {
        return false;
      }
      seen.add(entry.url);
      return true;
    });

  return [...agentEntries, ...docEntries];
}
