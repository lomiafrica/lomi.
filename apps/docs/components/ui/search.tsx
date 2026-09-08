'use client';

import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogListItem,
  SearchDialogOverlay,
  TagsList,
  TagsListItem,
  type SearchItemType,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@lomi./ui/cn';
import { useTranslation } from '@/lib/utils/translation-context';
import { t as translate } from '@/lib/i18n/translations';
import { orama } from '@/lib/orama/client';
import type { OramaCloudSearchParams } from '@orama/core';
import type { SortedResult } from 'fumadocs-core/search';
import { DOCS_SEARCH_SUGGESTED } from '@/lib/search/aliases';
import type { Language } from '@/lib/i18n/config';
import type { DocsSearchTag } from '@/lib/search/tags';
import {
  formatLocalResults,
  formatOramaHits,
  type SearchResultRow,
} from '@/lib/search/format-results';
import {
  readRecentSearches,
  rememberRecentSearch,
  type RecentSearchHit,
} from '@/lib/search/recent';

function oramaConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_ORAMA_API_KEY &&
      process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID,
  );
}

async function searchLocal(
  query: string,
  locale: string,
  tag: DocsSearchTag | undefined,
): Promise<SortedResult[]> {
  const params = new URLSearchParams({ query, locale });
  if (tag) params.set('tag', tag);
  const response = await fetch(`/api/search?${params.toString()}`);
  if (!response.ok) return [];
  const body: unknown = await response.json();
  if (!Array.isArray(body)) return [];
  return body as SortedResult[];
}

function sectionLabel(section: DocsSearchTag | undefined, t: (key: string) => string) {
  switch (section) {
    case 'start':
      return t('search.start');
    case 'build':
      return t('search.build');
    case 'api':
      return t('search.api');
    case 'resources':
      return t('search.resources');
    default:
      return undefined;
  }
}

export default function CustomSearchDialog(props: SharedProps) {
  const [tag, setTag] = useState<DocsSearchTag | undefined>();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResultRow[] | 'empty'>('empty');
  const [isLoading, setIsLoading] = useState(false);
  const [recents, setRecents] = useState<RecentSearchHit[]>([]);
  const { currentLanguage } = useTranslation();
  const t = useCallback(
    (key: string) => String(translate(key, currentLanguage)),
    [currentLanguage],
  );

  useEffect(() => {
    if (props.open) setRecents(readRecentSearches());
  }, [props.open]);

  useEffect(() => {
    let cancelled = false;

    async function performSearch() {
      if (!search || search.trim().length === 0) {
        setResults('empty');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        if (!oramaConfigured()) {
          const local = await searchLocal(search, currentLanguage, tag);
          if (!cancelled) setResults(formatLocalResults(local, tag));
          return;
        }

        const datasourceId = process.env.NEXT_PUBLIC_ORAMA_DATASOURCE_ID;
        const searchOptions: OramaCloudSearchParams = {
          term: search,
          limit: 12,
          where: {
            locale: { eq: currentLanguage },
          },
        };

        if (datasourceId) {
          searchOptions.datasources = [datasourceId];
        }

        const response = await orama.search(searchOptions);
        if (cancelled) return;

        if (response && response.hits && Array.isArray(response.hits)) {
          setResults(formatOramaHits(response.hits, search, tag));
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        try {
          const local = await searchLocal(search, currentLanguage, tag);
          if (!cancelled) setResults(formatLocalResults(local, tag));
        } catch {
          if (!cancelled) setResults([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    const timeoutId = setTimeout(performSearch, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [search, tag, currentLanguage]);

  const emptyItems = useMemo(() => {
    const recentHref = new Set(recents.map((item) => item.href));
    const recentItems: SearchResultRow[] = recents.map((item) => ({
      type: 'page' as const,
      id: `recent:${item.href}`,
      url: item.href,
      content: item.title,
    }));

    const suggested = DOCS_SEARCH_SUGGESTED.filter(
      (item) => !recentHref.has(item.href),
    ).map((item) => ({
      type: 'page' as const,
      id: `suggest:${item.href}`,
      url: item.href,
      content: item.title[currentLanguage as Language] ?? item.title.en,
    }));

    return [...recentItems, ...suggested];
  }, [currentLanguage, recents]);

  const listItems: SearchResultRow[] =
    results === 'empty' ? emptyItems : results;

  const firstRecentId = listItems.find((item) =>
    item.id.startsWith('recent:'),
  )?.id;
  const firstSuggestId = listItems.find((item) =>
    item.id.startsWith('suggest:'),
  )?.id;

  const handleSelect = useCallback(
    (item: SearchItemType) => {
      if (item.type === 'action') return;
      const title = typeof item.content === 'string' ? item.content : '';
      if (!item.url || !title) return;
      setRecents(rememberRecentSearch({ href: item.url, title }));
    },
    [],
  );

  const renderItem = useCallback(
    ({ item, onClick }: { item: SearchItemType; onClick: () => void }) => {
      if (item.type === 'action') {
        return <SearchDialogListItem item={item} onClick={onClick} />;
      }

      const row = listItems.find((entry) => entry.id === item.id);
      const groupLabel =
        item.id === firstRecentId
          ? t('search.recent')
          : item.id === firstSuggestId
            ? t('search.suggested')
            : undefined;
      const section = sectionLabel(row?.section, t);
      const snippet =
        results === 'empty' ? undefined : row?.snippet;

      return (
        <>
          {groupLabel ? (
            <p className="px-2.5 pt-2 pb-1 text-[11px] font-medium text-fd-muted-foreground">
              {groupLabel}
            </p>
          ) : null}
          <SearchDialogListItem
            item={item}
            onClick={onClick}
            className="rounded-sm py-1.5"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate font-medium">{item.content}</p>
                {section ? (
                  <span className="shrink-0 text-[11px] text-fd-muted-foreground">
                    {section}
                  </span>
                ) : null}
              </div>
              {snippet ? (
                <p className="line-clamp-2 text-xs text-fd-muted-foreground">
                  {snippet}
                </p>
              ) : null}
            </div>
          </SearchDialogListItem>
        </>
      );
    },
    [firstRecentId, firstSuggestId, listItems, results, t],
  );

  return (
    <SearchDialog
      {...props}
      search={search}
      onSearchChange={setSearch}
      isLoading={isLoading}
      onSelect={handleSelect}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={listItems}
          Item={renderItem}
          Empty={() => (
            <div className="px-3 py-10 text-center text-sm text-fd-muted-foreground">
              {t('ui.searchNoResult')}
            </div>
          )}
        />
        <SearchDialogFooter className="flex flex-row flex-wrap items-center gap-2">
          <TagsList
            tag={tag ?? 'all'}
            onTagChange={(value) => {
              if (value === 'all' || !value) {
                setTag(undefined);
                return;
              }
              if (
                value === 'start' ||
                value === 'build' ||
                value === 'api'
              ) {
                setTag(value);
              }
            }}
            className={cn('w-full')}
          >
            <TagsListItem value="all">{t('search.all')}</TagsListItem>
            <TagsListItem value="start">{t('search.start')}</TagsListItem>
            <TagsListItem value="build">{t('search.build')}</TagsListItem>
            <TagsListItem value="api">{t('search.api')}</TagsListItem>
          </TagsList>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
