import assert from 'node:assert/strict';
import { test } from 'node:test';
import { destinationTagFromPayoutId } from '../src/destination-tag.js';

test('DestinationTag is a stable nonzero uint32 for a payout UUID', () => {
  const payoutId = '11111111-1111-4111-8111-111111111111';
  const tag = destinationTagFromPayoutId(payoutId);
  assert.equal(tag, destinationTagFromPayoutId(payoutId));
  assert.ok(tag >= 1);
  assert.ok(tag <= 0xffffffff);
});
