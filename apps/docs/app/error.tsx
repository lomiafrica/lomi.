/* @proprietary license */

'use client';

import { useEffect, useState } from 'react';
import {
  StatusPage,
  StatusPageActionButton,
  StatusPageActionLink,
} from '@lomi./ui/status-page';
import { Cookies } from '@lomi./shared';
import type { Language } from '@/lib/i18n/config';
import { translate } from '@/lib/i18n/translations';

function readDocsLocale(): Language {
  if (typeof document === 'undefined') return 'fr';
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${Cookies.Language}=([^;]*)`),
  );
  const raw = match?.[1] ? decodeURIComponent(match[1]) : null;
  return raw === 'en' || raw === 'fr' ? raw : 'fr';
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState<Language>('fr');

  useEffect(() => {
    setLocale(readDocsLocale());
  }, []);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code="500"
      title={translate('ui.errorTitle', locale)}
      description={translate('ui.errorDescription', locale)}
      actions={
        <>
          <StatusPageActionButton onClick={() => reset()}>
            {translate('ui.errorRetry', locale)}
          </StatusPageActionButton>
          <StatusPageActionLink href="/start/overview">
            {translate('ui.errorHome', locale)}
          </StatusPageActionLink>
        </>
      }
    />
  );
}
