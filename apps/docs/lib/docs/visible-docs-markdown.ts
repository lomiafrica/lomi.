/* @proprietary license */

/** Client-only. Visible article text used when source markdown is not cached yet. */
export function getVisibleDocsMarkdown(): string {
  const title =
    document.querySelector('.docs-page-title')?.textContent?.trim() ||
    document.title;
  const description =
    document.querySelector('.docs-page-description')?.textContent?.trim() ?? '';
  const article =
    document.querySelector<HTMLElement>('#nd-page article') ??
    document.querySelector<HTMLElement>('article');
  const body = article?.innerText?.trim() ?? '';
  const parts = [`# ${title}`, window.location.href];
  if (description) parts.push(description);
  if (body) parts.push(body);
  return parts.join('\n\n');
}
