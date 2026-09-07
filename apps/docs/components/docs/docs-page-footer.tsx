'use client';

import { useMemo } from 'react';
import Link from 'fumadocs-core/link';
import { usePathname } from 'fumadocs-core/framework';
import { useFooterItems } from 'fumadocs-ui/utils/use-footer-items';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@lomi./ui/cn';
import { translate } from '@/lib/i18n/translations';
import { useTranslation } from '@/lib/utils/translation-context';

function samePath(url: string, pathname: string): boolean {
  const left = url.replace(/\/$/, '') || '/';
  const right = pathname.replace(/\/$/, '') || '/';
  return left === right;
}

export function DocsPageFooter() {
  const items = useFooterItems();
  const pathname = usePathname();
  const { currentLanguage } = useTranslation();
  const { previous, next } = useMemo(() => {
    const index = items.findIndex((item) => samePath(item.url, pathname));
    if (index === -1) return {};
    return {
      previous: items[index - 1],
      next: items[index + 1],
    };
  }, [items, pathname]);

  if (!previous && !next) return null;

  return (
    <nav
      className="docs-page-pager not-prose mt-10 flex items-start justify-between gap-8 border-t border-fd-border pt-5"
      aria-label={translate('next.title', currentLanguage)}
    >
      {previous ? (
        <Link
          href={previous.url}
          className="group inline-flex min-w-0 max-w-[50%] items-start gap-1 text-sm text-fd-muted-foreground no-underline hover:text-fd-foreground"
        >
          <ChevronLeft className="mt-0.5 size-4 shrink-0 rtl:rotate-180" />
          <span className="min-w-0">
            <span className="block text-xs">
              {translate('ui.previousPage', currentLanguage)}
            </span>
            <span className="block truncate font-medium text-fd-foreground">
              {previous.name}
            </span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.url}
          className={cn(
            'group inline-flex min-w-0 max-w-[50%] items-start gap-1 text-sm text-fd-muted-foreground no-underline hover:text-fd-foreground',
            'ml-auto text-end',
          )}
        >
          <span className="min-w-0">
            <span className="block text-xs">
              {translate('ui.nextPage', currentLanguage)}
            </span>
            <span className="block truncate font-medium text-fd-foreground">
              {next.name}
            </span>
          </span>
          <ChevronRight className="mt-0.5 size-4 shrink-0 rtl:rotate-180" />
        </Link>
      ) : null}
    </nav>
  );
}
