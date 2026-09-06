/* @proprietary license */

'use client';

import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { cn } from '@lomi./ui/cn';
import { docsLinkShouldScroll } from '@/lib/docs-hash';
import { PersonalizedCodeSurface } from '@/components/docs/personalized-code-surface';
import type { ServiceReference } from '@/lib/docs/service-references';
import { translate } from '@/lib/i18n/translations';
import type { Language } from '@/lib/i18n/config';
import { useTranslation } from '@/lib/utils/translation-context';

export type IntegrationSurfaceKind = 'api' | 'sdk' | 'cli' | 'mcp';

const SURFACE_STORAGE_KEY = 'lomi.docs.surface';
const SURFACE_ORDER: readonly IntegrationSurfaceKind[] = [
  'api',
  'sdk',
  'cli',
  'mcp',
];

type IntegrationSurfaceGroupProps = {
  children?: ReactNode;
  references?: readonly ServiceReference[];
  className?: string;
  id?: string;
};

type IntegrationSurfaceProps = {
  transport: IntegrationSurfaceKind;
  title: string;
  identifier?: string;
  href?: string;
  hrefLabel?: string;
  defaultOpen?: boolean;
  id?: string;
  children?: ReactNode;
};

function surfaceLabel(kind: IntegrationSurfaceKind, locale: Language): string {
  switch (kind) {
    case 'api':
      return translate('surface.api', locale);
    case 'sdk':
      return translate('surface.sdk', locale);
    case 'cli':
      return translate('surface.cli', locale);
    case 'mcp':
      return translate('surface.mcp', locale);
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function isSurfaceKind(value: string | null): value is IntegrationSurfaceKind {
  return (
    value === 'api' || value === 'sdk' || value === 'cli' || value === 'mcp'
  );
}

function surfaceAnchorId(
  id: string | undefined,
  transport: IntegrationSurfaceKind,
): string {
  return id ?? `call-${transport}`;
}

function transportFromChild(child: ReactNode): IntegrationSurfaceKind | null {
  if (!isValidElement(child)) return null;
  const props = child.props;
  if (!props || typeof props !== 'object' || !('transport' in props)) {
    return null;
  }
  const transport = props.transport;
  if (typeof transport !== 'string' || !isSurfaceKind(transport)) {
    return null;
  }
  return transport;
}

function childDefaultOpen(child: ReactNode): boolean {
  if (!isValidElement(child)) return false;
  const props = child.props;
  return Boolean(
    props &&
    typeof props === 'object' &&
    'defaultOpen' in props &&
    props.defaultOpen === true,
  );
}

function childAnchorId(child: ReactNode): string | undefined {
  if (!isValidElement(child)) return undefined;
  const props = child.props;
  if (!props || typeof props !== 'object' || !('id' in props)) return undefined;
  return typeof props.id === 'string' ? props.id : undefined;
}

function readStoredSurface(): IntegrationSurfaceKind | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(SURFACE_STORAGE_KEY);
    return isSurfaceKind(stored) ? stored : null;
  } catch {
    return null;
  }
}

