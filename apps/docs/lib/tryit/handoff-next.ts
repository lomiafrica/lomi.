/* @proprietary license */

export const DOCS_HANDOFF_FALLBACK = '/api';

/** Same-origin docs path after consuming a dashboard handoff code. */
export function safeDocsHandoffNext(next: string | null | undefined): string {
  if (!next) return DOCS_HANDOFF_FALLBACK;
  if (!next.startsWith('/') || next.startsWith('//')) {
    return DOCS_HANDOFF_FALLBACK;
  }
  if (next.includes('://')) return DOCS_HANDOFF_FALLBACK;
  return next;
}
