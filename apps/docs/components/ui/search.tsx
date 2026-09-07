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
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@lomi./ui/cn';
import { useTranslation } from '@/lib/utils/translation-context';
import { t as translate } from '@/lib/i18n/translations';
import { orama } from '@/lib/orama/client';
import type { OramaCloudSearchParams } from '@orama/core';
import type { SortedResult } from 'fumadocs-core/search';
import { DOCS_SEARCH_SUGGESTED } from '@/lib/search/aliases';
import type { Language } from '@/lib/i18n/config';
import type { DocsSearchTag } from '@/lib/search/tags';

interface OramaHit {
  id: string;
  document: {
    id?: string;
    url?: string;
    title?: string;
    breadcrumbs?: string[];
    description?: string;
    locale?: string;
    structured?: {
      contents?: string[];
    };
  };
}

function oramaConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_ORAMA_API_KEY &&
      process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID,
  );
}

function suggestedResults(locale: Language): SortedResult[] {
  return DOCS_SEARCH_SUGGESTED.map((item) => ({
    type: 'page' as const,
    id: `suggest:${item.href}`,
    url: item.href,
    content: item.title[locale],
  }));
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

export default function CustomSearchDialog(props: SharedProps) {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<DocsSearchTag | undefined>();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SortedResult[] | 'empty' | null>(
    'empty',
  );
  const [isLoading, setIsLoading] = useState(false);
  const { currentLanguage } = useTranslation();
  const t = (key: string) => String(translate(key, currentLanguage));

  const items = [
    {
      name: t('search.all'),
      description: t('search.allDescription'),
      value: undefined as DocsSearchTag | undefined,
    },
    {
      name: t('search.core'),
      description: t('search.fundamentalsDescription'),
      value: 'core' as const,
    },
    {
      name: t('search.apiReference'),
      description: t('search.apiReferenceDescription'),
      value: 'reference' as const,
    },
    {
      name: t('search.resources'),
      description: t('search.resourcesDescription'),
      value: 'resources' as const,
    },
  ];

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
          const local = await searchLocal(
            search,
            currentLanguage,
            tag,
          );
          if (!cancelled) setResults(local);
          return;
        }

        const datasourceId = process.env.NEXT_PUBLIC_ORAMA_DATASOURCE_ID;
        const searchOptions: OramaCloudSearchParams = {
          term: search,
          limit: 10,
          where: {
            locale: { eq: currentLanguage },
            ...(tag ? { tag: { eq: tag } } : {}),
          },
        };

        if (datasourceId) {
          searchOptions.datasources = [datasourceId];
        }

        const response = await orama.search(searchOptions);
        if (cancelled) return;

        if (response && response.hits && Array.isArray(response.hits)) {
          const transformedResults: SortedResult[] = [];
          const searchLower = search.toLowerCase();

          response.hits.forEach((hit: OramaHit) => {
            const doc = hit.document || {};
            const pageUrl = doc.url || doc.id || hit.id;
            const pageTitle = doc.title || 'Untitled';
            const breadcrumbText =
              doc.breadcrumbs &&
              Array.isArray(doc.breadcrumbs) &&
              doc.breadcrumbs.length > 0
                ? `${doc.breadcrumbs.join(' › ')} › `
                : '';

            transformedResults.push({
              type: 'page' as const,
              id: doc.id || hit.id,
              url: pageUrl,
              content: breadcrumbText + pageTitle,
            });

            if (
              doc.description &&
              doc.description.toLowerCase().includes(searchLower)
            ) {
              transformedResults.push({
                type: 'text' as const,
                id: `${doc.id}-desc`,
                url: pageUrl,
                content: doc.description,
              });
            }

            if (
              doc.structured?.contents &&
              Array.isArray(doc.structured.contents)
            ) {
              const matchingContents = doc.structured.contents
                .filter(
                  (content: string) =>
                    content.toLowerCase().includes(searchLower) &&
                    content.length > 20,
                )
                .slice(0, 2);

              matchingContents.forEach((content: string, idx: number) => {
                const maxLength = 120;
                const index = content.toLowerCase().indexOf(searchLower);
                let excerpt = content;
                if (content.length > maxLength) {
                  const start = Math.max(0, index - 40);
                  const end = Math.min(content.length, start + maxLength);
                  excerpt =
                    (start > 0 ? '...' : '') +
                    content.substring(start, end) +
                    (end < content.length ? '...' : '');
                }

                transformedResults.push({
                  type: 'text' as const,
                  id: `${doc.id}-content-${idx}`,
                  url: pageUrl,
                  content: excerpt,
                });
              });
            }
          });

          setResults(transformedResults);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        try {
          const local = await searchLocal(search, currentLanguage, tag);
          if (!cancelled) setResults(local);
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

  const listItems =
    results === 'empty' ? suggestedResults(currentLanguage) : results;

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={listItems} />
        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: 'sm',
                color: 'ghost',
                className: '-m-1.5 me-auto',
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">
                {t('search.filter')}
              </span>
              {items.find((item) => item.value === tag)?.name}
              <ChevronDown className="size-3.5 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-1 gap-1" align="start">
              {items.map((item) => {
                const isSelected = item.value === tag;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setTag(item.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'rounded-sm text-start px-2 py-1.5',
                      isSelected
                        ? 'text-fd-primary bg-fd-primary/10'
                        : 'hover:text-fd-accent-foreground hover:bg-fd-accent',
                    )}
                  >
                    <p className="font-medium mb-0.5">{item.name}</p>
                    <p className="text-xs opacity-70">{item.description}</p>
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
