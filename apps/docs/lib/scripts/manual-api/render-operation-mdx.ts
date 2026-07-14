/* @proprietary license */

import {
  EN_OPERATION_COPY,
  type EnOperationOverride,
} from '@/lib/scripts/manual-api/en-operation-overrides';
import {
  englishRequestBodyIntro,
  englishResponseDescription,
} from '@/lib/scripts/manual-api/en-http-fallbacks';
import { FR_OPERATION_COPY } from '@/lib/scripts/manual-api/fr-operation-overrides';

type ReferenceObject = { $ref: string };

type ComponentsObject = {
  schemas?: Record<string, SchemaObject | ReferenceObject>;
};

type ParameterObject = {
  name?: string;
  in?: string;
  required?: boolean;
  description?: string;
  schema?: ReferenceObject | Record<string, unknown>;
};

type ResponseObject = {
  description?: string;
};

type OperationObject = {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: (ParameterObject | ReferenceObject)[];
  responses?: Record<string, ResponseObject | ReferenceObject>;
  requestBody?:
    | ReferenceObject
    | {
        description?: string;
        content?: Record<
          string,
          { schema?: ReferenceObject | Record<string, unknown> }
        >;
      };
};

type SchemaObject = {
  type?: string;
  description?: string;
  enum?: unknown[];
  properties?: Record<string, SchemaObject | ReferenceObject>;
  required?: string[];
  items?: SchemaObject | ReferenceObject;
  example?: unknown;
};

type PathItemObject = {
  parameters?: (ParameterObject | ReferenceObject)[];
} & Record<
  string,
  OperationObject | (ParameterObject | ReferenceObject)[] | undefined
>;

const HTTP_OPS = ['get', 'post', 'put', 'patch', 'delete'] as const;
type DocsLanguage = 'en' | 'fr';

type Labels = {
  name: string;
  overview: string;
  authentication: string;
  endpoint: string;
  request: string;
  pathParameters: string;
  queryParameters: string;
  headers: string;
  requestBody: string;
  responses: string;
  errors: string;
  example: string;
  noPathParameters: string;
  noQueryParameters: string;
  noJsonBody: string;
  jsonPayload: string;
  field: string;
  required: string;
  type: string;
  description: string;
  status: string;
  in: string;
  schema: string;
  yes: string;
  no: string;
  exampleBody: string;
  baseUrls: string;
  responseFallback: string;
  authenticationText: string;
  errorsText: string;
  guidanceWhenToUse: string;
  guidanceGoodToKnow: string;
  guidanceSeeAlso: string;
};

function labelsForLanguage(lang: DocsLanguage): Labels {
  if (lang === 'fr') {
    return {
      name: 'Nom',
      overview: 'Aperçu',
      authentication: 'Authentification',
      endpoint: 'Endpoint',
      request: 'Requête',
      pathParameters: 'Paramètres d’URL',
      queryParameters: 'Paramètres de requête',
      headers: 'En-têtes',
      requestBody: 'Corps de la requête',
      responses: 'Réponses',
      errors: 'Erreurs',
      example: 'Exemple',
      noPathParameters: '_Pas d’autre paramètre dans l’URL._\n',
      noQueryParameters: '_Aucun paramètre de requête._\n',
      noJsonBody: '_Pas de corps JSON pour cette opération._',
      jsonPayload: 'Corps JSON.',
      field: 'Champ',
      required: 'Obligatoire',
      type: 'Type',
      description: 'Description',
      status: 'Statut',
      in: 'Emplacement',
      schema: 'Schéma',
      yes: 'Oui',
      no: 'Non',
      exampleBody: 'Exemple de corps :',
      baseUrls: 'URLs de base :',
      responseFallback: '_Voir les réponses OpenAPI pour cette opération._\n',
      authenticationText:
        'Les routes marchandes nécessitent une clé API dans l’en-tête `X-API-KEY` (voir [Vue d’ensemble](/api)). Utilisez une clé **test** avec `${servers[0]}` et une clé **live** avec `${servers[1]}`.',
      errorsText:
        'Les erreurs suivent un format JSON standard. **401** : clé manquante ou invalide. **404** : ressource introuvable. **429** : trop de requêtes. Pour les créations, envoyez une clé d’idempotence si votre flux le permet.',
      guidanceWhenToUse: 'Quand l’utiliser',
      guidanceGoodToKnow: 'À savoir',
      guidanceSeeAlso: 'Voir aussi',
    };
  }

  return {
    name: 'Name',
    overview: 'Overview',
    authentication: 'Authentication',
    endpoint: 'Endpoint',
    request: 'Request',
    pathParameters: 'Path parameters',
    queryParameters: 'Query parameters',
    headers: 'Headers',
    requestBody: 'Request body',
    responses: 'Responses',
    errors: 'Errors',
    example: 'Example',
    noPathParameters: '_No path parameters beyond the URL pattern._\n',
    noQueryParameters: '_No query parameters._\n',
    noJsonBody: '_No application/json body for this operation._',
    jsonPayload: 'JSON request payload.',
    field: 'Field',
    required: 'Required',
    type: 'Type',
    description: 'Description',
    status: 'Status',
    in: 'In',
    schema: 'Schema',
    yes: 'Yes',
    no: 'No',
    exampleBody: 'Example body:',
    baseUrls: 'Base URLs:',
    responseFallback: '_See OpenAPI responses for this operation._\n',
    authenticationText:
      'Merchant routes require an API key in the `X-API-KEY` header (see [Integration overview](/api)). Use a **test** key against `${servers[0]}` and a **live** key against `${servers[1]}`.',
    errorsText:
      'Errors follow the standard JSON error format (status code and machine-readable message). Validate inputs before calling; **401** indicates a missing/invalid key, **404** a missing resource for this organization, **429** rate limiting. For safe retries on create-style calls, send an idempotency key when your flow supports it.',
    guidanceWhenToUse: 'When to use this',
    guidanceGoodToKnow: 'Good to know',
    guidanceSeeAlso: 'See also',
  };
}

