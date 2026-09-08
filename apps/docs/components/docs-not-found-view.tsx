/* @proprietary license */

'use client';

import {
  StatusPage,
  StatusPageActionLink,
} from '@lomi./ui/status-page';
import { useTranslation } from '@/lib/utils/translation-context';
import { t as translate } from '@/lib/i18n/translations';

export function DocsNotFoundView() {
  const { currentLanguage } = useTranslation();

  return (
    <StatusPage
      code="404"
      title={translate('ui.notFoundTitle', currentLanguage)}
      description={translate('ui.notFoundDescription', currentLanguage)}
      actions={
        <StatusPageActionLink href="/start/overview">
          {translate('ui.notFoundHome', currentLanguage)}
        </StatusPageActionLink>
      }
    />
  );
}
