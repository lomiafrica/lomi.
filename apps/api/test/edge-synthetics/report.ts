import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { CheckResult, RunReport, SuiteResult } from './types';

const REPORT_PATH = join(__dirname, 'last-run.json');

function statusIcon(status: CheckResult['status']): string {
  switch (status) {
    case 'pass':
      return 'OK';
    case 'fail':
      return 'FAIL';
    case 'skip':
      return 'SKIP';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function printSuite(suite: SuiteResult): void {
  console.log(`\n=== ${suite.suite.toUpperCase()} (${suite.baseUrl}) ===`);
  console.log(
    `Duration: ${suite.durationMs}ms | pass: ${suite.passed} | fail: ${suite.failed} | skip: ${suite.skipped}`,
  );
  console.log('');

  const byService = new Map<string, CheckResult[]>();
  for (const check of suite.checks) {
    const list = byService.get(check.service) ?? [];
    list.push(check);
    byService.set(check.service, list);
  }

  for (const [service, checks] of byService) {
    console.log(`[${service}]`);
    for (const check of checks) {
      const latency =
        check.latencyMs !== undefined ? ` ${check.latencyMs}ms` : '';
      const http =
        check.httpStatus !== undefined ? ` HTTP ${check.httpStatus}` : '';
      console.log(
        `  ${statusIcon(check.status).padEnd(4)} ${check.method} ${check.functionName}${http}${latency}`,
      );
      if (check.skipReason) {
        console.log(`       skip: ${check.skipReason}`);
      }
      for (const anomaly of check.anomalies) {
        console.log(`       ! ${anomaly.kind}: ${anomaly.message}`);
      }
      if (check.responsePreview) {
        console.log(`       response: ${check.responsePreview}`);
      }
    }
    console.log('');
  }
}

function markdownSummary(report: RunReport): string {
  const lines: string[] = [
    '## Edge function synthetics',
    '',
    `**Overall:** ${report.ok ? 'PASS' : 'FAIL'} | duration ${report.durationMs}ms | pass ${report.totalPassed} | fail ${report.totalFailed} | skip ${report.totalSkipped}`,
    '',
  ];

  for (const suite of report.suites) {
    lines.push(`### ${suite.suite} (\`${suite.baseUrl}\`)`);
    lines.push('');
    lines.push('| Status | Service | Function | HTTP | Notes |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const check of suite.checks) {
      const notes =
        check.status === 'skip'
          ? (check.skipReason ?? '')
          : check.anomalies.map((a) => a.message).join('; ');
      lines.push(
        `| ${statusIcon(check.status)} | ${check.service} | \`${check.functionName}\` | ${check.httpStatus ?? '-'} | ${notes.replace(/\|/g, '\\|')} |`,
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function writeReport(report: RunReport): void {
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`\nReport written to ${REPORT_PATH}`);

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    appendFileSync(summaryPath, `${markdownSummary(report)}\n`, 'utf8');
  }
}

export function printReport(report: RunReport): void {
  console.log('\n========================================');
  console.log('lomi. edge function synthetics');
  console.log('========================================');
  for (const suite of report.suites) {
    printSuite(suite);
  }
  console.log('----------------------------------------');
  console.log(
    `TOTAL: ${report.ok ? 'PASS' : 'FAIL'} | ${report.durationMs}ms | pass ${report.totalPassed} | fail ${report.totalFailed} | skip ${report.totalSkipped}`,
  );
  console.log('----------------------------------------');
}

export function buildReport(suites: SuiteResult[]): RunReport {
  const startedAt = suites[0]?.startedAt ?? new Date().toISOString();
  const finishedAt = suites[suites.length - 1]?.finishedAt ?? startedAt;
  const durationMs = suites.reduce((sum, s) => sum + s.durationMs, 0);
  const totalPassed = suites.reduce((sum, s) => sum + s.passed, 0);
  const totalFailed = suites.reduce((sum, s) => sum + s.failed, 0);
  const totalSkipped = suites.reduce((sum, s) => sum + s.skipped, 0);

  return {
    startedAt,
    finishedAt,
    durationMs,
    suites,
    totalPassed,
    totalFailed,
    totalSkipped,
    ok: totalFailed === 0,
  };
}
