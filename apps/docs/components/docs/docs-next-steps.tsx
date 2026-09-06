/* @proprietary license */

'use client';

import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import Link from 'next/link';
import { translate } from '@/lib/i18n/translations';
import { useTranslation } from '@/lib/utils/translation-context';

export const DOCS_NEXT_STEPS_MAX = 4;

export type DocsNextStepProps = {
  href: string;
  hint?: string;
  children: ReactNode;
};

function collectStepElements(children: ReactNode): ReactElement[] {
  const steps: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    steps.push(child);
  });
  return steps.slice(0, DOCS_NEXT_STEPS_MAX);
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function DocsNextStep({ href, hint, children }: DocsNextStepProps) {
  const className = 'docs-next-item';
  const body = (
    <>
      <span className="docs-next-index" aria-hidden="true" />
      <span className="docs-next-copy">
        <span className="docs-next-title">{children}</span>
        {hint ? <span className="docs-next-hint">{hint}</span> : null}
      </span>
    </>
  );

  return (
    <li className="docs-next-row">
      {isExternalHref(href) ? (
        <a className={className} href={href}>
          {body}
        </a>
      ) : (
        <Link className={className} href={href}>
          {body}
        </Link>
      )}
    </li>
  );
}

type DocsNextStepsProps = {
  children?: ReactNode;
  title?: string;
};

/** Page-end destinations. Cap is 4. No groups, no sitemap. */
export function DocsNextSteps({ children, title }: DocsNextStepsProps) {
  const { currentLanguage } = useTranslation();
  const heading = title ?? translate('next.title', currentLanguage);
  const headingId = 'docs-next-steps';
  const steps = collectStepElements(children);

  if (steps.length === 0) return null;

  return (
    <nav className="docs-next not-prose" aria-labelledby={headingId}>
      <p className="docs-next-label" id={headingId}>
        {heading}
      </p>
      <ol className="docs-next-list">{steps}</ol>
    </nav>
  );
}
