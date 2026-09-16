import assert from "node:assert/strict";
import { test } from "node:test";
import {
  COMMIT_BLOCKED_REASON,
  previewCommissionAggregation,
  runCommissionAggregationBatch,
} from "./aggregation.js";
import type { CommissionLedgerRow, FneAggregationPeriod } from "./types.js";

const period: FneAggregationPeriod = {
  kind: "month",
  startInclusive: "2026-08-01T00:00:00.000Z",
  endExclusive: "2026-09-01T00:00:00.000Z",
};

function row(
  overrides: Partial<CommissionLedgerRow> &
    Pick<CommissionLedgerRow, "organizationId" | "transactionId">,
): CommissionLedgerRow {
  return {
    occurredAt: "2026-08-15T12:00:00.000Z",
    commissionAmountMinor: 1000,
    currencyCode: "XOF",
    alreadyCertified: false,
    ...overrides,
  };
}

test("previewCommissionAggregation groups by merchant and skips certified rows", () => {
  const preview = previewCommissionAggregation(
    [
      row({ organizationId: "org-a", transactionId: "txn-1" }),
      row({
        organizationId: "org-a",
        transactionId: "txn-2",
        commissionAmountMinor: 500,
      }),
      row({
        organizationId: "org-a",
        transactionId: "txn-old",
        alreadyCertified: true,
      }),
      row({ organizationId: "org-b", transactionId: "txn-3" }),
      row({
        organizationId: "org-a",
        transactionId: "txn-july",
        occurredAt: "2026-07-31T23:59:59.000Z",
      }),
    ],
    period,
  );

  assert.equal(preview.mode, "dry-run");
  assert.equal(preview.batches.length, 2);
  const orgA = preview.batches.find(
    (batch) => batch.organizationId === "org-a",
  );
  assert.ok(orgA);
  assert.deepEqual(orgA.transactionIds, ["txn-1", "txn-2"]);
  assert.equal(orgA.totalCommissionMinor, 1500);
  assert.deepEqual(orgA.skippedAlreadyCertified, ["txn-old"]);
  assert.equal(preview.skippedOutOfPeriod.length, 1);
  assert.equal(preview.skippedOutOfPeriod[0]?.transactionId, "txn-july");
});

test("previewCommissionAggregation does not merge mixed currencies", () => {
  const preview = previewCommissionAggregation(
    [
      row({ organizationId: "org-a", transactionId: "txn-xof" }),
      row({
        organizationId: "org-a",
        transactionId: "txn-usd",
        currencyCode: "USD",
      }),
    ],
    period,
  );
  assert.equal(preview.batches.length, 0);
  assert.equal(preview.skippedMixedCurrency.length, 2);
});

test("runCommissionAggregationBatch commit stays blocked pending accountant confirmation", () => {
  const rows = [row({ organizationId: "org-a", transactionId: "txn-1" })];
  const dry = runCommissionAggregationBatch({ mode: "dry-run", period }, rows);
  assert.equal(dry.mode, "dry-run");
  if (dry.mode !== "dry-run") return;
  assert.equal(dry.batches.length, 1);

  const commit = runCommissionAggregationBatch(
    { mode: "commit", period, organizationId: "org-a" },
    rows,
  );
  assert.equal(commit.mode, "commit");
  if (commit.mode !== "commit") return;
  assert.equal(commit.ok, false);
  assert.equal(commit.reason, COMMIT_BLOCKED_REASON);
  assert.equal(commit.preview.batches.length, 1);
});
