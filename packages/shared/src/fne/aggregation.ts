import type {
  AdminCommissionAggregationRequest,
  CommissionAggregationBatch,
  CommissionLedgerRow,
  FneAggregationPeriod,
} from "./types.js";

export const COMMIT_BLOCKED_REASON =
  "commit_blocked_pending_accountant_confirmation";

export type AggregationPreview = {
  mode: "dry-run";
  period: FneAggregationPeriod;
  batches: CommissionAggregationBatch[];
  skippedMixedCurrency: CommissionLedgerRow[];
  skippedOutOfPeriod: CommissionLedgerRow[];
};

export type AggregationCommitBlocked = {
  mode: "commit";
  ok: false;
  reason: typeof COMMIT_BLOCKED_REASON;
  preview: AggregationPreview;
};

function inPeriod(occurredAt: string, period: FneAggregationPeriod): boolean {
  return (
    occurredAt >= period.startInclusive && occurredAt < period.endExclusive
  );
}

/**
 * Group commission rows into one FNE candidate per merchant per period.
 * Does not call KOMPTO. Mixed-currency groups are skipped, not merged.
 */
export function previewCommissionAggregation(
  rows: CommissionLedgerRow[],
  period: FneAggregationPeriod,
  organizationId?: string,
): AggregationPreview {
  const skippedOutOfPeriod: CommissionLedgerRow[] = [];
  const skippedMixedCurrency: CommissionLedgerRow[] = [];
  const grouped = new Map<
    string,
    {
      organizationId: string;
      currencyCode: string;
      transactionIds: string[];
      totalCommissionMinor: number;
      skippedAlreadyCertified: string[];
      mixed: boolean;
      rows: CommissionLedgerRow[];
    }
  >();

  for (const row of rows) {
    if (organizationId !== undefined && row.organizationId !== organizationId) {
      continue;
    }
    if (!inPeriod(row.occurredAt, period)) {
      skippedOutOfPeriod.push(row);
      continue;
    }

    const existing = grouped.get(row.organizationId);
    if (!existing) {
      grouped.set(row.organizationId, {
        organizationId: row.organizationId,
        currencyCode: row.currencyCode,
        transactionIds: row.alreadyCertified ? [] : [row.transactionId],
        totalCommissionMinor: row.alreadyCertified
          ? 0
          : row.commissionAmountMinor,
        skippedAlreadyCertified: row.alreadyCertified
          ? [row.transactionId]
          : [],
        mixed: false,
        rows: [row],
      });
      continue;
    }

    existing.rows.push(row);
    if (existing.currencyCode !== row.currencyCode) {
      existing.mixed = true;
      continue;
    }

    if (row.alreadyCertified) {
      existing.skippedAlreadyCertified.push(row.transactionId);
      continue;
    }

    existing.transactionIds.push(row.transactionId);
    existing.totalCommissionMinor += row.commissionAmountMinor;
  }

  const batches: CommissionAggregationBatch[] = [];
  for (const group of grouped.values()) {
    if (group.mixed) {
      skippedMixedCurrency.push(...group.rows);
      continue;
    }
    if (group.transactionIds.length === 0) continue;
    batches.push({
      organizationId: group.organizationId,
      period,
      transactionIds: group.transactionIds,
      totalCommissionMinor: group.totalCommissionMinor,
      currencyCode: group.currencyCode,
      skippedAlreadyCertified: group.skippedAlreadyCertified,
    });
  }

  return {
    mode: "dry-run",
    period,
    batches,
    skippedMixedCurrency,
    skippedOutOfPeriod,
  };
}

/**
 * Admin hook. Dry-run returns grouped batches. Commit is intentionally blocked
 * until finance confirms FNE treatment of commissions.
 */
export function runCommissionAggregationBatch(
  request: AdminCommissionAggregationRequest,
  rows: CommissionLedgerRow[],
): AggregationPreview | AggregationCommitBlocked {
  const preview = previewCommissionAggregation(
    rows,
    request.period,
    request.organizationId,
  );

  switch (request.mode) {
    case "dry-run":
      return preview;
    case "commit":
      return {
        mode: "commit",
        ok: false,
        reason: COMMIT_BLOCKED_REASON,
        preview,
      };
    default: {
      const unreachable: never = request.mode;
      throw new Error(`Unhandled aggregation mode: ${String(unreachable)}`);
    }
  }
}
