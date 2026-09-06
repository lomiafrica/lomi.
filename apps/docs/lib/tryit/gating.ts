/* @proprietary license */

function normalizePathname(pathname: string): string {
  const withoutQuery = pathname.split('?')[0] ?? pathname;
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
}

/**
 * True for hand-authored REST operation pages (`/api/{resource}/{OperationId}`).
 * Folder indexes and conceptual API guides stay out of Try-it.
 */
export function isDocsApiOperationPath(pathname: string): boolean {
  const parts = normalizePathname(pathname).split('/').filter(Boolean);
  if (parts.length !== 3 || parts[0] !== 'api') return false;
  const operationId = parts[2];
  return operationId !== undefined && /[A-Z]/.test(operationId);
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseTryitOrgId(
  value: string | null | undefined,
): string | null {
  if (!value || !UUID_RE.test(value)) return null;
  return value;
}

export function selectTryitOrganizationId(
  organizations: readonly { id: string }[],
  cookieOrg: string | null | undefined,
): string | null {
  const org = parseTryitOrgId(cookieOrg);
  if (org && organizations.some((item) => item.id === org)) return org;
  if (organizations.length === 1) return organizations[0]!.id;
  return null;
}

export function canAttachTestKey(ctx: {
  signedIn: boolean;
  organizations: readonly { id: string }[];
  selectedOrganizationId: string | null;
}): boolean {
  if (!ctx.signedIn) return false;
  if (ctx.organizations.length === 0) return false;
  if (ctx.organizations.length > 1 && !ctx.selectedOrganizationId) {
    return false;
  }
  return true;
}

export function canSendSandbox(ctx: {
  signedIn: boolean;
  organizations: readonly { id: string }[];
  selectedOrganizationId: string | null;
  hasTestApiKey: boolean;
}): boolean {
  return canAttachTestKey(ctx) && ctx.hasTestApiKey;
}
