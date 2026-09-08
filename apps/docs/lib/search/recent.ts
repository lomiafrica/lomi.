/* @proprietary license */

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

function isRecentSearchHit(value: unknown): value is RecentSearchHit {
  if (!value || typeof value !== 'object') return false;
  const href = 'href' in value ? value.href : null;
  const title = 'title' in value ? value.title : null;
  return (
    typeof href === 'string' && href.length > 0 && typeof title === 'string'
  );
}

export function readRecentSearches(): RecentSearchHit[] {
  if (!hasLocalStorage()) return [];

  try {
    const raw = globalThis.localStorage.getItem(RECENT_SEARCH_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
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
