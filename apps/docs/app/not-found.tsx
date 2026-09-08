/* @proprietary license */

import { DocsNotFoundView } from '@/components/docs-not-found-view';
import { buildDocsNotFoundMarkdown } from '@/lib/seo/agent-discovery';
import type { Metadata } from 'next';
import { Provider } from './provider';

export const metadata: Metadata = {
  title: 'This page could not be found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <>
      <pre className="sr-only">{buildDocsNotFoundMarkdown()}</pre>
      <Provider>
        <DocsNotFoundView />
      </Provider>
    </>
  );
}