/** Avoid MDX `{}` JSX interpretation in free text. */
function escapeMdxText(s: string | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function isRef(o: unknown): o is ReferenceObject {
  return Boolean(o && typeof o === 'object' && '$ref' in (o as object));
}

function isSchemaObject(
  schema: SchemaObject | ReferenceObject | undefined,
): schema is SchemaObject {
  return Boolean(schema && typeof schema === 'object' && !isRef(schema));
}

function getSchemaNameFromRef(ref: string): string {
  const parts = ref.split('/');
  return parts[parts.length - 1] ?? ref;
}

function resolveSchema(
  schema: SchemaObject | ReferenceObject | undefined,
  components: ComponentsObject | undefined,
): SchemaObject | undefined {
  if (!schema) return undefined;
  if (isSchemaObject(schema)) return schema;
  const name = getSchemaNameFromRef(schema.$ref);
  const fromComponents = components?.schemas?.[name];
  if (!fromComponents || isRef(fromComponents)) return undefined;
  return fromComponents;
}

function schemaTypeLabel(
  schema: SchemaObject | ReferenceObject | undefined,
  components: ComponentsObject | undefined,
): string {
  if (!schema) return 'object';
  if (isRef(schema)) return getSchemaNameFromRef(schema.$ref);
  if (schema.enum?.length) {
    const values = schema.enum
      .slice(0, 3)
      .map((v) => JSON.stringify(v))
      .join(', ');
    return `enum (${values}${schema.enum.length > 3 ? ', ...' : ''})`;
  }
  if (schema.type === 'array') {
    return `array<${schemaTypeLabel(schema.items, components)}>`;
  }
  if (schema.type) return schema.type;
  const resolved = resolveSchema(schema, components);
  if (resolved?.type) return resolved.type;
  return 'object';
}

function toSampleValue(
  schema: SchemaObject | ReferenceObject | undefined,
  components: ComponentsObject | undefined,
  depth = 0,
): unknown {
  if (!schema) return 'value';
  if (depth > 3) return '...';
  if (isRef(schema)) {
    return toSampleValue(
      resolveSchema(schema, components),
      components,
      depth + 1,
    );
  }
  if (schema.example !== undefined) return schema.example;
  if (schema.enum && schema.enum.length > 0) return schema.enum[0];
  if (schema.type === 'string') return 'string';
  if (schema.type === 'number' || schema.type === 'integer') return 0;
  if (schema.type === 'boolean') return true;
  if (schema.type === 'array') {
    return [toSampleValue(schema.items, components, depth + 1)];
  }
  if (schema.type === 'object' || schema.properties) {
    const out: Record<string, unknown> = {};
    const properties = schema.properties ?? {};
    const required = new Set(schema.required ?? []);
    const keys = Object.keys(properties);
    const chosen =
      required.size > 0
        ? [...required].filter((k) => k in properties)
        : keys.slice(0, 3);
    for (const key of chosen) {
      out[key] = toSampleValue(properties[key], components, depth + 1);
    }
    return out;
  }
  return 'value';
}

function paramRow(
  p: ParameterObject | ReferenceObject,
  labels: Labels,
): string {
  if ('$ref' in p || !('in' in p)) return '';
  const required = 'required' in p && p.required ? labels.yes : labels.no;
  const schema =
    'schema' in p &&
    p.schema &&
    typeof p.schema === 'object' &&
    '$ref' in p.schema
      ? (((p.schema as ReferenceObject).$ref ?? '').split('/').pop() ?? '')
      : '';
  const desc =
    'description' in p && typeof p.description === 'string'
      ? escapeMdxText(p.description)
      : '';
  const nameCell = '`' + (p.name ?? '') + '`';
  const schemaCell = schema ? `\`${schema}\`` : '-';
  return `| ${nameCell} | ${String(p.in)} | ${required} | ${schemaCell} | ${desc} |`;
}

function parameterSampleValue(p: ParameterObject): string {
  const schema = p.schema;
  if (schema && typeof schema === 'object' && !isRef(schema)) {
    if (Array.isArray(schema.enum) && schema.enum.length > 0) {
      return String(schema.enum[0]);
    }
    if (schema.type === 'number' || schema.type === 'integer') return '1';
    if (schema.type === 'boolean') return 'true';
  }
  return 'value';
}

function responseRows(
  responses: OperationObject['responses'] | undefined,
  lang: DocsLanguage,
): string[] {
  if (!responses) return [];
  const rows: string[] = [];
  for (const [code, res] of Object.entries(responses)) {
    let desc = '';
    if (
      !isRef(res) &&
      typeof res === 'object' &&
      res !== null &&
      'description' in res
    ) {
      const openApiDesc = (res as ResponseObject).description ?? '';
      desc =
        lang === 'en'
          ? escapeMdxText(englishResponseDescription(code, openApiDesc))
          : escapeMdxText(openApiDesc);
    }
    rows.push(`| \`${code}\` | ${desc || '-'} |`);
  }
  return rows;
}

function buildRequestBodySection(
  operation: OperationObject,
  components: ComponentsObject | undefined,
  labels: Labels,
  lang: DocsLanguage,
  enCopy: EnOperationOverride | undefined,
): { section: string; sampleBody: unknown | null } {
  const rb = operation.requestBody;
  if (!rb || isRef(rb)) {
    return {
      sampleBody: null,
      section: [`### ${labels.requestBody}`, '', labels.noJsonBody, ''].join(
        '\n',
      ),
    };
  }

  const desc =
    'description' in rb && typeof rb.description === 'string'
      ? escapeMdxText(
          lang === 'en'
            ? englishRequestBodyIntro(
                rb.description,
                enCopy?.requestBodyIntro,
                labels.jsonPayload,
              )
            : rb.description,
        )
      : '';
  const jsonContent = rb.content?.['application/json'];
  const rawSchema = jsonContent?.schema as
    | SchemaObject
    | ReferenceObject
    | undefined;
  const resolvedSchema = resolveSchema(rawSchema, components);

  const schemaLabel = rawSchema
    ? `\`${schemaTypeLabel(rawSchema, components)}\``
    : '`object`';

  const lines = [
    `### ${labels.requestBody}`,
    '',
    desc || labels.jsonPayload,
    '',
    `${labels.schema}: ${schemaLabel}`,
    '',
  ];

  if (resolvedSchema?.properties) {
    lines.push(
      `| ${labels.field} | ${labels.required} | ${labels.type} | ${labels.description} |`,
    );
    lines.push('| --- | --- | --- | --- |');
    const required = new Set(resolvedSchema.required ?? []);
    for (const [field, fieldSchema] of Object.entries(
      resolvedSchema.properties,
    )) {
      const fieldType = schemaTypeLabel(fieldSchema, components);
      const fieldDesc = isSchemaObject(fieldSchema)
        ? escapeMdxText(fieldSchema.description)
        : '';
      lines.push(
        `| \`${field}\` | ${required.has(field) ? labels.yes : labels.no} | \`${fieldType}\` | ${fieldDesc || '-'} |`,
      );
    }
    lines.push('');
  }

  const sampleBody = toSampleValue(rawSchema ?? resolvedSchema, components);
  if (sampleBody && typeof sampleBody === 'object') {
    lines.push(labels.exampleBody);
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(sampleBody, null, 2));
    lines.push('```');
    lines.push('');
  }

  return { section: lines.join('\n'), sampleBody };
}

