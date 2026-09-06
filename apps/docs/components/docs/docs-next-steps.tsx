/* @proprietary license */

'use client';

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { translate } from '@/lib/i18n/translations';
import { useTranslation } from '@/lib/utils/translation-context';

export const DOCS_NEXT_STEPS_MAX = 4;

export type DocsNextStepProps = {
  href: string;
  hint?: string;
  children: ReactNode;
};

function isDocsNextStep(
  node: ReactNode,
): node is ReactElement<DocsNextStepProps> {
  return isValidElement(node) && node.type === DocsNextStep;
}

function collectSteps(children: ReactNode): DocsNextStepProps[] {
  const steps: DocsNextStepProps[] = [];
  Children.forEach(children, (child) => {
    if (!isDocsNextStep(child)) return;
    steps.push(child.props);
  });
  return steps.slice(0, DOCS_NEXT_STEPS_MAX);
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function padIndex(index: number): string {
  return String(index + 1).padStart(2, '0');
}

/** Marker collected by `DocsNextSteps`. Do not render on its own. */
export function DocsNextStep(props: DocsNextStepProps) {
  void props;
  return null;
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
  const steps = collectSteps(children);

  if (steps.length === 0) return null;

  return (
    <nav className="docs-next not-prose" aria-labelledby={headingId}>
      <p className="docs-next-label" id={headingId}>
        {heading}
      </p>
      <ol className="docs-next-list">
        {steps.map((step, index) => {
          const indexLabel = padIndex(index);
          const className = 'docs-next-item';
          const body = (
            <>
              <span className="docs-next-index" aria-hidden="true">
                {indexLabel}
              </span>
              <span className="docs-next-copy">
                <span className="docs-next-title">{step.children}</span>
                {step.hint ? (
                  <span className="docs-next-hint">{step.hint}</span>
                ) : null}
              </span>
            </>
          );

          return (
            <li key={`${step.href}-${indexLabel}`} className="docs-next-row">
              {isExternalHref(step.href) ? (
                <a className={className} href={step.href}>
                  {body}
                </a>
              ) : (
                <Link className={className} href={step.href}>
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
