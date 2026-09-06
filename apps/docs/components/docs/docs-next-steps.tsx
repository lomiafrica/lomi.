/* @proprietary license */

'use client';

import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import Link from 'fumadocs-core/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@lomi./ui/cn';
import { translate } from '@/lib/i18n/translations';
import { useTranslation } from '@/lib/utils/translation-context';

export const DOCS_NEXT_STEPS_MAX = 4;

export type DocsNextStepProps = {
  href: string;
  hint?: string;
  children: ReactNode;
  align?: 'start' | 'end';
};

function collectStepElements(children: ReactNode): ReactElement[] {
  const steps: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    steps.push(child);
  });
  return steps.slice(0, DOCS_NEXT_STEPS_MAX);
}

/** Same chrome as fumadocs-ui page FooterItem (previous / next). */
export function DocsNextStep({
  href,
  hint,
  children,
  align = 'start',
}: DocsNextStepProps) {
  const end = align === 'end';
  const Icon = end ? ChevronRight : ChevronLeft;

  return (
    <Link
      href={href}
      className={cn(
        'docs-next-item flex flex-col gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground @max-lg:col-span-full',
        end && 'text-end',
      )}
    >
      <div
        className={cn(
          'inline-flex items-center gap-1.5 font-medium [&_p]:m-0',
          end && 'flex-row-reverse',
        )}
      >
        <Icon className="-mx-1 size-4 shrink-0 rtl:rotate-180" />
        {children}
      </div>
      {hint ? (
        <p className="truncate text-fd-muted-foreground">{hint}</p>
      ) : null}
    </Link>
  );
}

type DocsNextStepsProps = {
  children?: ReactNode;
  title?: string;
};

/** Page-end destinations. Same chrome as the previous / next page switcher. */
export function DocsNextSteps({ children, title }: DocsNextStepsProps) {
  const { currentLanguage } = useTranslation();
  const heading = title ?? translate('next.title', currentLanguage);
  const steps = collectStepElements(children);

  if (steps.length === 0) return null;

  return (
    <nav
      className={cn(
        'docs-next not-prose @container grid gap-4',
        steps.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
      )}
      aria-label={heading}
    >
      {steps.map((step, index) =>
        cloneElement(step as ReactElement<DocsNextStepProps>, {
          key: (step.props as DocsNextStepProps).href ?? String(index),
          align: index % 2 === 1 ? 'end' : 'start',
        }),
      )}
    </nav>
  );
}
