/* @proprietary license */

import { getDocsLocale } from '@/lib/utils/docs-locale';
import { t as translate } from '@/lib/i18n/translations';
import {
  listMcpToolGroups,
  listRestDocsHrefs,
  mcpCategoryForGroup,
  mcpTwinAnchor,
} from '@/lib/mcp-twins';
import {
  McpOperationIndexView,
  type McpOperationIndexGroup,
  type McpOperationIndexLabels,
} from '@/components/docs/mcp-operation-index-view';

export function McpOperationIndex() {
  const locale = getDocsLocale();
  const restUrls = listRestDocsHrefs();
  const groups: McpOperationIndexGroup[] = listMcpToolGroups().map((group) => ({
    tool: group.tool,
    title: group.title,
    category: mcpCategoryForGroup(group),
    twins: group.twins.map((twin) => {
      const restHref = restUrls.get(twin.operationKey);
      const row: McpOperationIndexGroup['twins'][number] = {
        operationKey: twin.operationKey,
        action: twin.action,
        anchor: mcpTwinAnchor(twin.tool, twin.action),
      };
      if (restHref) {
        row.restHref = restHref;
      }
      return row;
    }),
  }));

  const labels: McpOperationIndexLabels = {
    action: translate('mcpIndex.action', locale),
    rest: translate('mcpIndex.rest', locale),
    missing: translate('mcpIndex.noRestPage', locale),
    search: translate('mcpIndex.search', locale),
    empty: translate('mcpIndex.empty', locale),
    filters: translate('mcpIndex.filters', locale),
    all: translate('search.all', locale),
    categories: {
      accept: translate('mcpIndex.category.accept', locale),
      commerce: translate('mcpIndex.category.commerce', locale),
      money: translate('mcpIndex.category.money', locale),
      platform: translate('mcpIndex.category.platform', locale),
      operations: translate('mcpIndex.category.operations', locale),
      agents: translate('mcpIndex.category.agents', locale),
    },
  };

  return <McpOperationIndexView groups={groups} labels={labels} />;
}
