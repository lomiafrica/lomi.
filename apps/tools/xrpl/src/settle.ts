import { randomUUID } from 'node:crypto';
import { convertStringToHex, type Payment, type TxResponse } from 'xrpl';
import { explorerTx, SETTLE_DROPS } from './config.js';
import { destinationTagFromPayoutId } from './destination-tag.js';
import { withClient } from './faucet.js';
import { loadWallet } from './keys.js';
import { writeTestnetProof } from './proof.js';

export async function settleOnce(): Promise<{
  payoutId: string;
  destinationTag: number;
  hash: string;
  explorer: string;
}> {
  const omnibus = loadWallet('omnibus');
  const merchant = loadWallet('merchant');
  const payoutId = randomUUID();
  const destinationTag = destinationTagFromPayoutId(payoutId);

  const result = await withClient(async (client) => {
    const payment: Payment = {
      TransactionType: 'Payment',
      Account: omnibus.address,
      Destination: merchant.address,
      Amount: SETTLE_DROPS,
      DestinationTag: destinationTag,
      Memos: [
        {
          Memo: {
            MemoType: convertStringToHex('payout_id'),
            MemoData: convertStringToHex(payoutId),
          },
        },
      ],
    };
    const prepared = await client.autofill(payment);
    const signed = omnibus.sign(prepared);
    const submitted: TxResponse = await client.submitAndWait(signed.tx_blob);
    const hash = submitted.result.hash;
    if (!hash) {
      throw new Error(`XRPL Payment missing hash: ${JSON.stringify(submitted.result)}`);
    }
    const engine = submitted.result.meta;
    if (
      engine &&
      typeof engine === 'object' &&
      'TransactionResult' in engine &&
      engine.TransactionResult !== 'tesSUCCESS'
    ) {
      throw new Error(`XRPL Payment failed: ${engine.TransactionResult}`);
    }
    return hash;
  });

  writeTestnetProof({
    status: 'settled',
    omnibusAddress: omnibus.address,
    merchantAddress: merchant.address,
    payoutId,
    destinationTag,
    settlementTx: result,
  });

  return {
    payoutId,
    destinationTag,
    hash: result,
    explorer: explorerTx(result),
  };
}
