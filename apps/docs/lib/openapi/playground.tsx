/* @proprietary license */

import fs from 'node:fs/promises';
import path from 'node:path';
import { parseJson } from '@lomi./shared';
import { DocsApiPlaygroundClient } from '@/components/docs/docs-api-playground';
import { sandboxOnlyOpenApiDocument } from '@/lib/openapi/sandbox-document';
import { getTryItOperation } from '@/lib/openapi/operation-tryit';

const OPENAPI_PATH = path.join(process.cwd(), 'openapi.json');
const SANDBOX_ORIGIN = 'https://sandbox.api.lomi.africa';

type SandboxDocument = ReturnType<typeof sandboxOnlyOpenApiDocument>;

let sandboxDocumentPromise: Promise<SandboxDocument> | null = null;

function loadSandboxDocument(): Promise<SandboxDocument> {
  if (!sandboxDocumentPromise) {
    sandboxDocumentPromise = fs
      .readFile(OPENAPI_PATH, 'utf8')
      .then((text) => sandboxOnlyOpenApiDocument(parseJson(text)));
  }
  return sandboxDocumentPromise;
}

type DocsApiPlaygroundProps = {
  method: string;
  path: string;
};

export async function DocsApiPlayground({
  method,
  path: route,
}: DocsApiPlaygroundProps) {
  const document = await loadSandboxDocument();
  const operation = getTryItOperation(document, method, route, SANDBOX_ORIGIN);
  if (!operation) return null;

  return <DocsApiPlaygroundClient operation={operation} />;
}
