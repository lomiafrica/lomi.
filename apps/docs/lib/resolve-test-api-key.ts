/* @proprietary license */

import { docsApiGet, getDocsSessionToken } from '@/lib/docs-session';
import { isJsonObject, readString } from '@lomi./shared';

export type ResolveTestKeyOptions = {
  activeOrganizationId: string | null;
};

export async function resolveTestSecretApiKey(
  options: ResolveTestKeyOptions,
): Promise<string | null> {
  const token = await getDocsSessionToken();
  if (!token) return null;

  const query = options.activeOrganizationId
    ? `?organizationId=${encodeURIComponent(options.activeOrganizationId)}`
    : '';
  const result = await docsApiGet(`/auth/docs-session/test-key${query}`, token);
  if (!result || !isJsonObject(result)) return null;
  return readString(result, 'api_key') ?? null;
}
