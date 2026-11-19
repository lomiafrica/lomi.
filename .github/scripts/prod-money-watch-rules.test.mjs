import assert from 'node:assert/strict';
import test from 'node:test';
import { moneyWatchFailures } from './prod-money-watch-rules.mjs';

function healthy() {
  return {
    fee_filters_processing: true,
    starter_mobile_pct: 2.5,
    starter_card_pct: 4.5,
    starter_card_fixed: 250,
    starter_own_payout_pct: 0,
    starter_beneficiary_pct: 2,
    sample_wave_fee: 200,
    sample_card_fee: 700,
    sample_own_payout_fee: 0,
    sample_beneficiary_fee: 200,
    payment_attempts: 31,
    payment_completed: 27,
    uncredited: 0,
    stuck_wave: 0,
    stuck_processing: 0,
  };
}

test('a healthy production snapshot passes', () => {
  assert.deepEqual(moneyWatchFailures(healthy()), []);
});

test('a quiet period with too few attempts does not page', () => {
  const snapshot = healthy();
  snapshot.payment_attempts = 3;
  snapshot.payment_completed = 0;
  assert.deepEqual(moneyWatchFailures(snapshot), []);
});

test('payments that are attempted and never completed fail', () => {
  const snapshot = healthy();
  snapshot.payment_attempts = 10;
  snapshot.payment_completed = 1;
  const failures = moneyWatchFailures(snapshot);
  assert.equal(failures.length, 1);
  assert.match(failures[0], /success fell/);
});

test('a fee function that stops filtering processing fees fails', () => {
  const snapshot = healthy();
  snapshot.fee_filters_processing = false;
  snapshot.starter_own_payout_pct = 1;
  snapshot.uncredited = 2;
  snapshot.stuck_wave = 1;
  const failures = moneyWatchFailures(snapshot);
  assert.equal(failures.length, 4);
});
