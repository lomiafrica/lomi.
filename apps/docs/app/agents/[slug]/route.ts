/* @proprietary license */

import { buildAgentCorpusForSlug } from '@/lib/docs/agent-corpus/build';

export const revalidate = false;

const HEADERS = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'public, max-age=86400',
  'X-Robots-Tag': 'noindex',
} as const;

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const body = buildAgentCorpusForSlug(slug);
  if (!body) {
    return new Response('Not found', { status: 404, headers: HEADERS });
  }
  return new Response(body, { headers: HEADERS });
}
