#!/usr/bin/env node
/**
 * Shared public merchant SDK contract: OpenAPI + strict allowlist.
 * Used by TypeScript, Python, Go, and PHP generators.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isObjectRecord = (value) =>
  value !== null && Object(value) === value && !Array.isArray(value);

export const SCRIPTS_DIR = __dirname;

export const DEFAULT_OPENAPI_PATH = join(
  __dirname,
  '../../docs/openapi.json',
);
export const DEFAULT_ALLOWLIST_PATH = join(
  __dirname,
  '../../docs/lib/scripts/manual-api/_expected-public-operations.json',
);

/** @type {Record<string, string>} */
export const METHOD_NAME_BY_OP = {
  'DELETE /customers/{id}': 'delete',
  'GET /accounts/balance': 'getBalance',
  'GET /accounts/balance/breakdown': 'getBalanceBreakdown',
  'GET /accounts/balance/{currency}': 'checkBalance',
  'GET /checkout-sessions': 'list',
  'GET /checkout-sessions/{id}': 'get',
  'GET /customers': 'list',
  'GET /customers/{id}': 'get',
  'GET /customers/{id}/transactions': 'getTransactions',
  'GET /customers/{id}/subscriptions': 'getSubscriptions',
  'GET /customers/{id}/portal-audit': 'getPortalAudit',
  'POST /customers/{id}/portal': 'createPortalSession',
  'GET /coupons': 'list',
  'GET /coupons/{id}': 'get',
  'GET /coupons/{id}/performance': 'getPerformance',
  'GET /organizations': 'list',
  'GET /organizations/metrics': 'getMetrics',
  'GET /organizations/radar-settings': 'getRadarSettings',
  'PATCH /organizations/radar-settings': 'updateRadarSettings',
  'GET /organizations/{id}': 'get',
  'GET /merchants/{id}': 'get',
  'GET /merchants/{id}/mrr': 'getMrr',
  'GET /merchants/{id}/arr': 'getArr',
  'GET /merchants/{id}/balance': 'getBalance',
  'GET /payment-links': 'list',
  'GET /payment-links/{id}': 'get',
  'GET /payment-requests': 'list',
  'GET /payment-requests/{id}': 'get',
  'GET /products': 'list',
  'GET /products/{id}': 'get',
  'GET /subscriptions': 'list',
  'GET /risk-assessments': 'listAssessments',
  'GET /risk-assessments/{id}': 'findOne',
  'GET /subscriptions/{id}': 'get',
  'GET /subscriptions/{id}/usage': 'getUsage',
  'GET /transactions': 'list',
  'GET /transactions/{id}': 'get',
  'GET /webhooks/deliveries': 'listDeliveries',
  'GET /webhooks/deliveries/{id}': 'getDelivery',
  'GET /webhooks': 'list',
  'GET /webhooks/{id}': 'get',
  'PATCH /customers/{id}': 'update',
  'PATCH /webhooks/{id}': 'update',
  'POST /webhooks': 'create',
  'DELETE /webhooks/{id}': 'delete',
  'POST /webhooks/{id}/test': 'test',
  'POST /webhooks/{id}/deliveries/{deliveryId}/retry': 'retryDelivery',
  'GET /providers': 'list',
  'PATCH /subscriptions/{id}': 'update',
  'POST /charge/wave': 'createWaveCharge',
  'POST /charge/mtn': 'createMtnCharge',
  'POST /charge/switch': 'createSwitchCharge',
  'POST /charge/card': 'createCardCharge',
  'GET /charge/card/{id}': 'getCardCharge',
  'POST /charge/card/{id}/cancel': 'cancelCardCharge',
  'POST /payouts': 'create',
  'GET /payouts': 'list',
  'GET /payouts/{id}': 'get',
  'POST /checkout-sessions': 'create',
  'POST /customers': 'create',
  'POST /coupons': 'create',
  'POST /payment-links': 'create',
  'POST /payment-requests': 'create',
  'POST /products': 'create',
  'POST /products/{id}/prices': 'addPrice',
  'POST /products/{id}/prices/{priceId}/default': 'setDefaultPrice',
  'POST /refunds': 'create',
  'GET /refunds': 'list',
  'GET /refunds/{id}': 'get',
  'GET /settlements': 'findAll',
  'GET /settlements/instant/{id}': 'getInstant',
  'GET /settlements/{id}/transactions': 'findTransactions',
  'POST /settlements/instant': 'createInstant',
  'GET /disputes': 'list',
  'GET /disputes/{id}': 'get',
  'GET /support-requests': 'list',
  'GET /support-requests/{id}': 'get',
  'POST /support-requests': 'create',
  'POST /support-requests/{id}/close': 'close',
  'GET /logs': 'list',
  'GET /logs/{id}': 'get',
  'GET /meters': 'list',
  'GET /meters/{id}': 'get',
  'GET /meters/{id}/balances/{customerId}': 'getCustomerBalance',
  'PATCH /meters/{id}': 'update',
  'POST /meters': 'create',
  'GET /usage/entitlements': 'checkEntitlement',
  'GET /usage/periods': 'listPeriods',
  'GET /usage/revenue': 'getRevenue',
  'GET /usage/events': 'list',
  'GET /usage/events/{id}': 'get',
  'POST /usage/credits': 'grantCredits',
  'POST /usage/entitlements': 'createEntitlement',
  'POST /usage/events': 'create',
  'POST /usage/subscriptions': 'createSubscription',
  'POST /subscriptions/{id}/cancel': 'cancel',
  'POST /subscriptions/{id}/resume': 'resume',
  'POST /subscriptions/{id}/change-plan': 'changePlan',
  'GET /api-keys': 'list',
  'GET /exports/{id}': 'get',
  'POST /exports': 'create',
  'GET /finance/summary': 'getSummary',
  'GET /finance/cashflow': 'getCashflow',
  'GET /finance/aging': 'getAging',
  'GET /finance/reconcile': 'getReconcile',
  'GET /invoices': 'list',
  'GET /invoices/{id}': 'get',
  'GET /invoices/{id}/pdf': 'pdf',
  'PATCH /invoices/{id}': 'update',
  'POST /invoices': 'create',
  'POST /invoices/{id}/checkout-session': 'createCheckoutSession',
  'POST /invoices/{id}/finalize': 'finalize',
  'POST /invoices/{id}/remind': 'remind',
  'POST /invoices/{id}/send': 'send',
  'POST /invoices/{id}/void': 'voidInvoice',
  'GET /payout-methods': 'list',
  'POST /payout-methods': 'create',
  'POST /disputes/{id}/evidence': 'submitEvidence',
  'GET /transactions/{id}/receipt.pdf': 'receiptPdf',
};

