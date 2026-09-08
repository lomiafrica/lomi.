/* @proprietary license */

export type DocsSearchTag = 'start' | 'build' | 'api' | 'resources';

/** Map the top-level docs section to the search-dialog filter chips. */
export function searchTagFromSection(
  section: string | undefined,
): DocsSearchTag | undefined {
  switch (section) {
    case 'start':
    case 'build':
    case 'api':
    case 'resources':
      return section;
    default:
      return undefined;
  }
}
