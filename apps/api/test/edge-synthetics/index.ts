import { randomUUID } from 'node:crypto';
import { createLiveChecks } from './checks/live';
import { runMutatingChecks } from './checks/mutating';
import { createSandboxRejectChecks } from './checks/sandbox';
import { loadEdgeSyntheticsEnv } from './load-env';
import { buildReport, printReport, writeReport } from './report';
import { runSuite } from './runner';
import type { SuiteContext, SuiteName, SuiteResult } from './types';

type OnlyMode = SuiteName | 'all';

function parseArgs(argv: string[]): OnlyMode {
  for (const arg of argv) {
    if (arg.startsWith('--only=')) {
      const value = arg.slice('--only='.length) as OnlyMode;
      if (value === 'sandbox' || value === 'live' || value === 'all') {
        return value;
      }
      throw new Error(`Invalid --only value: ${value}`);
    }
  }
  return 'all';
}

/** Single Supabase project hosts all edge functions (sandbox vs live is merchant API data, not a second project). */
function resolveSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL?.trim();
  if (!url) {
    throw new Error(
      'SUPABASE_URL is required for edge synthetics (same project URL as the API).',
    );
  }
  return url.replace(/\/$/, '');
}

function resolvePublishableKey(): string {
  for (const key of [
    'SUPABASE_PUBLISHABLE_KEY',
    'DB_PUBLISHABLE_KEY',
    'SUPABASE_ANON_KEY',
  ]) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  throw new Error(
    'SUPABASE_PUBLISHABLE_KEY (or DB_PUBLISHABLE_KEY / SUPABASE_ANON_KEY) is required for edge synthetics.',
  );
}

async function main(): Promise<void> {
  loadEdgeSyntheticsEnv();
  const only = parseArgs(process.argv.slice(2));
  const runId = randomUUID();
  const ctx: SuiteContext = { runId };
  const suites: SuiteResult[] = [];

  const supabaseUrl = resolveSupabaseUrl();
  const publishableKey = resolvePublishableKey();
  const shouldRunSandbox = only === 'all' || only === 'sandbox';
  const shouldRunLive = only === 'all' || only === 'live';
  const mutatingEnabled = process.env.EDGE_SYNTHETICS_MUTATING === '1';

  if (shouldRunSandbox) {
    const sandboxSuite = await runSuite(
      'sandbox',
      supabaseUrl,
      publishableKey,
      createSandboxRejectChecks(),
      ctx,
    );

    if (mutatingEnabled) {
      const mutating = await runMutatingChecks(
        supabaseUrl,
        publishableKey,
        ctx,
      );
      sandboxSuite.checks.push({
        suite: 'sandbox',
        name: mutating.name,
        service: 'edge-mutating',
        method: 'POST',
        functionName: 'create-stripe-payment-intent',
        status: mutating.status,
        httpStatus: mutating.httpStatus,
        latencyMs: mutating.latencyMs,
        skipReason: mutating.skipReason,
        anomalies: mutating.status === 'fail'
          ? [{
            kind: 'validation',
            message: mutating.message ?? 'Mutating check failed',
          }]
          : [],
        responsePreview: mutating.status === 'fail'
          ? mutating.message
          : undefined,
      });
      if (mutating.status === 'pass') sandboxSuite.passed += 1;
      else if (mutating.status === 'fail') sandboxSuite.failed += 1;
      else sandboxSuite.skipped += 1;
    }

    suites.push(sandboxSuite);
  }

  if (shouldRunLive) {
    // Same Supabase project as sandbox — "live" here means a thin reachability probe only.
    suites.push(
      await runSuite(
        'live',
        supabaseUrl,
        publishableKey,
        createLiveChecks(),
        ctx,
      ),
    );
  }

  const report = buildReport(suites);
  printReport(report);
  writeReport(report);

  if (!report.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
