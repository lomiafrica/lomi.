/* @proprietary license */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { tryitPreferenceCookieOptions } from '@/lib/tryit/cookie-options';
import {
  COOKIE_TRYIT_ORG,
  COOKIE_TRYIT_USE_TEST_KEY,
} from '@/lib/tryit/constants';
import { docsApiGet, getDocsSessionToken } from '@/lib/docs-session';
import { isJsonObject, readBoolean } from '@lomi./shared';

const bodySchema = z.object({
  useTestKey: z.boolean(),
  organizationId: z.string().uuid().nullable().optional(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { useTestKey, organizationId: rawOrg } = parsed.data;
  const organizationId = rawOrg ?? null;

  const token = await getDocsSessionToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (organizationId) {
    const access = await docsApiGet(
      `/auth/docs-session/org-access?organizationId=${encodeURIComponent(organizationId)}`,
      token,
    );
    if (!access || !isJsonObject(access) || !readBoolean(access, 'allowed')) {
      return NextResponse.json(
        { error: 'Organization not allowed or no test secret key' },
        { status: 403 },
      );
    }
  }

  const opts = tryitPreferenceCookieOptions();
  const res = NextResponse.json({ ok: true });

  res.cookies.set(
    COOKIE_TRYIT_USE_TEST_KEY,
    useTestKey ? 'true' : 'false',
    opts,
  );

  if (organizationId) {
    res.cookies.set(COOKIE_TRYIT_ORG, organizationId, opts);
  } else {
    res.cookies.set(COOKIE_TRYIT_ORG, '', { ...opts, maxAge: 0 });
  }

  return res;
}
