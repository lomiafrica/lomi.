import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@lomi./ui/cn';

export type DocsAsideVariant =
  'info' | 'warning' | 'error' | 'success' | 'idea';

type DocsAsideProps = {
  variant: DocsAsideVariant;
  title?: ReactNode;
  children?: ReactNode;
} & Omit<ComponentProps<'div'>, 'title'>;

/** Shared shell for docs callouts. Text only; no icon slot. */
export function DocsAside({
  variant,
  title,
  children,
  className,
  ...props
}: DocsAsideProps) {
  return (
    <div
      className={cn(
        'docs-aside not-prose',
        `docs-aside--${variant}`,
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        {title ? <p className="docs-aside-title">{title}</p> : null}
        {children ? (
          <div
            className={cn(
              'docs-aside-body',
              title ? 'docs-aside-body--titled' : undefined,
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
