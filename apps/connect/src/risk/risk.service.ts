import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  ALL_THRESHOLDS,
  AUTH_RATE,
  CHARGEBACK_RATE,
  DISPUTE_RATE,
  overallVerdict,
  REFUND_RATE,
  type OverallRiskVerdict,
  type ThresholdVerdict,
} from './thresholds';

const WINDOW_DAYS = 90;

export interface MerchantRiskReport {
  organizationId: string;
  environment: 'live' | 'test';
  windowDays: number;
  sales: number;
  metrics: {
    authRate: number;
    refundRate: number;
    disputeRate: number;
    chargebackRate: number;
  };
  verdicts: Record<string, ThresholdVerdict>;
  overall: OverallRiskVerdict;
  computedAt: string;
}

/**
 * Per-merchant card risk scoring — lomi.'s own radar, Polar-style. Metrics
 * come from the transactions/refunds/disputes tables, so the evaluation
 * covers BOTH rails: a merchant whose disputes spike gets flagged whether
 * they run on the aggregate account or on a connected account.
 */
@Injectable()
export class RiskService {
  private readonly logger = new Logger(RiskService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async evaluate(
    organizationId: string,
    environment: 'live' | 'test',
  ): Promise<MerchantRiskReport> {
    const since = new Date(
      Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();

    const { data: txRows, error: txError } = await this.supabase
      .from('transactions')
      .select('transaction_id, status')
      .eq('organization_id', organizationId)
      .eq('environment', environment)
      .gte('created_at', since);
    if (txError) {
      throw new Error(`transactions read failed: ${txError.message}`);
    }

    const rows = txRows ?? [];
    const completed = rows.filter((r) => r.status === 'completed').length;
    const failed = rows.filter((r) => r.status === 'failed').length;
    const sales = completed;

    const txIds = rows
      .filter((r) => r.status === 'completed')
      .map((r) => r.transaction_id as string);

    let refunds = 0;
    if (txIds.length > 0) {
      const { count, error } = await this.supabase
        .from('refunds')
        .select('refund_id', { count: 'exact', head: true })
        .in('transaction_id', txIds);
      if (error) {
        throw new Error(`refunds read failed: ${error.message}`);
      }
      refunds = count ?? 0;
    }

    const { data: disputeRows, error: disputeError } = await this.supabase
      .from('disputes')
      .select('dispute_id, status')
      .eq('organization_id', organizationId)
      .eq('environment', environment)
      .gte('created_at', since);
    if (disputeError) {
      throw new Error(`disputes read failed: ${disputeError.message}`);
    }
    const disputes = disputeRows?.length ?? 0;
    const lostDisputes = (disputeRows ?? []).filter(
      (d) => d.status === 'lost',
    ).length;

    const authRate =
      completed + failed > 0 ? (completed / (completed + failed)) * 100 : 100;
    const refundRate = sales > 0 ? (refunds / sales) * 100 : 0;
    const disputeRate = sales > 0 ? (disputes / sales) * 100 : 0;
    const chargebackRate = sales > 0 ? (lostDisputes / sales) * 100 : 0;

    const verdicts: Record<string, ThresholdVerdict> = {
      authRate: AUTH_RATE.evaluate(authRate),
      refundRate: REFUND_RATE.evaluate(refundRate),
      disputeRate: DISPUTE_RATE.evaluate(disputeRate),
      chargebackRate: CHARGEBACK_RATE.evaluate(chargebackRate),
    };
    const overall = overallVerdict(Object.values(verdicts));

    const report: MerchantRiskReport = {
      organizationId,
      environment,
      windowDays: WINDOW_DAYS,
      sales,
      metrics: {
        authRate: round1(authRate),
        refundRate: round1(refundRate),
        disputeRate: round2(disputeRate),
        chargebackRate: round2(chargebackRate),
      },
      verdicts,
      overall,
      computedAt: new Date().toISOString(),
    };

    await this.persist(report);
    return report;
  }

  /** Store the latest evaluation on the acquiring account row, if any. */
  private async persist(report: MerchantRiskReport) {
    const { data: account } = await this.supabase
      .from('organization_acquiring_accounts')
      .select('acquiring_account_id, metadata')
      .eq('organization_id', report.organizationId)
      .eq('environment', report.environment)
      .maybeSingle();
    if (!account) {
      return;
    }
    const metadata = {
      ...((account.metadata ?? {}) as Record<string, unknown>),
      risk_metrics: {
        metrics: report.metrics,
        verdicts: report.verdicts,
        overall: report.overall,
        computed_at: report.computedAt,
        window_days: report.windowDays,
      },
    };
    const { error } = await this.supabase
      .from('organization_acquiring_accounts')
      .update({ metadata, updated_at: new Date().toISOString() })
      .eq('acquiring_account_id', account.acquiring_account_id);
    if (error) {
      this.logger.warn(`risk metrics persist failed: ${error.message}`);
    }
  }
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
