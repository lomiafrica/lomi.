import { analyzeResponse, previewResponse, scanForLeaks } from '../synthetics/assert';
import { EdgeFunctionsClient } from './client';
import type {
  CheckDefinition,
  CheckResult,
  SuiteContext,
  SuiteName,
  SuiteResult,
} from './types';

function resolveBody(
  body: CheckDefinition['body'],
  ctx: SuiteContext,
): unknown {
  if (body === undefined) return undefined;
  return typeof body === 'function' ? body(ctx) : body;
}

function resolveHeaders(
  headers: CheckDefinition['headers'],
  ctx: SuiteContext,
): Record<string, string> | undefined {
  if (headers === undefined) return undefined;
  return typeof headers === 'function' ? headers(ctx) : headers;
}

function resolveExpected(
  expectStatus: CheckDefinition['expectStatus'],
  ctx: SuiteContext,
): number | number[] {
  if (expectStatus === undefined) {
    return [200, 201, 202];
  }
  return typeof expectStatus === 'function' ? expectStatus(ctx) : expectStatus;
}

export async function runSuite(
  suite: SuiteName,
  supabaseUrl: string,
  anonKey: string,
  checks: CheckDefinition[],
  ctx: SuiteContext,
): Promise<SuiteResult> {
  const client = new EdgeFunctionsClient({ supabaseUrl, anonKey });
  const startedAt = new Date().toISOString();
  const suiteStart = Date.now();
  const results: CheckResult[] = [];

  for (const check of checks) {
    const skipReason = check.skipIf?.(ctx) ?? null;
    if (skipReason) {
      results.push({
        suite,
        name: check.name,
        service: check.service,
        method: check.method,
        functionName: check.functionName,
        status: 'skip',
        skipReason,
        anomalies: [],
      });
      continue;
    }

    try {
      const expected = resolveExpected(check.expectStatus, ctx);
      const res = await client.invoke(check.functionName, check.method, {
        body: resolveBody(check.body, ctx),
        headers: resolveHeaders(check.headers, ctx),
        auth: check.auth,
      });

      let anomalies = analyzeResponse(res, expected);

      if (check.validate && anomalies.length === 0) {
        const validationError = check.validate(ctx, res);
        if (validationError) {
          anomalies.push({ kind: 'validation', message: validationError });
        }
      }

      if (check.capture && anomalies.length === 0) {
        check.capture(ctx, res);
      }

      if (res.status >= 400) {
        for (const leak of scanForLeaks(res.data)) {
          if (!anomalies.some((a) => a.message === leak.message)) {
            anomalies.push(leak);
          }
        }
      }

      const passed = anomalies.length === 0;
      results.push({
        suite,
        name: check.name,
        service: check.service,
        method: check.method,
        functionName: check.functionName,
        status: passed ? 'pass' : 'fail',
        httpStatus: res.status,
        latencyMs: res.latencyMs,
        anomalies,
        responsePreview: passed ? undefined : previewResponse(res.data),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({
        suite,
        name: check.name,
        service: check.service,
        method: check.method,
        functionName: check.functionName,
        status: 'fail',
        anomalies: [
          {
            kind: 'validation',
            message: `Request threw: ${message}`,
          },
        ],
      });
    }
  }

  const finishedAt = new Date().toISOString();
  return {
    suite,
    baseUrl: supabaseUrl,
    startedAt,
    finishedAt,
    durationMs: Date.now() - suiteStart,
    checks: results,
    passed: results.filter((r) => r.status === 'pass').length,
    failed: results.filter((r) => r.status === 'fail').length,
    skipped: results.filter((r) => r.status === 'skip').length,
  };
}
