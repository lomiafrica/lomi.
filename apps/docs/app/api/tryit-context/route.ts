/* @proprietary license */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_TRYIT_ORG } from '@/lib/tryit/constants';
import { tryitPreferenceCookieOptions } from '@/lib/tryit/cookie-options';
import { docsApiGet, getDocsSessionToken } from '@/lib/docs-session';
import { resolveTestSecretApiKey } from '@/lib/resolve-test-api-key';
import { selectTryitOrganizationId } from '@/lib/tryit/gating';

type TryitContextResponse = {
  signedIn: boolean;
  userId?: string;
  organizations: { id: string; name: string }[];
};

export async function GET() {
  const token = await getDocsSessionToken();
  const c = await cookies();
  const cookieOrg = c.get(COOKIE_TRYIT_ORG)?.value ?? null;

  if (!token) {
    return NextResponse.json({
      signedIn: false,
      organizations: [] as { id: string; name: string }[],
      selectedOrganizationId: null as string | null,
      needsOrganizationChoice: false,
      testApiKey: null as string | null,
      pricingPlan: null,
      volumeTier: null,
    });
  }

  const context = await docsApiGet<TryitContextResponse>(
    '/auth/docs-session/tryit-context',
    token,
  );

  const organizations = context?.organizations ?? [];

  if (!context?.signedIn || organizations.length === 0) {
    return NextResponse.json({
      signedIn: Boolean(context?.signedIn),
      organizations,
      selectedOrganizationId: null,
      needsOrganizationChoice: false,
      testApiKey: null,
      pricingPlan: null,
      volumeTier: null,
    });
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
