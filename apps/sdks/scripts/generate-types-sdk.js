#!/usr/bin/env node
/**
 * Public merchant SDK generator (typed, per-instance services).
 *
 * Emits service classes from apps/docs/openapi.json filtered by:
 * apps/docs/lib/scripts/manual-api/_expected-public-operations.json
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  rmSync,
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  HTTP_WITH_BODY,
  DEFAULT_OPENAPI_PATH,
  DEFAULT_ALLOWLIST_PATH,
  sdkPropertyName,
  pathIds,
  flattenParams,
  wantsBody,
  readSpecAndAllowlist,
  getNormalizedOperations,
  resolveRef,
  LIST_METHOD_NAMES,
  expandSdkManifestMethods,
  withoutHandwrittenServices,
} from './public-sdk-operations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiTypesPath = join(__dirname, '../api-types.ts');
const openapiPath = DEFAULT_OPENAPI_PATH;
const allowlistPath = DEFAULT_ALLOWLIST_PATH;
const outputDir = join(__dirname, '../ts/src/generated');
const isObjectRecord = (value) =>
  value !== null && Object(value) === value && !Array.isArray(value);
const enOverridesPath = join(
  __dirname,
  '../../docs/lib/scripts/manual-api/en-operation-overrides.ts',
);

/** @returns {Record<string, string>} operationId -> English summary */
function loadEnSummaries() {
  /** @type {Record<string, string>} */
  const map = {};
  if (!existsSync(enOverridesPath)) return map;
  const content = readFileSync(enOverridesPath, 'utf-8');
  const re = /(\w+):\s*\{[^}]*?summary:\s*['"]([^'"]+)['"]/gs;
  let m;
  while ((m = re.exec(content))) {
    map[m[1]] = m[2];
  }
  return map;
}

/** @param {string} pathTpl @param {string} httpMethod */
function pathsOpType(pathTpl, httpMethod) {
  const m = httpMethod.toLowerCase();
  return `paths['${pathTpl}']['${m}']`;
}

/** @param {any} op */
function first2xxResponseCode(op) {
  const codes = Object.keys(op.responses ?? {}).filter((c) => /^2/.test(c));
  return codes.sort((a, b) => Number(a) - Number(b))[0] ?? '200';
}

/** @param {any} schema @param {any} spec @param {string} opType @param {'request'|'response'} kind */
function resolveSchemaType(schema, spec, opType, kind) {
  if (schema?.$ref) {
    const name = schema.$ref.split('/').pop();
    if (name) return `components['schemas']['${name}']`;
  }
  if (kind === 'request') {
    return `NonNullable<${opType}['requestBody']>['content']['application/json']`;
  }
  return `(NonNullable<NonNullable<${opType}['responses'][201]>['content']>['application/json'])`;
}

/**
 * @param {string} pathTpl
 * @param {string} httpMethod
 * @param {any} op
 * @param {any} spec
 */
function buildOperationTypes(pathTpl, httpMethod, op, spec) {
  const opType = pathsOpType(pathTpl, httpMethod);
  const code = first2xxResponseCode(op);

  const hasBody = wantsBody(httpMethod, op);
  const reqSchema = op.requestBody?.content?.['application/json']?.schema;
  const bodyType = hasBody
    ? resolveSchemaType(reqSchema, spec, opType, 'request')
    : null;

  const resSchema = op.responses?.[code]?.content?.['application/json']?.schema;
  const responseType = resSchema || op.responses?.[code]?.content?.['application/json']
    ? resSchema?.$ref
      ? resolveSchemaType(resSchema, spec, opType, 'response')
      : `(NonNullable<NonNullable<${opType}['responses'][${code}]>['content']>['application/json'])`
    : 'unknown';

  const queryType = `${opType}['parameters'] extends { query: infer Q } ? Q : Record<string, unknown>`;

  return { bodyType, responseType, queryType, hasBody, code };
}

/**
 * @param {string} httpMethod
 * @param {string} pathTpl
 * @param {any} op
 * @param {string} methodName
 * @param {string} operationId
 * @param {Record<string, string>} enSummaries
 * @param {any} spec
 */
