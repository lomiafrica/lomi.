/* @proprietary license */

'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

const HASH_WAIT_MS = 4000;

function hashId(): string {
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return '';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function scrollToHash(): boolean {
  const id = hashId();
  if (!id) return true;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: 'auto', block: 'start' });
  return true;
}

export function DocsHashScroll() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (scrollToHash()) {
      const onHashChange = () => {
        scrollToHash();
      };
      window.addEventListener('hashchange', onHashChange);
      return () => {
        window.removeEventListener('hashchange', onHashChange);
      };
    }

    const observer = new MutationObserver(() => {
      if (scrollToHash()) observer.disconnect();
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    const timeout = window.setTimeout(() => observer.disconnect(), HASH_WAIT_MS);
    const onHashChange = () => {
      if (scrollToHash()) observer.disconnect();
    };
    window.addEventListener('hashchange', onHashChange);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [pathname]);

  return null;
}
