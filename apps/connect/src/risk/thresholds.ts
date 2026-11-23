/**
 * Merchant risk thresholds — ported from Polar's organization_review
 * thresholds.py (same warn/crit lines). Single source of truth shared by the
 * risk evaluator and any admin UI so both judge merchants identically.
 */

export type ThresholdVerdict = "ok" | "warn" | "crit";

export class MetricThreshold {
  constructor(
    readonly label: string,
    readonly warn: number,
    readonly crit: number,
    readonly higherIsWorse: boolean = true,
    readonly unit: string = "%",
  ) {}

  evaluate(value: number): ThresholdVerdict {
    if (this.higherIsWorse) {
      if (value >= this.crit) return "crit";
      if (value >= this.warn) return "warn";
      return "ok";
    }
    if (value <= this.crit) return "crit";
    if (value <= this.warn) return "warn";
    return "ok";
  }
}

export const AUTH_RATE = new MetricThreshold("Auth Rate", 90, 75, false);
export const REFUND_RATE = new MetricThreshold("Refund Rate", 10, 15);
export const DISPUTE_RATE = new MetricThreshold("Dispute Rate", 0.5, 0.75);
export const CHARGEBACK_RATE = new MetricThreshold(
  "Chargeback Rate",
  0.15,
  0.3,
);

export const ALL_THRESHOLDS = [
  AUTH_RATE,
  REFUND_RATE,
  DISPUTE_RATE,
  CHARGEBACK_RATE,
] as const;

export type OverallRiskVerdict = "ok" | "review" | "critical";

export function overallVerdict(
  verdicts: ThresholdVerdict[],
): OverallRiskVerdict {
  if (verdicts.includes("crit")) return "critical";
  if (verdicts.includes("warn")) return "review";
  return "ok";
}