function buildOverviewGuidanceBlocks(
  copy: { whenToUse?: string; caveats?: string; related?: string } | undefined,
  lang: DocsLanguage,
  titleSource: string,
  method: string,
  path: string,
): string {
  const lb = labelsForLanguage(lang);
  const fallbackWhenToUse =
    lang === 'fr'
      ? `Utilisez cet endpoint quand vous devez exécuter \`${method.toUpperCase()} ${path}\` (${escapeMdxText(titleSource)}).`
      : `Use this endpoint when your flow needs \`${method.toUpperCase()} ${path}\` (${escapeMdxText(titleSource)}).`;
  const parts: string[] = [];
  const whenToUseText = copy?.whenToUse ?? fallbackWhenToUse;
  if (whenToUseText) {
    parts.push(
      `### ${lb.guidanceWhenToUse}\n\n${escapeMdxText(whenToUseText)}`,
    );
  }
  if (copy?.caveats) {
    parts.push(
      `### ${lb.guidanceGoodToKnow}\n\n${escapeMdxText(copy.caveats)}`,
    );
  }
  if (copy?.related) {
    parts.push(`### ${lb.guidanceSeeAlso}\n\n${copy.related}`);
  }
  if (parts.length === 0) return '';
  return `\n\n${parts.join('\n\n')}\n`;
}