export const HTTP_WITH_BODY = new Set(['post', 'patch', 'put']);

function hyphenSegmentsToPascal(seg) {
  return seg
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

/** @param {string} pathTpl */
export function serviceClassForPath(pathTpl) {
  const segs = pathTpl.split('/').filter(Boolean);
  const a = segs[0];
  const b = segs[1];
  if (a === 'charge') return 'ChargesService';
  if (a === 'payouts') return 'PayoutsService';
  return `${hyphenSegmentsToPascal(a)}Service`;
}

/** @param {string} serviceClass e.g. CustomersService */
export function sdkPropertyName(serviceClass) {
  const base = serviceClass.replace(/Service$/, '');
  return base.charAt(0).toLowerCase() + base.slice(1);
}

export function pathIds(pathTpl) {
  const ids = [];
  for (const part of pathTpl.split('/')) {
    const m = /^\{([^}]+)}$/.exec(part);
    if (m) ids.push(m[1]);
  }
  return ids;
}

/** @param {string | undefined} ref @param {any} spec */
export function resolveRef(ref, spec) {
  if (!ref || ref.constructor !== String || !ref.startsWith('#/')) return null;
  let cur = spec;
  for (const segment of ref.replace(/^#\//, '').split('/')) {
    cur = cur?.[segment];
  }
  return cur ?? null;
}

/** @param {any} p @param {any} spec */
export function normalizeParam(p, spec) {
  if (!p) return null;
  if (p.$ref) return resolveRef(p.$ref, spec);
  return p;
}

/** @param {any} spec @param {any} pathItem @param {any} op */
export function flattenParams(spec, pathItem, op) {
  const merged = [...(pathItem.parameters || []), ...(op.parameters || [])];
  return merged.map((p) => normalizeParam(p, spec)).filter(Boolean);
}

/** @param {string} httpLower get|post|... @param {any} op */
export function wantsBody(httpLower, op) {
  if (!HTTP_WITH_BODY.has(httpLower)) return false;
  if (!op.requestBody) return false;
  const c = op.requestBody.content || {};
  return !!(c['application/json'] || c['multipart/form-data']);
}

/**
 * @param {string} openapiPath
 * @param {string} allowlistPath
 */
export function readSpecAndAllowlist(
  openapiPath = DEFAULT_OPENAPI_PATH,
  allowlistPath = DEFAULT_ALLOWLIST_PATH,
) {
  if (!existsSync(openapiPath)) {
    throw new Error(`Missing OpenAPI json: ${openapiPath}`);
  }
  if (!existsSync(allowlistPath)) {
    throw new Error(`Missing allowlist: ${allowlistPath}`);
  }
  const spec = JSON.parse(readFileSync(openapiPath, 'utf-8'));
  const allowed = JSON.parse(readFileSync(allowlistPath, 'utf-8'));
  return { spec, allowed };
}

/**
 * Normalized ops sorted by operationKey for stable codegen.
 * @param {any} spec
 * @param {string[]} allowed
 */
export function getNormalizedOperations(spec, allowed) {
  /** @type {Array<{ operationKey: string, httpMethodLower: string, pathTemplate: string, sdkMethodName: string, serviceClassName: string, sdkPropertyCamel: string, operationId: string, summary: string, pathParamNames: string[], queryParams: any[], wantsBody: boolean, openApiOp: any, pathItem: any }>} */
  const out = [];

  for (const entry of allowed) {
    const [method, ...pathParts] = String(entry).split(/\s+/);
    const template = pathParts.join(' ');
    const key = `${method.toUpperCase()} ${template}`;
    const sdkMethod = METHOD_NAME_BY_OP[key];
    if (!sdkMethod) {
      throw new Error(`METHOD_NAME_BY_OP missing for allowed operation: ${key}`);
    }
    const pathItemRoot = spec.paths?.[template];
    if (!isObjectRecord(pathItemRoot)) {
      throw new Error(`OpenAPI paths missing "${template}" (from allowlist)`);
    }
    const lw = method.toLowerCase();
    const op = pathItemRoot[lw];
    if (!isObjectRecord(op)) {
      throw new Error(`OpenAPI missing ${lw.toUpperCase()} ${template}`);
    }
    const pathItem = pathItemRoot;
    const qp = flattenParams(spec, pathItem, op).filter((q) => q.in === 'query');
    const pathParamNames = pathIds(template);
    const serviceClassName = serviceClassForPath(template);
    const sdkProp = sdkPropertyName(serviceClassName);

    out.push({
      operationKey: key,
      httpMethodLower: lw,
      pathTemplate: template,
      sdkMethodName: sdkMethod,
      serviceClassName,
      sdkPropertyCamel: sdkProp,
      operationId: op.operationId ?? sdkMethod,
      summary: op.summary ?? '',
      pathParamNames,
      queryParams: qp,
      wantsBody: wantsBody(lw, op),
      openApiOp: op,
      pathItem,
    });
  }

  out.sort((a, b) => a.operationKey.localeCompare(b.operationKey));

  /** @type Map<string, typeof out> */
  const byService = new Map();
  for (const o of out) {
    const arr = byService.get(o.serviceClassName) ?? [];
    arr.push(o);
    byService.set(o.serviceClassName, arr);
  }

  for (const [svc, arr] of byService) {
    const seen = new Set();
    for (const op of arr) {
      if (seen.has(op.sdkMethodName))
        throw new Error(`Duplicate method "${op.sdkMethodName}" on ${svc}`);
      seen.add(op.sdkMethodName);
    }
  }

  return { operations: out, byService };
}

/**
 * e.g. beneficiaryPayouts -> beneficiary_payouts
 * @param {string} camel
 */
export function camelSdkPropToSnake(camel) {
  return camel
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

/**
 * TS SDK method name -> Python snake_case (getBalance -> get_balance).
 * @param {string} tsName
 */
export function tsMethodToPythonName(tsName) {
  if (!/[A-Z]/.test(tsName)) return tsName;
  return camelSdkPropToSnake(tsName);
}

/** Go struct field exported from camelCase sdk service property name. */
export function sdkPropToGoField(camelSdkProp) {
  return camelSdkProp.charAt(0).toUpperCase() + camelSdkProp.slice(1);
}

/** List endpoints that also expose auto-pagination helpers (`listAll`, `findAllAll`, …). */
export const LIST_METHOD_NAMES = new Set(['list', 'findAll']);

/**
 * Expand OpenAPI-derived method names with SDK-only helpers (pagination + webhooks).
 * @param {string} serviceClassName e.g. WebhooksService
 * @param {string[]} methodNames
 */
export function expandSdkManifestMethods(serviceClassName, methodNames) {
  /** @type {string[]} */
  const names = [];
  for (const methodName of methodNames) {
    names.push(methodName);
    if (LIST_METHOD_NAMES.has(methodName)) {
      names.push(`${methodName}All`);
    }
  }
  if (serviceClassName === 'WebhooksService') {
    names.push('verifySignature');
  }
  return [...new Set(names)].sort();
}

/** TS camelCase sdk method → Go exported name */
export function tsMethodToGo(tsName) {
  return tsName.charAt(0).toUpperCase() + tsName.slice(1);
}

/** Build sdk manifest identical shape to sdk-public-methods.json `sdk` object */
export function buildSdkManifestGrouped(byServiceMap) {
  /** @type {Record<string, string[]>} */
  const manifest = {};
  const sortedServices = [...byServiceMap.keys()].sort((a, b) =>
    a.localeCompare(b),
  );
  for (const svc of sortedServices) {
    const prop = sdkPropertyName(svc);
    const baseMethods = [...byServiceMap.get(svc)].map((o) => o.sdkMethodName);
    manifest[prop] = expandSdkManifestMethods(svc, baseMethods);
  }
  return manifest;
}
