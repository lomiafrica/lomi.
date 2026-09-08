/* @proprietary license */

import { cookies } from 'next/headers';
import { validateJsonValue, type JsonValue } from '@lomi./shared';

const DEFAULT_API_URL = 'https://api.lomi.africa';

export function docsSessionCookieName(): string {
  return process.env.NODE_ENV === 'production'
    ? '__Host-lomi-docs-session'
    : 'lomi_docs_session';
}

export function docsSessionCookieOptions(maxAgeSec = 60 * 60 * 8) {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
    secure: isProduction,
    maxAge: maxAgeSec,
  };
}

export function getApiBaseUrl(): string {
  const url = process.env.LOMI_API_URL?.trim() || process.env.API_URL?.trim();
  return url && url.length > 0 ? url.replace(/\/$/, '') : DEFAULT_API_URL;
}

export async function getDocsSessionToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(docsSessionCookieName())?.value ?? null;
}

export async function docsApiGet(
  path: string,
  token: string,
): Promise<JsonValue | null> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) return null;
  return validateJsonValue(await response.json());
}
