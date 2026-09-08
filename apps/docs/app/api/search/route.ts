/* @proprietary license */

import { source, type Page } from '@/lib/utils/source';
import { createFromSource } from 'fumadocs-core/search/server';
import type { StructuredData } from 'fumadocs-core/mdx-plugins';
import { searchTagFromSection } from '@/lib/search/tags';
import { isFunction, isJsonObject, isString } from '@lomi./shared';

type DocsPageData = Page['data'];

type StructuredDataLoader = {
  structuredData: () => Promise<StructuredData> | StructuredData;
};

type StructuredDataHolder = {
  structuredData: StructuredData;
};

type LoadablePageData = {
  load: () => Promise<{ structuredData?: StructuredData }>;
};

function isStructuredDataLoader(
  data: DocsPageData,
): data is DocsPageData & StructuredDataLoader {
  return 'structuredData' in data && isFunction(data.structuredData);
}

function isStructuredDataHolder(
  data: DocsPageData,
): data is DocsPageData & StructuredDataHolder {
  if (!('structuredData' in data) || isFunction(data.structuredData)) {
    return false;
  }
  const value = data.structuredData;
  return isJsonObject(value) && 'headings' in value && 'contents' in value;
}

function isLoadablePageData(
  data: DocsPageData,
): data is DocsPageData & LoadablePageData {
  return 'load' in data && isFunction(data.load);
}

async function structuredDataFromPage(
  data: DocsPageData,
): Promise<StructuredData | undefined> {
  if (isStructuredDataLoader(data)) {
    return await data.structuredData();
  }
  if (isStructuredDataHolder(data)) {
    return data.structuredData;
  }
  if (isLoadablePageData(data)) {
    const loaded = await data.load();
    return loaded.structuredData;
  }
  return undefined;
}

export const { GET } = createFromSource(source, {
  localeMap: {
    en: 'english',
    fr: 'french',
  },
  async buildIndex(page) {
    const { data } = page;
    const title = isString(data.title) ? data.title : undefined;
    const description = isString(data.description) ? data.description : undefined;
    const structuredData = await structuredDataFromPage(data);

    if (!structuredData) {
      throw new Error(
        `Cannot find structured data from page ${page.url}, please define the page to index function.`,
      );
    }

    return {
      title: title ?? page.url,
      description,
      url: page.url,
      id: page.url,
      structuredData,
      tag: searchTagFromSection(page.slugs[0]),
    };
  },
});
