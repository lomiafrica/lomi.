/* @proprietary license */

import { isJsonObject, type JsonObject, type JsonValue } from '@lomi./shared';
import { exampleBodyForOperation } from '@/lib/openapi/example-body';
import {
  toOpenApiHttpMethod,
  type OpenApiHttpMethod,
} from '@/lib/openapi/http-method';

const BODY_METHODS = new Set<OpenApiHttpMethod>([
  'post',
  'put',
  'patch',
  'delete',
]);

export type TryItOperation = {
  method: OpenApiHttpMethod;
  path: string;
  sandboxOrigin: string;
  pathParams: string[];
  exampleBody: string | null;
  hasBody: boolean;
};

export function pathParamNames(route: string): string[] {
  const names: string[] = [];
  const matches = route.matchAll(/\{([^}]+)\}/g);
  for (const match of matches) {
    if (match[1]) names.push(match[1]);
  }
  return names;
}

export function resolvePathTemplate(
  route: string,
  params: Record<string, string>,
): string {
  return route.replace(/\{([^}]+)\}/g, (_, name: string) => {
    const value = params[name]?.trim() ?? '';
    return encodeURIComponent(value);
  });
}

export function getTryItOperation(
  document: JsonValue,
  method: string,
  route: string,
  sandboxOrigin = 'https://sandbox.api.lomi.africa',
): TryItOperation | null {
  const httpMethod = toOpenApiHttpMethod(method);
  if (!httpMethod || !isJsonObject(document)) return null;
  const paths = document.paths;
  if (!isJsonObject(paths)) return null;
  const item = paths[route];
  if (!isJsonObject(item)) return null;
  const operation = item[httpMethod];
  if (!isJsonObject(operation)) return null;

  const hasBody = BODY_METHODS.has(httpMethod);
  return {
    method: httpMethod,
    path: route,
    sandboxOrigin,
    pathParams: pathParamNames(route),
    exampleBody: hasBody ? exampleBodyForOperation(document, operation) : null,
    hasBody,
  };
}
