/* @proprietary license */

import type { ReactNode } from 'react';

export const DOCS_NEXT_STEPS_MAX = 4;

export type DocsNextStepProps = {
  href: string;
  hint?: string;
  children: ReactNode;
  align?: 'start' | 'end';
};

/** Kept so existing MDX compiles. Page chrome is the previous / next footer. */
export function DocsNextStep() {
  return null;
}

/** Kept so existing MDX compiles. Page chrome is the previous / next footer. */
export function DocsNextSteps() {
  return null;
}
