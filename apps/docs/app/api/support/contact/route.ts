/* @proprietary license */

import { NextResponse } from 'next/server';
import { isJsonObject, isString, type JsonObject } from '@lomi./shared';

function isContactEmail(value: string): boolean {
  if (value.length < 3 || value.length > 254) return false;
  const at = value.indexOf('@');
  if (at <= 0 || at !== value.lastIndexOf('@')) return false;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  const dot = domain.indexOf('.');
  return (
    local.length > 0 &&
    !local.includes(' ') &&
    dot > 0 &&
    dot < domain.length - 1 &&
    !domain.includes(' ')
  );
}
const ALLOWED_ORIGINS = [
  'https://docs.lomi.africa',
  'http://localhost:3000',
  'http://localhost:3002',
];
const TOPICS = new Set([
  'general',
  'billing',
  'integration',
  'abuse',
  'security',
]);

const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || current.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= 5) return false;
  current.count += 1;
  return true;
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return process.env.NODE_ENV !== 'production';
  if (process.env.NODE_ENV !== 'production') return true;
  return ALLOWED_ORIGINS.includes(origin);
}

async function verifyTurnstile(input: {
  token: string | undefined;
  remoteIp: string;
  expectedAction: string;
}): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  if (!input.token) return false;
  const body = new URLSearchParams({
    secret,
    response: input.token,
  });
  if (input.remoteIp !== 'unknown') body.set('remoteip', input.remoteIp);
  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    },
  );
  if (!res.ok) return false;
  const json: unknown = await res.json();
  if (!isJsonObject(json) || json.success !== true) return false;
  if (isString(json.action) && json.action !== input.expectedAction) {
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  if (process.env.NODE_ENV === 'production' && !isAllowedOrigin(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const forwarded = req.headers.get('x-forwarded-for');
  const ip =
    req.headers.get('x-real-ip') ||
    forwarded?.split(',')[0]?.trim() ||
    'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!isJsonObject(body)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const payload: JsonObject = body;
  if (isString(payload.website) && payload.website.trim().length > 0) {
    return NextResponse.json({ success: true, reference: 'ok' });
  }

  const name = isString(payload.name) ? payload.name.trim() : '';
  const email = isString(payload.email) ? payload.email.trim() : '';
  const message = isString(payload.message) ? payload.message.trim() : '';
  const topic = isString(payload.topic) ? payload.topic.trim() : 'general';
  const fileReference = isString(payload.fileReference)
    ? payload.fileReference.trim()
    : '';
  const locale = payload.locale === 'fr' ? 'fr' : 'en';
  const turnstileToken = isString(payload.turnstileToken)
    ? payload.turnstileToken
    : undefined;

  if (
    !name ||
    name.length > 200 ||
    !isContactEmail(email) ||
    !message ||
    message.length < 10 ||
    message.length > 8000 ||
    !TOPICS.has(topic)
  ) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstile({
    token: turnstileToken,
    remoteIp: ip,
    expectedAction:
      topic === 'security' ? 'security_contact' : 'support_contact',
  });
  if (!turnstileOk) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }

  const secret = process.env.WEBSITE_EMAILS_SECRET;
  const apiBase = (
    process.env.LOMI_API_URL ||
    process.env.API_URL ||
    'https://api.lomi.africa'
  ).replace(/\/$/, '');

  const reference = `docs-${Date.now().toString(36)}`;
  const composed = [
    `Topic: ${topic}`,
    fileReference ? `Reference: ${fileReference}` : null,
    `Docs reference: ${reference}`,
    '',
    message,
  ]
    .filter(Boolean)
    .join('\n');

  if (!secret) {
    console.error('WEBSITE_EMAILS_SECRET is not configured for docs support');
    return NextResponse.json(
      { error: 'Support form is unavailable. Email hello@lomi.africa.' },
      { status: 503 },
    );
  }

  const res = await fetch(`${apiBase}/website/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-website-emails-secret': secret,
    },
    body: JSON.stringify({
      source: 'contact',
      name,
      email,
      message: composed,
      locale,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
  }

  return NextResponse.json({ success: true, reference });
}
