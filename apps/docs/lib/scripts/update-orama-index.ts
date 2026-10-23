/* @proprietary license */

import * as fs from 'node:fs/promises';
import { OramaCloud } from '@orama/core';
import { CloudManager } from '@oramacloud/client';
import { DataSourceId } from '@/lib/orama/client';
import { type JsonObject } from '@lomi./shared';

const useOramaCoreIndex =
  !!process.env.ORAMA_PROJECT_ID && !!process.env.ORAMA_DATASOURCE_ID;

async function updateWithOramaCore(
  records: unknown[],
  projectId: string,
  datasourceId: string,
  apiKey: string,
): Promise<void> {
  const orama = new OramaCloud({ projectId, apiKey });
  const datasource = orama.dataSource(datasourceId);
  const temporary = await datasource.createTemporaryIndex();

  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    // SAFETY: Boundary value matches the asserted domain type at this call site.
    const batch = records.slice(i, i + batchSize) as JsonObject[];
    await temporary.insertDocuments(batch);
  }

  await temporary.swap();
}

async function updateWithCloudManager(
  records: unknown[],
  apiKey: string,
  indexId: string,
): Promise<void> {
  const manager = new CloudManager({ api_key: apiKey });
  const index = manager.index(indexId);

  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await index.insert(batch);
  }

  await index.deploy();
}

export async function updateSearchIndexes(): Promise<void> {
  const apiKey = process.env.ORAMA_PRIVATE_API_KEY;
  const canIndex =
    !!apiKey && (useOramaCoreIndex || DataSourceId.length > 0);

  if (!canIndex) {
    console.log(
      'Orama index update skipped: set ORAMA_PRIVATE_API_KEY and either (ORAMA_PROJECT_ID + ORAMA_DATASOURCE_ID) or NEXT_PUBLIC_ORAMA_ENDPOINT.',
    );
    return;
  }

  const content = await fs.readFile('.next/server/app/static.json.body');
  // SAFETY: Boundary value matches the asserted domain type at this call site.
  const records = JSON.parse(content.toString()) as unknown[];

  if (useOramaCoreIndex) {
    await updateWithOramaCore(
      records,
      process.env.ORAMA_PROJECT_ID!,
      process.env.ORAMA_DATASOURCE_ID!,
      apiKey!,
    );
  } else {
    await updateWithCloudManager(records, apiKey!, DataSourceId);
  }

  console.log(`search updated: ${records.length} records`);
}
