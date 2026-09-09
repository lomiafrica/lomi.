/**
 * lomi. Network transfers (hand-written resource).
 *
 * Transfers move funds from the Operator balance to a Member Account
 * (`acct_…`): separate charges and transfers, ad-hoc payouts, and reversals.
 * They always use the Operator API key without a `Lomi-Account` header.
 *
 * Money confirmation is two-step. The first `create` / `reverse` call without
 * `confirmation_token` returns `{ requires_confirmation: true, confirmation_token,
 * expires_at, preview }`. Repeat the same call with that token (and the same
 * `Idempotency-Key`) to execute. `createConfirmed` / `reverseConfirmed` run both
 * steps for you.
 */

import type { JsonObject } from '@lomi./shared';
import type { LomiClient } from '../client.js';
import { requestWithClient } from '../http.js';
import type { LomiRequestOptions } from '../request-options.js';

export type TransferType =
  | 'destination'
  | 'separate'
  | 'operator_fee'
  | 'processing_fee_cover'
  | 'fee_reversal'
  | 'transfer_reversal'
  | 'loss_cover';

export interface Transfer {
  id: string;
  object: 'transfer';
  amount: number;
  currency_code: string;
  settled_amount: number;
  settled_currency: string;
  transfer_type: TransferType | string;
  status: string;
  environment: 'test' | 'live' | string;
  destination: string;
  source: string | null;
  source_transaction_id: string | null;
  refund_id: string | null;
  reversed_transfer_id: string | null;
  reversed_amount: number;
  transfer_group: string | null;
  description: string | null;
  metadata: JsonObject | null;
  created_at: string;
  updated_at: string;
}

export interface TransferList {
  object: 'list';
  data: Transfer[];
  has_more: boolean;
  next_cursor: string | null;
  limit: number;
}

/** First-step response of a money-moving call made without `confirmation_token`. */
export interface MoneyConfirmationRequired {
  requires_confirmation: true;
  confirmation_token: string;
  expires_at: string;
  preview: JsonObject;
}

export interface CreateTransferParams {
  /** Amount in `currency_code` minor units (XOF has no decimals). */
  amount: number;
  currency_code: string;
  /** Member Account (`acct_…`) with the `transfer.receive` capability. */
  destination: string;
  /** Group key shared with the payment(s) this transfer settles. */
  transfer_group?: string;
  /** Transaction this transfer settles (reporting, refunds). */
  source_transaction_id?: string;
  description?: string;
  metadata?: JsonObject;
  /** Token from the preview step. Omit on the first call. */
  confirmation_token?: string;
}

export interface ReverseTransferParams {
  /** Defaults to the remaining unreversed amount. */
  amount?: number;
  description?: string;
  metadata?: JsonObject;
  /** Token from the preview step. Omit on the first call. */
  confirmation_token?: string;
}

export interface ListTransfersParams {
  destination?: string;
  transfer_group?: string;
  source_transaction_id?: string;
  /** Comma-separated `TransferType` values. */
  transfer_type?: string;
  cursor?: string;
  limit?: number;
}

export function isMoneyConfirmationRequired(
  value: Transfer | MoneyConfirmationRequired,
): value is MoneyConfirmationRequired {
  return (
    'requires_confirmation' in value && value.requires_confirmation === true
  );
}

export class TransfersResource {
  constructor(private readonly client: LomiClient) {}

  /**
   * Create a transfer to a Member Account (`POST /transfers`).
   *
   * Without `confirmation_token` the API answers with a preview; call again with
   * the returned token to execute. Send `options.idempotencyKey` on both calls.
   */
  public async create(
    params: CreateTransferParams,
    options?: LomiRequestOptions,
  ): Promise<Transfer | MoneyConfirmationRequired> {
    return requestWithClient<Transfer | MoneyConfirmationRequired>(
      this.client,
      {
        method: 'POST',
        url: '/transfers',
        body: params,
        ...options,
      },
    );
  }

  /** Preview then execute a transfer in one call (two HTTP requests). */
  public async createConfirmed(
    params: CreateTransferParams,
    options?: LomiRequestOptions,
  ): Promise<Transfer> {
    const first = await this.create(params, options);
    if (!isMoneyConfirmationRequired(first)) return first;
    const second = await this.create(
      { ...params, confirmation_token: first.confirmation_token },
      options,
    );
    if (isMoneyConfirmationRequired(second)) {
      throw new Error('lomi. API asked for confirmation twice; aborting transfer.');
    }
    return second;
  }

  /** List transfers created by your Network (`GET /transfers`). */
  public async list(
    params?: ListTransfersParams,
    options?: LomiRequestOptions,
  ): Promise<TransferList> {
    return requestWithClient<TransferList>(this.client, {
      method: 'GET',
      url: '/transfers',
      query: params,
      ...options,
    });
  }

  /** Iterate every transfer across cursor pages. */
  public async *listAll(
    params?: ListTransfersParams,
    options?: LomiRequestOptions,
  ): AsyncGenerator<Transfer, void, undefined> {
    let cursor: string | undefined = params?.cursor;
    while (true) {
      const page = await this.list({ ...params, cursor }, options);
      for (const item of page.data) yield item;
      if (!page.has_more || !page.next_cursor) break;
      cursor = page.next_cursor;
    }
  }

  /** Retrieve one transfer (`GET /transfers/{id}`). */
  public async get(id: string, options?: LomiRequestOptions): Promise<Transfer> {
    return requestWithClient<Transfer>(this.client, {
      method: 'GET',
      url: '/transfers/{id}',
      path: { id },
      ...options,
    });
  }

  /**
   * Reverse a transfer fully or partially (`POST /transfers/{id}/reversals`).
   * Same two-step confirmation as `create`.
   */
  public async reverse(
    id: string,
    params: ReverseTransferParams = {},
    options?: LomiRequestOptions,
  ): Promise<Transfer | MoneyConfirmationRequired> {
    return requestWithClient<Transfer | MoneyConfirmationRequired>(
      this.client,
      {
        method: 'POST',
        url: '/transfers/{id}/reversals',
        path: { id },
        body: params,
        ...options,
      },
    );
  }

  /** Preview then execute a reversal in one call (two HTTP requests). */
  public async reverseConfirmed(
    id: string,
    params: ReverseTransferParams = {},
    options?: LomiRequestOptions,
  ): Promise<Transfer> {
    const first = await this.reverse(id, params, options);
    if (!isMoneyConfirmationRequired(first)) return first;
    const second = await this.reverse(
      id,
      { ...params, confirmation_token: first.confirmation_token },
      options,
    );
    if (isMoneyConfirmationRequired(second)) {
      throw new Error('lomi. API asked for confirmation twice; aborting reversal.');
    }
    return second;
  }
}
