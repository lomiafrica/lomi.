/* @proprietary license */

import { NotFoundPage } from '@/components/not-found-page';
import { getDocsLocale } from '@/lib/utils/docs-locale';
import { translate } from '@/lib/i18n/translations';
import { buildDocsNotFoundMarkdown } from '@/lib/seo/agent-discovery';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFound() {
  const locale = await getDocsLocale();

  return (
    <>
      <pre className="sr-only">{buildDocsNotFoundMarkdown()}</pre>
      <NotFoundPage
        title={translate('ui.notFoundTitle', locale)}
        description={translate('ui.notFoundDescription', locale)}
        homeLabel={translate('ui.notFoundHome', locale)}
      />
    </>
  );
}