type PathParamsInput = {
  parameters?: (ParameterObject | ReferenceObject)[];
};

export function renderOperationPageMdx(input: {
  method: string;
  path: string;
  operationId: string;
  operation: OperationObject;
  pathItem?: PathParamsInput;
  components?: ComponentsObject;
  lang?: DocsLanguage;
}): string {
  const { method, path, operationId, operation, pathItem, components } = input;
  const lang = input.lang ?? 'en';
  const labels = labelsForLanguage(lang);
  const mLower = method.toLowerCase();
  const enCopy = lang === 'en' ? EN_OPERATION_COPY[operationId] : undefined;
  const guidanceCopy =
    lang === 'en'
      ? EN_OPERATION_COPY[operationId]
      : FR_OPERATION_COPY[operationId];
  const titleSource = enCopy?.summary ?? operation.summary ?? operationId;
  const overviewDetail =
    lang === 'en' && enCopy
      ? (enCopy.body ?? operation.description)
      : operation.description;
  const description = overviewDetail
    ? `\n\n${escapeMdxText(overviewDetail)}\n`
    : '';
  const guidanceBlocks = buildOverviewGuidanceBlocks(
    guidanceCopy,
    lang,
    titleSource,
    method,
    path,
  );

  const servers = [
    'https://sandbox.api.lomi.africa',
    'https://api.lomi.africa',
  ];
  const endpointLine = `\`${method.toUpperCase()} ${path}\``;

  const pathLevelParams =
    pathItem?.parameters?.filter(
      (p): p is ParameterObject => !isRef(p) && 'in' in p,
    ) ?? [];

  const opParams = [...pathLevelParams];
  if (Array.isArray(operation.parameters)) {
    for (const p of operation.parameters) {
      if (!isRef(p) && 'in' in p) opParams.push(p);
    }
  }

  const pathParams = opParams.filter((p) => p.in === 'path');
  const queryParams = opParams.filter((p) => p.in === 'query');
  const headerParams = opParams.filter((p) => p.in === 'header');

  const pathTable =
    pathParams.length === 0
      ? labels.noPathParameters
      : [
          `| ${labels.name} | ${labels.required} | ${labels.schema} | ${labels.description} |`,
          '| --- | --- | --- | --- |',
        ]
          .concat(
            pathParams.map((p) => {
              const req = p.required ? labels.yes : labels.no;
              const schema =
                'schema' in p &&
                p.schema &&
                typeof p.schema === 'object' &&
                '$ref' in p.schema
                  ? (((p.schema as ReferenceObject).$ref ?? '')
                      .split('/')
                      .pop() ?? '')
                  : '';
              const desc =
                'description' in p && typeof p.description === 'string'
                  ? escapeMdxText(p.description)
                  : '';
              return `| \`${p.name}\` | ${req} | ${schema ? `\`${schema}\`` : '-'} | ${desc} |`;
            }),
          )
          .join('\n');

  const queryTable =
    queryParams.length === 0
      ? labels.noQueryParameters
      : [
          `| ${labels.name} | ${labels.in} | ${labels.required} | ${labels.schema} | ${labels.description} |`,
          '| --- | --- | --- | --- | --- |',
        ]
          .concat(queryParams.map((p) => paramRow(p, labels)).filter(Boolean))
          .join('\n');

  const headerTable =
    headerParams.length === 0
      ? ''
      : [
          `### ${labels.headers}`,
          '',
          `| ${labels.name} | ${labels.in} | ${labels.required} | ${labels.schema} | ${labels.description} |`,
          '| --- | --- | --- | --- | --- |',
          ...headerParams.map((p) => paramRow(p, labels)).filter(Boolean),
          '',
        ].join('\n');

  const shouldHaveBody =
    mLower === 'post' || mLower === 'put' || mLower === 'patch';
  const requestBody = shouldHaveBody
    ? buildRequestBodySection(operation, components, labels, lang, enCopy)
    : { section: '', sampleBody: null };
  const bodySection = requestBody.section;

  const responseTable =
    responseRows(operation.responses, lang).length === 0
      ? labels.responseFallback
      : [
          `| ${labels.status} | ${labels.description} |`,
          '| --- | --- |',
          ...responseRows(operation.responses, lang),
        ].join('\n');

  const yamlTitle = JSON.stringify(titleSource);
  const yamlDescription = JSON.stringify(
    enCopy
      ? titleSource
      : (operation.summary ??
          `${method.toUpperCase()} ${path}, see REST API reference`),
  );

  const pathSample = new Map(
    pathParams.map((p) => [p.name ?? '', parameterSampleValue(p)]),
  );
  const urlPath = path.replace(
    /\{([^}]+)\}/g,
    (_all, name: string) => pathSample.get(name) ?? `${name}_value`,
  );
  const queryExample = queryParams
    .slice(0, 2)
    .map(
      (p) =>
        `${encodeURIComponent(p.name ?? 'param')}=${parameterSampleValue(p)}`,
    )
    .join('&');
  const fullPath = queryExample ? `${urlPath}?${queryExample}` : urlPath;

  const curlLines = [
    `curl -sS -X ${method.toUpperCase()} "${servers[0]}${fullPath}"`,
    `  -H "X-API-KEY: $LOMI_SECRET_KEY"`,
    shouldHaveBody ? `  -H "Content-Type: application/json"` : '',
    shouldHaveBody
      ? `  -d '${JSON.stringify(
          requestBody.sampleBody && typeof requestBody.sampleBody === 'object'
            ? requestBody.sampleBody
            : {},
        )}'`
      : '',
  ].filter(Boolean);

  const curlExample = [
    '```bash',
    ...curlLines.map((line, idx) =>
      idx < curlLines.length - 1 ? `${line} \\` : line,
    ),
    '```',
  ]
    .filter(Boolean)
    .join('\n');

  return `---
title: ${yamlTitle}
description: ${yamlDescription}
full: true
method: ${method.toLowerCase()}
path: ${path}
operationId: ${operationId}
---

## ${labels.overview}

${escapeMdxText(titleSource)}${description}${guidanceBlocks}

## ${labels.authentication}

${labels.authenticationText
  .replaceAll('${servers[0]}', servers[0])
  .replaceAll('${servers[1]}', servers[1])}

## ${labels.endpoint}

${endpointLine}

${labels.baseUrls}

${servers.map((u) => `- \`${u}\``).join('\n')}

