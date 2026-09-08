/* @proprietary license */

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { docsLinkShouldScroll } from '@/lib/docs-hash';
import {
  MCP_CATALOG_CATEGORIES,
  type McpCatalogCategory,
} from '@/lib/mcp-catalog';

export type McpOperationIndexTwin = {
  operationKey: string;
  action: string;
  anchor: string;
  restHref?: string;
};

export type McpOperationIndexGroup = {
  tool: string;
  title: string;
  category: McpCatalogCategory;
  twins: McpOperationIndexTwin[];
};

export type McpOperationIndexLabels = {
  action: string;
  rest: string;
  missing: string;
  search: string;
  empty: string;
  filters: string;
  all: string;
  categories: Record<McpCatalogCategory, string>;
};

type CatalogFilter = 'all' | McpCatalogCategory;

function hashTargetId(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hash.replace(/^#/, '');
}

function groupForHash(
  groups: McpOperationIndexGroup[],
  hashId: string,
): McpOperationIndexGroup | undefined {
  if (!hashId) return undefined;
  return groups.find(
    (group) =>
      group.tool === hashId ||
      group.twins.some((twin) => twin.anchor === hashId),
  );
}

function matchesQuery(value: string, query: string): boolean {
  return value.toLowerCase().includes(query);
}

function visibleTwins(
  group: McpOperationIndexGroup,
  query: string,
): McpOperationIndexTwin[] {
  if (!query) return group.twins;
  if (matchesQuery(group.tool, query) || matchesQuery(group.title, query)) {
    return group.twins;
  }
  return group.twins.filter(
    (twin) =>
      matchesQuery(twin.action, query) ||
      matchesQuery(twin.operationKey, query),
  );
}

export function McpOperationIndexView({
  groups,
  labels,
}: {
  groups: McpOperationIndexGroup[];
  labels: McpOperationIndexLabels;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CatalogFilter>('all');
  const rootRef = useRef<HTMLDivElement>(null);
  const groupsRef = useRef(groups);
  groupsRef.current = groups;

  const normalizedQuery = query.trim().toLowerCase();
  const searching = normalizedQuery.length > 0;

  useEffect(() => {
    const openFromHash = () => {
      const group = groupForHash(groupsRef.current, hashTargetId());
      if (!group) return;
      const el = document.getElementById(group.tool);
      if (el instanceof HTMLDetailsElement) el.open = true;
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !searching) return;
    for (const el of root.querySelectorAll('details.docs-mcp-index-group')) {
      if (el instanceof HTMLDetailsElement) el.open = true;
    }
  }, [searching, filter, query]);

  const visible = useMemo(() => {
    const rows: Array<{
      group: McpOperationIndexGroup;
      twins: McpOperationIndexTwin[];
    }> = [];
    for (const group of groups) {
      if (filter !== 'all' && group.category !== filter) continue;
      const twins = visibleTwins(group, normalizedQuery);
      if (twins.length === 0) continue;
      rows.push({ group, twins });
    }
    return rows;
  }, [filter, groups, normalizedQuery]);

  const sections = useMemo(() => {
    if (filter !== 'all') {
      return [{ category: filter, rows: visible }];
    }
    return MCP_CATALOG_CATEGORIES.flatMap((category) => {
      const rows = visible.filter((row) => row.group.category === category);
      return rows.length > 0 ? [{ category, rows }] : [];
    });
  }, [filter, visible]);

  return (
    <div ref={rootRef} className="docs-mcp-index not-prose">
      <div className="docs-mcp-index-toolbar">
        <label className="docs-mcp-index-search">
          <span className="sr-only">{labels.search}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.search}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <div
          className="docs-mcp-index-chips"
          role="group"
          aria-label={labels.filters}
        >
          <Chip
            pressed={filter === 'all'}
            onClick={() => setFilter('all')}
            label={labels.all}
          />
          {MCP_CATALOG_CATEGORIES.map((category) => (
            <Chip
              key={category}
              pressed={filter === category}
              onClick={() => setFilter(category)}
              label={labels.categories[category]}
            />
          ))}
        </div>
      </div>

      {sections.length === 0 ? (
        <p className="docs-mcp-index-empty">{labels.empty}</p>
      ) : (
        sections.map((section) => (
          <div key={section.category} className="docs-mcp-index-section">
            {filter === 'all' ? (
              <p className="docs-mcp-index-category">
                {labels.categories[section.category]}
              </p>
            ) : null}
            {section.rows.map(({ group, twins }) => (
              <details
                key={group.tool}
                id={group.tool}
                className="docs-mcp-index-group"
              >
                <summary className="docs-mcp-index-tool">
                  <code>{group.tool}</code>
                  <span className="docs-mcp-index-tool-title">
                    {group.title}
                  </span>
                </summary>
                <div className="docs-mcp-index-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{labels.action}</th>
                        <th>{labels.rest}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {twins.map((twin) => (
                        <TwinRow
                          key={twin.anchor}
                          twin={twin}
                          missingLabel={labels.missing}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

function Chip({
  pressed,
  onClick,
  label,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className="docs-mcp-index-chip"
      aria-pressed={pressed}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function TwinRow({
  twin,
  missingLabel,
}: {
  twin: McpOperationIndexTwin;
  missingLabel: string;
}) {
  return (
    <tr className="docs-mcp-index-row">
      <td>
        <span id={twin.anchor} className="docs-mcp-index-anchor" />
        <code>{twin.action}</code>
      </td>
      <td>
        {twin.restHref ? (
          <Link
            href={twin.restHref}
            scroll={docsLinkShouldScroll(twin.restHref)}
          >
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
