/* @proprietary license */

import { OramaCloud } from '@orama/core';

const publicApiKey = process.env.NEXT_PUBLIC_ORAMA_API_KEY;
const publicProjectId = process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID;

/** Public search client (browser): project + public API key from Orama dashboard. */
const isSearchConfigured = !!(publicApiKey && publicProjectId);

if (!isSearchConfigured) {
  if (!('window' in globalThis) || globalThis.window === undefined) {
    console.error(
      'Orama search env vars are not set: NEXT_PUBLIC_ORAMA_PROJECT_ID and NEXT_PUBLIC_ORAMA_API_KEY.',
    );
  }
}

const endpoint = process.env.NEXT_PUBLIC_ORAMA_ENDPOINT;

/**
 * Datasource / index id for CloudManager (legacy) indexing and optional search scoping.
 * Prefer `ORAMA_DATASOURCE_ID`; fall back to last segment of legacy `NEXT_PUBLIC_ORAMA_ENDPOINT`.
 */
export const DataSourceId =
  process.env.ORAMA_DATASOURCE_ID ??
  (endpoint ? (endpoint.split('/').pop() ?? '') : '');

type SearchableOrama = Pick<OramaCloud, 'search'>;

export const orama: SearchableOrama = isSearchConfigured
  ? new OramaCloud({
      projectId: publicProjectId!,
      apiKey: publicApiKey!,
    })
  : {
      search: async () => {
        throw new Error(
          'Orama search is not configured. Set NEXT_PUBLIC_ORAMA_PROJECT_ID and NEXT_PUBLIC_ORAMA_API_KEY.',
        );
      },
    };
