/* @proprietary license */

import { cookies } from 'next/headers';
import type { Language } from '@/lib/i18n/config';
import { Cookies } from '@lomi./shared';
import { parseDocsLang } from '@/lib/utils/docs-routing';

/** Locale for route handlers (markdown mirrors) that are already dynamic. */
export async function getDocsLocaleFromCookie(): Promise<Language> {
  const store = await cookies();
  return parseDocsLang(store.get(Cookies.Language)?.value);
}
