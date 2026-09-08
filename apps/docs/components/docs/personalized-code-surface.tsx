'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { useDocsWorkspace } from '@/lib/docs/workspace-context';

/** Client layer that swaps test-key placeholders in already-highlighted docs code. */
export function PersonalizedCodeSurface({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const originalHtmlRef = useRef<string | null>(null);
  const { personalizeSnippet, apiKeyResolution } = useDocsWorkspace();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const target =
      root.querySelector('code') ?? root.querySelector('pre') ?? root;
    if (originalHtmlRef.current === null) {
      originalHtmlRef.current = target.innerHTML;
    }
    if (apiKeyResolution.kind === 'placeholder') {
      if (target.innerHTML !== originalHtmlRef.current) {
        target.innerHTML = originalHtmlRef.current;
      }
      return;
    }
    const next = personalizeSnippet(originalHtmlRef.current);
    if (target.innerHTML !== next) {
      target.innerHTML = next;
    }
  }, [personalizeSnippet, apiKeyResolution]);

  return <div ref={rootRef}>{children}</div>;
}