function persistSurface(kind: IntegrationSurfaceKind): void {
  try {
    window.localStorage.setItem(SURFACE_STORAGE_KEY, kind);
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function IntegrationSurfaceGroup({
  children,
  references,
  className,
  id,
}: IntegrationSurfaceGroupProps) {
  const { currentLanguage } = useTranslation();
  const baseId = useId();
  const childList = useMemo(
    () => Children.toArray(children).filter(isValidElement),
    [children],
  );

  const transports = useMemo(() => {
    const seen = new Set<IntegrationSurfaceKind>();
    for (const reference of references ?? []) {
      seen.add(reference.transport);
    }
    for (const child of childList) {
      const transport = transportFromChild(child);
      if (transport) seen.add(transport);
    }
    return SURFACE_ORDER.filter((kind) => seen.has(kind));
  }, [childList, references]);

  const preferredDefault = useMemo(() => {
    const fromRef = (references ?? []).find((item) => item.defaultOpen);
    if (fromRef) return fromRef.transport;
    const fromChild = childList.find((child) => childDefaultOpen(child));
    const childTransport = fromChild ? transportFromChild(fromChild) : null;
    return childTransport ?? transports[0] ?? 'api';
  }, [childList, references, transports]);

  const [selected, setSelected] =
    useState<IntegrationSurfaceKind>(preferredDefault);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const fromHash = transports.find((kind) => {
      const reference = (references ?? []).find(
        (item) => item.transport === kind,
      );
      const child = childList.find((item) => transportFromChild(item) === kind);
      const anchor = surfaceAnchorId(
        reference?.id ?? childAnchorId(child),
        kind,
      );
      return hash === anchor || hash === `call-${kind}`;
    });
    if (fromHash) {
      setSelected(fromHash);
      return;
    }
    const stored = readStoredSurface();
    if (stored && transports.includes(stored)) {
      setSelected(stored);
    }
  }, [childList, references, transports]);

  function selectSurface(kind: IntegrationSurfaceKind): void {
    setSelected(kind);
    persistSurface(kind);
  }

  function onTabListKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (transports.length === 0) return;
    const index = transports.indexOf(selected);
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = transports[(index + 1) % transports.length];
      if (next) selectSurface(next);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next =
        transports[(index - 1 + transports.length) % transports.length];
      if (next) selectSurface(next);
    }
  }

  if (transports.length === 0) return null;

  return (
    <div id={id} className={cn('docs-surface-group', className)}>
      <div
        role="tablist"
        aria-label={translate('surface.groupAria', currentLanguage)}
        className="docs-surface-tabs"
        onKeyDown={onTabListKeyDown}
      >
        {transports.map((kind) => {
          const active = kind === selected;
          return (
            <button
              key={kind}
              type="button"
              role="tab"
              id={`${baseId}-tab-${kind}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel-${kind}`}
              tabIndex={active ? 0 : -1}
              className={cn(
                'docs-surface-tab',
                `docs-surface-tab--${kind}`,
                active && 'docs-surface-tab--active',
              )}
              onClick={() => selectSurface(kind)}
            >
              <span
                className={cn(
                  'docs-surface-pill',
                  `docs-surface-pill--${kind}`,
                )}
              >
                {surfaceLabel(kind, currentLanguage)}
              </span>
            </button>
          );
        })}
      </div>
      {transports.map((kind) => {
        const reference = (references ?? []).find(
          (item) => item.transport === kind,
        );
        const child = childList.find(
          (item) => transportFromChild(item) === kind,
        );
        const active = kind === selected;
        const panelId = `${baseId}-panel-${kind}`;
        const anchor = surfaceAnchorId(
          reference?.id ?? childAnchorId(child),
          kind,
        );

        return (
          <div
            key={kind}
            id={panelId}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${kind}`}
            hidden={!active}
            className={cn(
              'docs-surface-card',
              active && 'docs-surface-card--active',
            )}
          >
            <div id={anchor} className="docs-surface-body">
              {reference ? <ReferencePanel reference={reference} /> : child}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReferencePanel({ reference }: { reference: ServiceReference }) {
  return (
    <>
      <p className="docs-surface-title">{reference.title}</p>
      {reference.identifier ? (
        <p className="docs-surface-identifier">{reference.identifier}</p>
      ) : null}
      {reference.notes.map((note) => (
        <p key={note}>{note}</p>
      ))}
      <PersonalizedCodeSurface>
        <pre className="docs-code-surface">
          <code className={`language-${reference.sample.language}`}>
            {reference.sample.code}
          </code>
        </pre>
      </PersonalizedCodeSurface>
      {reference.href && reference.hrefLabel ? (
        <p className="docs-surface-link-wrap">
          <Link
            href={reference.href}
            className="docs-surface-link"
            prefetch
            scroll={docsLinkShouldScroll(reference.href)}
          >
            {reference.hrefLabel}
          </Link>
        </p>
      ) : null}
    </>
  );
}

export function IntegrationSurface({
  title,
  identifier,
  href,
  hrefLabel,
  children,
}: IntegrationSurfaceProps) {
  return (
    <>
      <p className="docs-surface-title">{title}</p>
      {identifier ? (
        <p className="docs-surface-identifier">{identifier}</p>
      ) : null}
      {children}
      {href && hrefLabel ? (
        <p className="docs-surface-link-wrap">
          <Link
            href={href}
            className="docs-surface-link"
            prefetch
            scroll={docsLinkShouldScroll(href)}
          >
            {hrefLabel}
          </Link>
        </p>
      ) : null}
    </>
  );
}