function buildMethodSource(
  httpMethod,
  pathTpl,
  op,
  methodName,
  operationId,
  enSummaries,
  spec,
) {
  const pathItem = spec.paths[pathTpl];
  if (!isObjectRecord(pathItem)) {
    throw new Error(`OpenAPI paths missing "${pathTpl}"`);
  }

  const ids = pathIds(pathTpl);
  const qParams = flattenParams(spec, pathItem, op).filter((q) => q.in === 'query');
  const { bodyType, responseType, queryType, hasBody } = buildOperationTypes(
    pathTpl,
    httpMethod,
    op,
    spec,
  );

  const opt = 'import("../../request-options.js").LomiRequestOptions';
  const argParts = ids.map((id) => `${id}: string`);

  if (hasBody) {
    argParts.push(`body: ${bodyType}`);
    argParts.push(`options?: ${opt}`);
  } else if (httpMethod === 'get' && qParams.length > 0) {
    argParts.push(`params?: ${queryType}`);
    argParts.push(`options?: ${opt}`);
  } else {
    argParts.push(`options?: ${opt}`);
  }

  const args = argParts.join(', ');

  const reqLines = [
    `        return requestWithClient<${responseType}>(this.client, {`,
    `            method: '${httpMethod.toUpperCase()}',`,
    `            url: '${pathTpl}',`,
  ];

  if (ids.length) {
    reqLines.push(
      `            path: { ${ids.map((id) => `${id}: ${id}`).join(', ')} },`,
    );
  }

  if (httpMethod === 'get' && qParams.length > 0) {
    reqLines.push('            query: params,');
    reqLines.push('            ...options,');
  } else if (hasBody) {
    reqLines.push('            body,');
    reqLines.push('            ...options,');
  } else {
    reqLines.push('            ...options,');
  }

  reqLines.push('        });');

  const summary =
    enSummaries[operationId] ?? (op.summary ? String(op.summary) : methodName);

  const desc = [
    '    /**',
    `     * ${summary.replace(/\*\//g, '')}`,
    `     * @see OpenAPI \`${operationId}\``,
    '     */',
    `    public async ${methodName}(${args}): Promise<${responseType}> {`,
    ...reqLines,
    '    }',
  ];

  return desc.join('\n');
}

/** @param {string} methodName @param {string} pathTpl @param {string} httpMethod @param {any} op */
function buildListAllSource(methodName, pathTpl, httpMethod, op, spec) {
  if (!LIST_METHOD_NAMES.has(methodName)) return null;

  const pathItem = spec.paths[pathTpl];
  const qParams = flattenParams(spec, pathItem, op).filter((q) => q.in === 'query');
  const { queryType, responseType } = buildOperationTypes(pathTpl, httpMethod, op, spec);
  const listMethod = methodName;
  const opt = 'import("../../request-options.js").LomiRequestOptions';

  if (qParams.length > 0) {
    return `    /**
     * Auto-paginate all pages from \`${listMethod}\`.
     */
    public async *${listMethod}All(
        params?: ${queryType},
        options?: ${opt},
    ): AsyncGenerator<unknown, void, undefined> {
        let page = (params as { page?: number } | undefined)?.page ?? 1;
        const pageSize = (params as { pageSize?: number } | undefined)?.pageSize ?? 50;

        while (true) {
            const response = await this.${listMethod}(
                { ...params, page, pageSize } as ${queryType},
                options,
            );

            const items =
                (response as { data?: unknown[] })?.data ??
                (response as { items?: unknown[] })?.items;

            if (!Array.isArray(items) || items.length === 0) {
                break;
            }

            for (const item of items) {
                yield item;
            }

            if (items.length < pageSize) {
                break;
            }

            page += 1;
        }
    }`;
  }

  return `    /**
     * Auto-paginate all pages from \`${listMethod}\`.
     */
    public async *${listMethod}All(
        options?: ${opt},
    ): AsyncGenerator<unknown, void, undefined> {
        let page = 1;
        const pageSize = 50;

        while (true) {
            const response = await requestWithClient<${responseType}>(this.client, {
                method: 'GET',
                url: '${pathTpl}',
                query: { page, pageSize },
                ...options,
            });

            const items =
                (response as { data?: unknown[] })?.data ??
                (response as { items?: unknown[] })?.items;

            if (!Array.isArray(items) || items.length === 0) {
                break;
            }

            for (const item of items) {
                yield item;
            }

            if (items.length < pageSize) {
                break;
            }

            page += 1;
        }
    }`;
}

/** @param {string} serviceName @param {{ methodName: string; source: string; listAllSource?: string | null }[]} methods */
function generateServiceClass(serviceName, methods) {
  const sorted = [...methods].sort((a, b) =>
    a.methodName.localeCompare(b.methodName),
  );
  const blocks = sorted
    .map((m) => {
      const parts = [m.source];
      if (m.listAllSource) parts.push(m.listAllSource);
      return parts.join('\n\n');
    })
    .join('\n\n');

  const webhookExtra =
    serviceName === 'WebhooksService'
      ? `

    /**
     * Verify an incoming webhook signature (HMAC SHA-256).
     */
    public verifySignature(
        rawBody: string | Buffer,
        signature: string,
        secret: string,
    ): boolean {
        return verifyWebhookSignature(rawBody, signature, secret);
    }`
      : '';

  const webhookImport =
    serviceName === 'WebhooksService'
      ? `\nimport { verifyWebhookSignature } from '../../webhook-verify.js';`
      : '';

  return `/**
 * ${serviceName}
 * AUTO-GENERATED — public merchant surface from filtered OpenAPI
 */

import type { LomiClient } from '../../client.js';
import { requestWithClient } from '../../http.js';
import type { paths, components } from '../schema.js';${webhookImport}

export class ${serviceName} {
    constructor(private readonly client: LomiClient) {}

${blocks}${webhookExtra}
}
`;
}

