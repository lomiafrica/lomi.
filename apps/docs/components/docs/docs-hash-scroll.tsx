/* @proprietary license */

'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

const HASH_RETRY_FRAMES = 24;

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

    let frames = 0;
    let raf = 0;
    const tick = () => {
      if (scrollToHash() || frames >= HASH_RETRY_FRAMES) return;
      frames += 1;
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    const onHashChange = () => {
      frames = 0;
      if (!scrollToHash()) {
        window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(tick);
      }
    };
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [pathname]);

  return null;
}
