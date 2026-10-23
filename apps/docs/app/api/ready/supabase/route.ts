import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/auth/v1/settings`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: 503 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
