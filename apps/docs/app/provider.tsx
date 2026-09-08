/* @proprietary license */

'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import dynamic from 'next/dynamic';
import { useEffect, type ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import {
  TranslationProvider,
  useTranslation,
} from '@/lib/utils/translation-context';
import { Toaster } from 'sonner';
import type { Language } from '@/lib/i18n/config';
import { languages } from '@/lib/i18n/config';
import { t as translate } from '@/lib/i18n/translations';
import { DocsWorkspaceProvider } from '@/lib/docs/workspace-context';
import { isString } from '@lomi./shared';

const SearchDialog = dynamic(() => import('@/components/ui/search'), {
  ssr: false,
});

export function Provider({
  children,
  initialLanguage = 'en',
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uwuParam = urlParams.get('uwu');

    if (isString(uwuParam)) {
      localStorage.setItem('uwu', uwuParam);
    }

    const item = localStorage.getItem('uwu');

    if (item === 'true') {
      document.documentElement.classList.add('uwu');
    } else {
      document.documentElement.classList.remove('uwu');
    }
  }, []);

  return (
    <TranslationProvider initialLanguage={initialLanguage}>
      <RootProviderWithLanguage>{children}</RootProviderWithLanguage>
    </TranslationProvider>
  );
}

function RootProviderWithLanguage({ children }: { children: ReactNode }) {
  const { currentLanguage, setLanguage } = useTranslation();
  const t = (key: string) => translate(key, currentLanguage);

  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
      theme={{
        storageKey: 'lomi-theme',
        defaultTheme: 'light',
        disableTransitionOnChange: false,
        // React 19 / Next 16: next-themes injects <script> in the tree.
        // application/json silences the dev warning without breaking theme toggling.
        scriptProps: { type: 'application/json' },
      }}
      i18n={{
        locale: currentLanguage,
        locales: languages.map((lang) => ({
          locale: lang.code,
          name: lang.name,
        })),
        onLocaleChange: (locale) => {
          if (locale === 'en' || locale === 'fr') setLanguage(locale);
        },
        translations: {
          search: t('search.search'),
          searchNoResult: t('ui.searchNoResult'),
          toc: t('ui.toc'),
          tocNoHeadings: t('ui.tocNoHeadings'),
          lastUpdate: t('ui.lastUpdate'),
          chooseLanguage: t('ui.chooseLanguage'),
          nextPage: t('ui.nextPage'),
          previousPage: t('ui.previousPage'),
          chooseTheme: t('ui.chooseTheme'),
          editOnGithub: t('ui.editOnGithub'),
        },
      }}
    >
      <TooltipProvider>
        <DocsWorkspaceProvider>
          {children}
          <Toaster />
        </DocsWorkspaceProvider>
      </TooltipProvider>
    </RootProvider>
  );
}