function generateTypesFile(apiTypesContent) {
  return `/**
 * API Types
 * AUTO-GENERATED - Do not edit manually
 *
 * Re-exports Database types copied from apps/api.
 */

${apiTypesContent}
`;
}

/**
 * @param {any} spec
 * @param {ReturnType<typeof getNormalizedOperations>['flat']} flatOps
 */
function generateSchemaTypeAliases(spec, flatOps) {
  /** @type {Set<string>} */
  const schemaNames = new Set();

  for (const nop of flatOps) {
    const op = nop.openApiOp;
    const code = first2xxResponseCode(op);

    const collectRef = (ref) => {
      if (!ref || ref.constructor !== String) return;
      const resolved = resolveRef(ref, spec);
      if (ref.includes('/components/schemas/')) {
        const name = ref.split('/').pop();
        if (name) schemaNames.add(name);
      }
    };

    const rb = op.requestBody?.content?.['application/json']?.schema;
    if (rb?.$ref) collectRef(rb.$ref);

    const res = op.responses?.[code]?.content?.['application/json']?.schema;
    if (res?.$ref) collectRef(res.$ref);
  }

  const lines = [...schemaNames].sort().map((name) => {
    const alias = name.replace(/Dto$/, '').replace(/^Create/, 'Create');
    const exportName = name.replace(/Dto$/, '');
    return `export type ${exportName} = components['schemas']['${name}'];`;
  });

  return `/**
 * Ergonomic type aliases for public DTOs
 * AUTO-GENERATED — do not edit manually
 */

import type { components } from './schema.js';

${lines.join('\n')}
`;
}

function generateIndex(servicesSorted) {
  const lines = servicesSorted.map(
    (name) => `export { ${name} } from './services/${name}.js';`,
  );
  return `/**
 * Generated SDK exports
 * AUTO-GENERATED — public merchant surface
 */

export type { paths, components, operations } from './schema.js';
export * from './type-aliases.js';
export * from './types.js';

${lines.join('\n')}
`;
}

function main() {
  console.log('OpenAPI-filtered merchant SDK generation…');

  const enSummaries = loadEnSummaries();
  const { spec, allowed } = readSpecAndAllowlist(openapiPath, allowlistPath);
  const apiTypesContent = readFileSync(apiTypesPath, 'utf-8');

  const { byService: allServices, operations } = getNormalizedOperations(
    spec,
    allowed,
  );
  const byService = withoutHandwrittenServices(allServices);

  /** @type {Map<string, { methodName: string; source: string; listAllSource?: string | null }[]>} */
  const groups = new Map();

  for (const [serviceName, ops] of byService) {
    for (const nop of ops) {
      const source = buildMethodSource(
        nop.httpMethodLower,
        nop.pathTemplate,
        nop.openApiOp,
        nop.sdkMethodName,
        nop.operationId,
        enSummaries,
        spec,
      );
      const listAllSource = buildListAllSource(
        nop.sdkMethodName,
        nop.pathTemplate,
        nop.httpMethodLower,
        nop.openApiOp,
        spec,
      );
      const list = groups.get(serviceName) ?? [];
      list.push({
        methodName: nop.sdkMethodName,
        source,
        listAllSource,
      });
      groups.set(serviceName, list);
    }
  }

  const schemaPath = join(outputDir, 'schema.d.ts');
  const preservedSchema = existsSync(schemaPath)
    ? readFileSync(schemaPath, 'utf-8')
    : null;

  if (existsSync(outputDir)) {
    for (const entry of readdirSync(outputDir)) {
      if (entry === 'schema.d.ts') continue;
      const full = join(outputDir, entry);
      rmSync(full, { recursive: true, force: true });
    }
  } else {
    mkdirSync(outputDir, { recursive: true });
  }

  mkdirSync(join(outputDir, 'services'), { recursive: true });

  if (preservedSchema) {
    writeFileSync(schemaPath, preservedSchema, 'utf-8');
  }

  writeFileSync(join(outputDir, 'types.ts'), generateTypesFile(apiTypesContent));
  writeFileSync(
    join(outputDir, 'type-aliases.ts'),
    generateSchemaTypeAliases(spec, operations),
  );

  const manifest = {};
  const serviceNamesSorted = [...groups.keys()].sort((a, b) => a.localeCompare(b));

  for (const serviceName of serviceNamesSorted) {
    const methods = groups.get(serviceName) ?? [];
    const cls = generateServiceClass(serviceName, methods);
    writeFileSync(join(outputDir, `services/${serviceName}.ts`), cls);
    const propKey = sdkPropertyName(serviceName);
    manifest[propKey] = expandSdkManifestMethods(
      serviceName,
      methods.map((m) => m.methodName),
    );
    console.log(`   ${serviceName}`);
  }

  writeFileSync(join(outputDir, 'index.ts'), generateIndex(serviceNamesSorted));

  writeFileSync(
    join(outputDir, 'sdk-public-methods.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), sdk: manifest }, null, 2)}\n`,
  );

  console.log(
    `\nMerchant SDK OK — ${allowed.length} operations, ${serviceNamesSorted.length} services.`,
  );
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}

export { main as generateTypesSDK };
