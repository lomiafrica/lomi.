/* @proprietary license */

import { NextRequest, NextResponse } from 'next/server';
import {
  docsSessionCookieName,
  docsSessionCookieOptions,
  getApiBaseUrl,
} from '@/lib/docs-session';
import {
  DOCS_HANDOFF_FALLBACK,
  safeDocsHandoffNext,
} from '@/lib/tryit/handoff-next';
import {
  isJsonObject,
  readNumber,
  readString,
  validateJsonValue,
} from '@lomi./shared';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const next = safeDocsHandoffNext(req.nextUrl.searchParams.get('next'));
  const fallback = req.nextUrl.clone();
  fallback.pathname = DOCS_HANDOFF_FALLBACK;
  fallback.search = '';

  if (!code || !code.startsWith('lomi_bh_')) {
    return NextResponse.redirect(fallback);
  }

  const consume = await fetch(`${getApiBaseUrl()}/auth/docs-handoff/consume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: req.nextUrl.origin,
    },
    body: JSON.stringify({ code }),
  });

  if (!consume.ok) {
    return NextResponse.redirect(fallback);
  }

  const parsed = validateJsonValue(await consume.json());
  if (!isJsonObject(parsed)) {
    return NextResponse.redirect(fallback);
  }
  const payload = {
    session_token: readString(parsed, 'session_token'),
    expires_in: readNumber(parsed, 'expires_in'),
  };
  if (!payload.session_token) {
    return NextResponse.redirect(fallback);
  }

  const dest = req.nextUrl.clone();
  dest.pathname = next;
  dest.search = '';
  const res = NextResponse.redirect(dest);
  res.cookies.set(
    docsSessionCookieName(),
    payload.session_token,
    docsSessionCookieOptions(payload.expires_in),
  );
  return res;
}
