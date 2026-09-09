/* @proprietary license */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_TRYIT_ORG } from '@/lib/tryit/constants';
import { tryitPreferenceCookieOptions } from '@/lib/tryit/cookie-options';
import { docsApiGet, getDocsSessionToken } from '@/lib/docs-session';
import { resolveTestSecretApiKey } from '@/lib/resolve-test-api-key';
import { selectTryitOrganizationId } from '@/lib/tryit/gating';
import { isJsonArray, isJsonObject, readString } from '@lomi./shared';

type TryitOrg = { id: string; name: string };

type TryitContextPayload = {
  signedIn: boolean;
  organizations: TryitOrg[];
  selectedOrganizationId: string | null;
  needsOrganizationChoice: boolean;
  testApiKey: string | null;
  pricingPlan: null;
  volumeTier: null;
};

export async function GET() {
  const token = await getDocsSessionToken();
  const c = await cookies();
  const cookieOrg = c.get(COOKIE_TRYIT_ORG)?.value ?? null;

  if (!token) {
    const signedOut: TryitContextPayload = {
      signedIn: false,
      organizations: [],
      selectedOrganizationId: null,
      needsOrganizationChoice: false,
      testApiKey: null,
      pricingPlan: null,
      volumeTier: null,
    };
    return NextResponse.json(signedOut);
  }

  const context = await docsApiGet('/auth/docs-session/tryit-context', token);

  const organizations: TryitOrg[] = [];
  if (context && isJsonObject(context) && isJsonArray(context.organizations)) {
    for (const item of context.organizations) {
      if (!isJsonObject(item)) continue;
      const id = readString(item, 'id');
      const name = readString(item, 'name');
      if (id && name) organizations.push({ id, name });
    }
  }
  const signedIn = Boolean(
    context && isJsonObject(context) && context.signedIn === true,
  );

  if (!signedIn || organizations.length === 0) {
    const payload: TryitContextPayload = {
      signedIn,
      organizations,
      selectedOrganizationId: null,
      needsOrganizationChoice: false,
      testApiKey: null,
      pricingPlan: null,
      volumeTier: null,
    };
    return NextResponse.json(payload);
  }

  const selectedOrganizationId = selectTryitOrganizationId(
    organizations,
    cookieOrg,
  );

  const testApiKey = selectedOrganizationId
    ? await resolveTestSecretApiKey({
        activeOrganizationId: selectedOrganizationId,
      })
    : null;

  const res = NextResponse.json({
    signedIn: true,
    organizations,
    selectedOrganizationId,
    needsOrganizationChoice:
      organizations.length > 1 && selectedOrganizationId === null,
    testApiKey: testApiKey?.startsWith('lomi_sk_test_') ? testApiKey : null,
    pricingPlan: null,
    volumeTier: null,
  });

  if (
    organizations.length === 1 &&
    selectedOrganizationId &&
    cookieOrg !== selectedOrganizationId
  ) {
    res.cookies.set(
      COOKIE_TRYIT_ORG,
      selectedOrganizationId,
      tryitPreferenceCookieOptions(),
    );
  }

  return res;
}
