/* @proprietary license */

/** Internal Next.js / docs-app routes that must stay out of search indexes. */
export const ROBOTS_DISALLOW = [
  '/api/search',
  '/api/proxy',
  '/api/tryit-context',
  '/api/tryit-prefs',
  '/api/support/',
  '/tryit/',
  '/l/',
  '/_next/',
] as const;

/** Discovery surfaces crawlers and agents should keep. */
export const ROBOTS_ALLOW = [
  '/',
  '/llms.txt',
  '/llms-full.txt',
  '/agents',
  '/agents.md',
  '/openapi.json',
  '/agent-openapi.json',
  '/static.json',
  '/.well-known/',
] as const;

export function isRobotsDisallowedPath(pathname: string): boolean {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return ROBOTS_DISALLOW.some((rule) => {
    if (rule.endsWith('/')) {
      return path === rule.slice(0, -1) || path.startsWith(rule);
    }
    return path === rule || path.startsWith(`${rule}/`);
  });
}
