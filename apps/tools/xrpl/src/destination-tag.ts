import { createHash } from 'node:crypto';

/** XRPL DestinationTag is uint32. Hash the payout UUID so reconcile still keys off payout_id in MemoData. */
export function destinationTagFromPayoutId(payoutId: string): number {
  const digest = createHash('sha256').update(payoutId).digest();
  const tag = digest.readUInt32BE(0);
  return tag === 0 ? 1 : tag;
}
