/**
 * Decide whether the read-only production money snapshot is healthy.
 * The database script only supplies numbers. This file does not connect.
 */

const PAYMENT_ATTEMPT_FLOOR = 8;
const PAYMENT_SUCCESS_FLOOR = 0.25;
const SAMPLE_AMOUNT = 10_000;

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function requirePositive(failures, value, message) {
  const parsed = numberOrNull(value);
  if (parsed === null || parsed <= 0) failures.push(message);
  return parsed;
}

function requireSampleFee(failures, value, label) {
  const parsed = numberOrNull(value);
  if (parsed === null) {
    failures.push(`${label} fee function returned nothing for ${SAMPLE_AMOUNT} XOF`);
    return;
  }
  if (parsed <= 0 || parsed >= SAMPLE_AMOUNT) {
    failures.push(
      `${label} fee on ${SAMPLE_AMOUNT} XOF is ${parsed}, which is outside 0 to ${SAMPLE_AMOUNT}`,
    );
  }
}

/**
 * @param {Record<string, unknown>} snapshot
 * @returns {string[]}
 */
export function moneyWatchFailures(snapshot) {
  const failures = [];

  if (snapshot.fee_filters_processing !== true) {
    failures.push(
      'calculate_transaction_fee no longer filters fee_category = payment_processing',
    );
  }

  requirePositive(
    failures,
    snapshot.starter_mobile_pct,
    'Starter Wave processing fee is missing',
  );
  requirePositive(
    failures,
    snapshot.starter_card_pct,
    'Starter card processing percentage is missing',
  );
  requirePositive(
    failures,
    snapshot.starter_card_fixed,
    'Starter card fixed fee is missing',
  );

  const ownPayout = numberOrNull(snapshot.starter_own_payout_pct);
  if (ownPayout === null || ownPayout !== 0) {
    failures.push('Starter own mobile withdrawal is no longer free');
  }

  requirePositive(
    failures,
    snapshot.starter_beneficiary_pct,
    'Starter beneficiary payout fee is missing',
  );

  requireSampleFee(failures, snapshot.sample_wave_fee, 'Wave payment');
  requireSampleFee(failures, snapshot.sample_card_fee, 'Card payment');

  const ownSample = numberOrNull(snapshot.sample_own_payout_fee);
  if (ownSample === null || ownSample < 0) {
    failures.push('Own-withdrawal fee function did not return a fee');
  }
  const beneficiarySample = numberOrNull(snapshot.sample_beneficiary_fee);
  if (
    beneficiarySample === null ||
    beneficiarySample <= 0 ||
    beneficiarySample >= SAMPLE_AMOUNT
  ) {
    failures.push('Beneficiary payout fee function did not return a fee');
  }

  const attempts = numberOrNull(snapshot.payment_attempts) ?? 0;
  const completed = numberOrNull(snapshot.payment_completed) ?? 0;
  if (attempts >= PAYMENT_ATTEMPT_FLOOR && completed === 0) {
    failures.push(
      `No live payment completed in the last 24 hours (${attempts} attempts)`,
    );
  } else if (
    attempts >= PAYMENT_ATTEMPT_FLOOR &&
    completed / attempts < PAYMENT_SUCCESS_FLOOR
  ) {
    failures.push(
      `Live payment success fell to ${completed} of ${attempts} in the last 24 hours`,
    );
  }

  const uncredited = numberOrNull(snapshot.uncredited) ?? 0;
  if (uncredited > 0) {
    failures.push(
      `${uncredited} completed live payment(s) were not credited to a balance`,
    );
  }

  const stuckWave = numberOrNull(snapshot.stuck_wave) ?? 0;
  if (stuckWave > 0) {
    failures.push(
      `${stuckWave} Wave payout(s) have been pending or processing for more than 3 hours`,
    );
  }

  const stuckProcessing = numberOrNull(snapshot.stuck_processing) ?? 0;
  if (stuckProcessing > 0) {
    failures.push(
      `${stuckProcessing} payout(s) have stayed processing for more than 6 hours`,
    );
  }

  return failures;
}
