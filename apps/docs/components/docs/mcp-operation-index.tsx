/* @proprietary license */

import Link from 'next/link';
import { getDocsLocale } from '@/lib/utils/docs-locale';
import { t as translate } from '@/lib/i18n/translations';
import {
  listMcpToolGroups,
  mcpTwinAnchor,
  operationKey,
  type McpTwin,
} from '@/lib/mcp-twins';
import { source } from '@/lib/utils/source';
import { isString } from '@lomi./shared';

let restUrlCache: Map<string, string> | null = null;

function restUrlByOperationKey(): Map<string, string> {
  if (restUrlCache) return restUrlCache;
  const map = new Map<string, string>();
  for (const page of source.getPages('en')) {
    const method =
      'method' in page.data && isString(page.data.method)
        ? page.data.method
        : undefined;
    const route =
      'path' in page.data && isString(page.data.path)
        ? page.data.path
        : undefined;
    if (!method || !route) continue;
    const key = operationKey(method, route);
    if (!map.has(key)) {
      map.set(key, page.url);
    }
  }
  restUrlCache = map;
  return map;
}

export async function McpOperationIndex() {
  const locale = await getDocsLocale();
  const groups = listMcpToolGroups();
  const restUrls = restUrlByOperationKey();
  const actionLabel = translate('mcpIndex.action', locale);
  const restLabel = translate('mcpIndex.rest', locale);
  const missingLabel = translate('mcpIndex.noRestPage', locale);

  return (
    <div className="docs-mcp-index not-prose">
      {groups.map((group) => (
        <section
          key={group.tool}
          className="docs-mcp-index-group mb-5 border-b border-[color:var(--docs-hairline)] pb-5 last:mb-0 last:border-b-0 last:pb-0"
          aria-labelledby={group.tool}
        >
          <h3 id={group.tool} className="docs-mcp-index-tool">
            <code>{group.tool}</code>
            <span className="docs-mcp-index-tool-title">{group.title}</span>
          </h3>
          <div className="docs-mcp-index-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{actionLabel}</th>
                  <th>{restLabel}</th>
                </tr>
              </thead>
              <tbody>
                {group.twins.map((twin) => (
                  <TwinRow
                    key={twin.operationKey}
                    twin={twin}
                    restHref={restUrls.get(twin.operationKey)}
                    missingLabel={missingLabel}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

function TwinRow({
  twin,
  restHref,
  missingLabel,
}: {
  twin: McpTwin;
  restHref: string | undefined;
  missingLabel: string;
}) {
  const anchor = mcpTwinAnchor(twin.tool, twin.action);
  return (
    <tr className="docs-mcp-index-row">
      <td>
        <span id={anchor} className="docs-mcp-index-anchor" />
        <code>{twin.action}</code>
      </td>
      <td>
        {restHref ? (
          <Link href={restHref}>
            <code>{twin.operationKey}</code>
          </Link>
        ) : (
          <span className="docs-mcp-index-missing">
            <code>{twin.operationKey}</code>
            <span>{missingLabel}</span>
          </span>
        )}
      </td>
    </tr>
  );
}
