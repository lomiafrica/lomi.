/* @proprietary license */

import { cookies } from 'next/headers';
import { docsApiGet, getDocsSessionToken } from '@/lib/docs-session';
import {
  isJsonArray,
  isJsonObject,
  readString,
} from '@lomi./shared';
import { COOKIE_TRYIT_ORG } from '@/lib/tryit/constants';
import { parseTryitOrgId, selectTryitOrganizationId } from '@/lib/tryit/gating';

type TryitSessionContext = {
  signedIn?: boolean;
  organizations: { id: string; name: string }[];
};

export async function resolveTryitInjectionContext(): Promise<{
  shouldInjectTestKey: boolean;
  activeOrganizationId: string | null;
}> {
  const token = await getDocsSessionToken();
  if (!token) {
    return { shouldInjectTestKey: false, activeOrganizationId: null };
  }

  const jar = await cookies();
  const cookieOrg = parseTryitOrgId(jar.get(COOKIE_TRYIT_ORG)?.value);
  if (cookieOrg) {
    return { shouldInjectTestKey: true, activeOrganizationId: cookieOrg };
  }

  const context = await docsApiGet(
    '/auth/docs-session/tryit-context',
    token,
  );
  const organizations: TryitSessionContext['organizations'] = [];
  if (context && isJsonObject(context) && isJsonArray(context.organizations)) {
    for (const item of context.organizations) {
      if (!isJsonObject(item)) continue;
      const id = readString(item, 'id');
      const name = readString(item, 'name');
      if (id && name) organizations.push({ id, name });
    }
  }
  return {
    shouldInjectTestKey: true,
    activeOrganizationId: selectTryitOrganizationId(organizations, null),
  };
}
