/* @proprietary license */

import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { remarkAutoTypeTable } from 'fumadocs-typescript';
import { remarkInclude } from 'fumadocs-mdx/config';
import { type Page } from '@/lib/utils/source';
import { getDocsSiteOrigin } from '@/lib/utils/metadata';
import { remarkNpm } from 'fumadocs-core/mdx-plugins';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isJsonObject, isString, readString } from '@lomi./shared';

const processor = remark()
  .use(remarkMdx)
  .use(remarkInclude)
  .use(remarkGfm)
  .use(remarkAutoTypeTable)
  .use(remarkNpm);

type NodeErrno = {
  code?: string;
};

function isEnoent(error: Error | NodeErrno): boolean {
  if (error instanceof Error) {
    return 'code' in error && isString(error.code) && error.code === 'ENOENT';
  }
  return error.code === 'ENOENT';
}

function resolvePageFile(page: Page): string {
  if (!page.absolutePath) {
    throw new Error(`Page ${page.url} has no absolutePath`);
  }
  if (path.isAbsolute(page.absolutePath)) {
    return page.absolutePath;
  }
  return path.join(/*turbopackIgnore: true*/ process.cwd(), page.absolutePath);
}

async function readPageMdx(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (error instanceof Error) {
      if (!isEnoent(error)) throw error;
    } else if (isJsonObject(error)) {
      if (readString(error, 'code') !== 'ENOENT') throw error;
    } else {
      throw error;
    }
    const englishFallback = filePath.replace(/\.fr\.mdx$/i, '.mdx');
    if (englishFallback !== filePath) {
      return await fs.readFile(englishFallback, 'utf8');
    }
    throw error;
  }
}

export async function getLLMText(page: Page) {
  const filePath = resolvePageFile(page);
  const processed = await processor.process({
    path: filePath,
    value: await readPageMdx(filePath),
  });

  const origin = getDocsSiteOrigin();

  return `# ${page.data.title}
Source: ${origin}${page.url}

${page.data.description ?? ''}

${processed.value}`;
}

/** Title and description only, when the MDX file is missing from the runtime bundle. */
export function getLLMTextFallback(page: Page): string {
  const origin = getDocsSiteOrigin();
  return `# ${page.data.title}
Source: ${origin}${page.url}

${page.data.description ?? ''}
`;
}
