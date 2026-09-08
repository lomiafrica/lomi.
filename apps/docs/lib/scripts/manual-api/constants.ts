/* @proprietary license */

/** Public merchant HTTP API only; omit internal/agent routes from curated docs coverage. */
export const AGENT_OPENAPI_PREFIX = '/agent';

/** Concept pages above the resource folders in the API sidebar. */
export const REST_API_CONCEPT_PAGES = [
  'index',
  'authentication',
  'errors',
  'data-models',
] as const;

/** Theme groups in the API sidebar (English separators; French lives in meta.fr.json). */
export const REST_API_SIDEBAR_GROUPS = [
  {
    separator: '---Accept payments---',
    folders: [
      'checkout-sessions',
      'payment-links',
      'payment-requests',
      'invoices',
      'charge',
    ],
  },
  {
    separator: '---Manage commerce---',
    folders: ['customers', 'products', 'subscriptions', 'coupons'],
  },
  {
    separator: '---Move money---',
    folders: [
      'balances',
      'transactions',
      'refunds',
      'payouts',
      'payout-methods',
      'settlements',
    ],
  },
  {
    separator: '---Platform---',
    folders: ['organizations', 'team', 'settings', 'merchants', 'providers'],
  },
  {
    separator: '---Operations---',
    folders: [
      'disputes',
      'support-requests',
      'risk-assessments',
      'webhooks',
      'logs',
      'meters',
      'usage',
      'exports',
      'finance',
      'api-keys',
      'account',
    ],
  },
] as const;

/** Section folder order matches sidebar (first URL segment → folder name). */
export const REST_API_SECTION_ORDER = REST_API_SIDEBAR_GROUPS.flatMap(
  (group) => group.folders,
);

export function restApiRootSidebarPages(
  existingFolders: ReadonlySet<string>,
): string[] {
  const pages: string[] = [...REST_API_CONCEPT_PAGES];
  for (const group of REST_API_SIDEBAR_GROUPS) {
    const folders = group.folders.filter((folder) =>
      existingFolders.has(folder),
    );
    if (folders.length === 0) continue;
    pages.push(group.separator, ...folders);
  }
  return pages;
}

const PUBLIC_REST_API_OPERATIONS = [
  'GET /accounts/balance',
  'GET /accounts/balance/breakdown',
  'GET /accounts/balance/{currency}',
  'POST /charge/card',
  'GET /charge/card/{id}',
  'POST /charge/card/{id}/cancel',
  'POST /charge/mtn',
  'POST /charge/switch',
  'POST /charge/wave',
  'checkout-sessions',
  'customers',
  'coupons',
  'payment-links',
  'payment-requests',
  'payouts',
  'settlements',
  'products',
  'refunds',
  'disputes',
  'support-requests',
  'risk-assessments',
  'subscriptions',
  'transactions',
  'webhooks',
  'logs',
  'organizations',
  'merchants',
  'providers',
  'meters',
  'usage',
  'invoices',
  'exports',
  'finance',
  'payout-methods',
  'api-keys',
  'team',
  'settings',
  'account',
] as const;

export type RestApiFolder = (typeof REST_API_SECTION_ORDER)[number];

function operationKey(method: string, route: string): string {
  return `${method.toUpperCase()} ${route}`;
}

function routeHasPublicOperation(route: string): boolean {
  return PUBLIC_REST_API_OPERATIONS.some((entry) => {
    if (entry.includes(' ')) return entry.endsWith(` ${route}`);
    return route === `/${entry}` || route.startsWith(`/${entry}/`);
  });
}

export function pathToFolder(route: string): string {
  const parts = route.split('/').filter(Boolean);
  const first = parts[0];
  if (!first) return 'general';
  if (first === 'accounts') return 'balances';
  if (first === 'logs') return 'logs';
  return first;
}

export function isAgentRoute(route: string): boolean {
  return (
    route.startsWith(`${AGENT_OPENAPI_PREFIX}/`) ||
    route === AGENT_OPENAPI_PREFIX
  );
}

export function isPublicRestApiRoute(route: string): boolean {
  return !isAgentRoute(route) && routeHasPublicOperation(route);
}

export function isPublicRestApiOperation(
  method: string,
  route: string,
): boolean {
  const key = operationKey(method, route);
  return PUBLIC_REST_API_OPERATIONS.some((entry) => {
    if (entry.includes(' ')) return entry === key;
    return route === `/${entry}` || route.startsWith(`/${entry}/`);
  });
}
