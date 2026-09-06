/* @proprietary license */

import Link from 'next/link';
import type { Language } from '@/lib/i18n/config';
import { t as translate } from '@/lib/i18n/translations';
import type { McpTwin } from '@/lib/mcp-twins';
import { mcpTwinHref } from '@/lib/mcp-twins';
import { docsLinkShouldScroll } from '@/lib/docs-hash';

type DocsTwinLinkProps = {
  twin: McpTwin;
  locale: Language;
  direction?: 'mcp' | 'rest';
  restHref?: string;
};

export function DocsTwinLink({
  twin,
  locale,
  direction = 'mcp',
  restHref,
}: DocsTwinLinkProps) {
  const actionLabel = translate('twins.action', locale);
  const identifier = `${twin.tool} ${actionLabel}=${twin.action}`;

  if (direction === 'rest') {
    if (!restHref) return null;
    return (
      <p className="docs-twin-link">
        <span className="docs-twin-link-label">
          {translate('twins.rest', locale)}
        </span>
        <Link
          className="docs-twin-link-target"
          href={restHref}
          prefetch
          scroll={docsLinkShouldScroll(restHref)}
        >
          <code>{twin.operationKey}</code>
        </Link>
      </p>
    );
  }

  const href = mcpTwinHref(twin.tool, twin.action);

  return (
    <p className="docs-twin-link">
      <span className="docs-twin-link-label">
        {translate('twins.mcp', locale)}
      </span>
      <Link
        className="docs-twin-link-target"
        href={href}
        prefetch
        scroll={docsLinkShouldScroll(href)}
      >
        <code>{identifier}</code>
      </Link>
    </p>
  );
}
