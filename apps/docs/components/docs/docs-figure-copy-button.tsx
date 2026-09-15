/* @proprietary license */

'use client';

import { useEffect, useState } from 'react';
import { Check, Clipboard } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@lomi./ui/cn';
import { copyTextNow } from '@/lib/docs/copy-text';

function readFigureCode(button: HTMLButtonElement): string {
  const figure = button.closest('figure');
  const pre = figure?.querySelector('pre');
  if (!pre) return '';
  const clone = pre.cloneNode(true);
  if (clone instanceof HTMLElement) {
    clone.querySelectorAll('.nd-copy-ignore').forEach((node) => {
      node.replaceWith('\n');
    });
    return clone.textContent ?? '';
  }
  return pre.textContent ?? '';
}

/** Code-block copy during the click, with execCommand fallback. */
export function DocsFigureCopyButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      data-checked={copied || undefined}
      aria-label={copied ? 'Copied Text' : 'Copy Text'}
      className={cn(
        buttonVariants({
          className:
            'hover:text-fd-accent-foreground data-checked:text-fd-accent-foreground',
          size: 'icon',
        }),
      )}
      onClick={(event) => {
        if (copyTextNow(readFigureCode(event.currentTarget))) setCopied(true);
      }}
    >
      {copied ? <Check /> : <Clipboard />}
    </button>
  );
}
