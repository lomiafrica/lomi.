import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { getTransportMode } from './env-config.js';

const ALLOWED_HOST_SUFFIXES = [
  '.lomi.africa',
  '.supabase.co',
  '.supabase.in',
];

function hostAllowed(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === 'lomi.africa' || host === 'pay.lomi.africa') return true;
  return ALLOWED_HOST_SUFFIXES.some(
    (suffix) => host.endsWith(suffix) || host === suffix.slice(1),
  );
}

export async function maybeWriteLocalDownload(input: {
  uri: string;
  name: string;
}): Promise<string | null> {
  if (getTransportMode() === 'http') return null;
  const dir = process.env.LOMI_MCP_DOWNLOAD_DIR?.trim();
  if (!dir) return null;
  let parsed: URL;
  try {
    parsed = new URL(input.uri);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:') return null;
  if (!hostAllowed(parsed.hostname)) return null;
  const safeName = path.basename(input.name).replace(/[^\w.-]+/g, '_') || 'download.pdf';
  const dest = path.join(dir, safeName);
  const response = await fetch(input.uri);
  if (!response.ok) return null;
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length === 0) return null;
  await mkdir(dir, { recursive: true });
  await writeFile(dest, bytes);
  return dest;
}
