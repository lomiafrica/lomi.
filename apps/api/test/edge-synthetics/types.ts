export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type SuiteName = 'sandbox' | 'live';

export interface HttpResponse {
  status: number;
  data: unknown;
  latencyMs: number;
  headers: Record<string, string>;
}

export interface SuiteContext {
  runId: string;
  checkoutSessionId?: string;
  organizationId?: string;
  merchantId?: string;
  [key: string]: unknown;
}

export interface CheckDefinition {
  name: string;
  service: string;
  /** Supabase edge function name (e.g. `mtn`). */
  functionName: string;
  method: HttpMethod;
  body?: unknown | ((ctx: SuiteContext) => unknown);
  headers?:
    | Record<string, string>
    | ((ctx: SuiteContext) => Record<string, string>);
  /** When false, omit Authorization (apikey still sent). Default true. */
  auth?: boolean;
  expectStatus?: number | number[] | ((ctx: SuiteContext) => number | number[]);
  validate?: (ctx: SuiteContext, res: HttpResponse) => string | null;
  capture?: (ctx: SuiteContext, res: HttpResponse) => void;
  skipIf?: (ctx: SuiteContext) => string | null;
}

export interface Anomaly {
  kind: 'status' | 'leak' | 'validation' | 'service_unavailable';
  message: string;
}

export interface CheckResult {
  suite: SuiteName;
  name: string;
  service: string;
  method: HttpMethod;
  functionName: string;
  status: 'pass' | 'fail' | 'skip';
  httpStatus?: number;
  latencyMs?: number;
  skipReason?: string;
  anomalies: Anomaly[];
  responsePreview?: string;
}

export interface SuiteResult {
  suite: SuiteName;
  baseUrl: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  checks: CheckResult[];
  passed: number;
  failed: number;
  skipped: number;
}

export interface RunReport {
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  suites: SuiteResult[];
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  ok: boolean;
}