## ${labels.request}

### ${labels.pathParameters}

${pathTable}

### ${labels.queryParameters}

${queryTable}
${headerTable ? '\n' + headerTable : ''}
${bodySection}

## ${labels.responses}

${responseTable}

## ${labels.errors}

${labels.errorsText}

## ${labels.example}

${curlExample}

## OpenAPI

- **operationId**: \`${operationId}\`
- **Operation**: \`${method.toUpperCase()} ${path}\`

${
  lang === 'fr'
    ? 'Schémas complets et **Try it** : [référence API](/api).'
    : 'Full schemas and **Try it**: [API reference](/api). Machine-readable contract: repo `apps/docs/openapi.json`.'
}
`;
}

export function collectPublicOperations(spec: {
  paths?: Record<string, PathItemObject>;
}): {
  method: string;
  path: string;
  operationId: string;
  operation: OperationObject;
}[] {
  const out: {
    method: string;
    path: string;
    operationId: string;
    operation: OperationObject;
  }[] = [];
  if (!spec.paths) return out;

  for (const [p, item] of Object.entries(spec.paths)) {
    if (!item) continue;
    for (const m of HTTP_OPS) {
      const op = item[m] as OperationObject | undefined;
      if (!op?.operationId) continue;
      out.push({
        method: m,
        path: p,
        operationId: op.operationId,
        operation: op,
      });
    }
  }
  return out;
}
