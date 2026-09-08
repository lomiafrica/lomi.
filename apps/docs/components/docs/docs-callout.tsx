import type { ComponentProps, ReactNode } from 'react';
import { DocsAside } from '@/components/docs/docs-aside';
import type { DocsAsideVariant } from '@/components/docs/docs-aside';

type CalloutType =
  'info' | 'warn' | 'warning' | 'error' | 'success' | 'idea' | 'tip';

type ResolvedCalloutType = 'info' | 'warning' | 'error' | 'success' | 'idea';

function resolveType(type?: CalloutType): ResolvedCalloutType {
  if (!type || type === 'tip') return 'info';
  if (type === 'warn') return 'warning';
  return type;
}

type DocsCalloutProps = {
  title?: ReactNode;
  type?: CalloutType;
  emoji?: string;
  icon?: ReactNode;
  children?: ReactNode;
} & Omit<ComponentProps<'div'>, 'title'>;

/** Minimal callout for MDX: title and body only, no icon. */
export function DocsCallout(props: DocsCalloutProps) {
  const rest = { ...props };
  delete rest.emoji;
  delete rest.icon;
  const { title, type: inputType = 'info', children, className, ...forward } =
    rest;
  const type = resolveType(inputType);

  return (
    <DocsAside
      // SAFETY: Boundary value matches the asserted domain type at this call site.
      variant={type as DocsAsideVariant}
      title={title}
      className={className}
      {...forward}
    >
      {children}
    </DocsAside>
  );
}

export { DocsCallout as Callout };
