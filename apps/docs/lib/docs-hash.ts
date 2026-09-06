/* @proprietary license */

export function docsLinkShouldScroll(href: string): boolean {
  return !href.includes('#');
}
