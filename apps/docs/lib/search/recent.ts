/* @proprietary license */

import {
  isJsonArray,
  isJsonObject,
  parseJson,
  readString,
  type JsonValue,
} from '@lomi./shared';

export type RecentSearchHit = {
  href: string;
  title: string;
};

export const RECENT_SEARCH_LIMIT = 6;
export const RECENT_SEARCH_STORAGE_KEY = 'lomi.docs.search.recent';

function hasLocalStorage(): boolean {
  try {
    return 'localStorage' in globalThis && globalThis.localStorage != null;
  } catch {
    return false;
  }
}

function isRecentSearchHit(value: JsonValue): value is RecentSearchHit {
  if (!isJsonObject(value)) return false;
  const href = readString(value, 'href');
  const title = readString(value, 'title');
  return href !== undefined && href.length > 0 && title !== undefined;
}

export function readRecentSearches(): RecentSearchHit[] {
  if (!hasLocalStorage()) return [];

  try {
    const raw = globalThis.localStorage.getItem(RECENT_SEARCH_STORAGE_KEY);
    if (!raw) return [];
    const parsed = parseJson(raw);
    if (!isJsonArray(parsed)) return [];
    return parsed.filter(isRecentSearchHit).slice(0, RECENT_SEARCH_LIMIT);
  } catch {
    return [];
  }
}

export function rememberRecentSearch(hit: RecentSearchHit): RecentSearchHit[] {
  const href = hit.href.trim();
  const title = hit.title.trim();
  if (!href || !title) return readRecentSearches();

  const next = [
    { href, title },
    ...readRecentSearches().filter((item) => item.href !== href),
  ].slice(0, RECENT_SEARCH_LIMIT);

  if (hasLocalStorage()) {
    globalThis.localStorage.setItem(
      RECENT_SEARCH_STORAGE_KEY,
      JSON.stringify(next),
    );
  }

  return next;
}
