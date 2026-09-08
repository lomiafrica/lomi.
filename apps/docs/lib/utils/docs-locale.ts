/* @proprietary license */

import { cache } from 'react';
import type { Language } from '@/lib/i18n/config';
import { parseDocsLang } from '@/lib/utils/docs-routing';

/**
 * Per-request locale bag. Docs HTML pages set this from the `[lang]` route
 * param (after middleware rewrite) so MDX server components never read the
 * request cookie jar, which would opt the page into dynamic rendering.
 */
type DocsLocaleBag = {
  current: Language | null;
};

const localeBag = cache((): DocsLocaleBag => ({
  current: null,
}));

export function setDocsLocale(locale: Language): void {
  localeBag().current = locale;
}

/**
 * Locale for HTML / MDX. Reads the request bag only so statically generated
 * docs pages stay static.
 */
export function getDocsLocale(): Language {
  return localeBag().current ?? 'fr';
}

export { parseDocsLang };
