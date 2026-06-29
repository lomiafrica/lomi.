import {
  Injectable,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../../utils/supabase/supabase.service';
import { WideEventService } from '../../../utils/telemetry/wide-event.service';
import { WebhookSenderService } from '../../webhook-sender.service';
import { sanitizeMerchantWebhookTransactionPayload } from '../../sanitize-merchant-webhook-transaction-payload';
import { maybeNotifySubscriptionRenewed } from '../../subscription-webhook.helper';
import { WebhookEvent } from '../../../utils/types/api';
import * as crypto from 'crypto';

@Injectable()
export class WaveWebhookService {
  private readonly logger = new Logger(WaveWebhookService.name);
  private readonly webhookSecret = process.env.WAVE_WEBHOOK_SECRET;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly webhookSender: WebhookSenderService,
    private readonly wideEvent: WideEventService,
  ) {}

  /**
   * Main webhook handler
   */
  async handleWebhook(
    headers: Record<string, string>,
    body: any,
    rawBody: string,
  ) {
    // Verify webhook signature
    if (!this.verifyWebhook(headers, body, rawBody)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const event = body;

    // Validate event structure
    if (!event || typeof event !== 'object') {
      this.logger.error('Invalid webhook payload: body is not an object');
      this.logger.debug(`Received body type: ${typeof body}`);
      throw new Error('Invalid webhook payload structure');
    }

    if (!event.type) {
      this.logger.error('Missing event type in webhook payload');
      this.logger.debug(`Event keys: ${Object.keys(event).join(', ')}`);
      this.logger.debug(
        `Event content: ${JSON.stringify(event).substring(0, 500)}`,
      );
      throw new Error('Missing event type in webhook payload');
    }

    const eventDedupeKey =
      event.data?.id ??
      event.data?.transaction_id ??
      crypto.createHash('sha256').update(rawBody).digest('hex');

    const { data: claimed, error: claimError } = await this.supabase.rpc(
      'claim_inbound_provider_webhook_event',
      {
        p_provider: 'WAVE',
        p_provider_event_id: `${event.type}:${String(eventDedupeKey)}`,
        p_metadata: { type: event.type } as any,
      },
    );

    if (claimError) {
      this.logger.warn(
        `Wave inbound idempotency claim error: ${claimError.message}`,
      );
    } else if (claimed === false) {
      this.logger.log({
        message: 'wave_webhook_duplicate',
        event_type: event.type,
        dedupe_key: eventDedupeKey,
      });
      return {
        message: 'duplicate_event',
        duplicate: true,
      };
    }

    this.logger.log(`Processing Wave webhook: ${event.type}`);
    this.logger.debug(`Event data: ${JSON.stringify(event, null, 2)}`);

    // Wide Event: Log webhook receipt with structured context
    this.logger.log({
      message: 'wave_webhook_received',
      event_type: event.type,
      wave_session_id: event.data?.id,
      transaction_id: event.data?.transaction_id,
      amount: event.data?.amount,
      currency: event.data?.currency,
      timestamp: new Date().toISOString(),
    });

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        return await this.handleCheckoutCompleted(event.data);

      case 'checkout.session.payment_failed':
        return await this.handlePaymentFailed(event.data);

      case 'checkout.session.refunded':
        return await this.handleRefund(event.data);

      case 'checkout.session.expired':
        return await this.handleExpired(event.data);

      case 'merchant.payment_received':
        return await this.handleMerchantPaymentReceived(event.data);

      case 'test.test_event':
        this.logger.log('Received test event from Wave');
        return { message: 'Test event received' };

      default:
        this.logger.warn(`Unsupported event type: ${event.type}`);
        return { message: `Event type ${event.type} not handled` };
    }
  }

  /**
   * Verify webhook signature using Wave's signature verification
   */
  private verifyWebhook(
    headers: Record<string, string>,
    body: any,
    rawBody: string,
  ): boolean {
    this.logger.debug('Webhook headers received');
    for (const [key, value] of Object.entries(headers)) {
      const maskedValue =
        key.toLowerCase().includes('authorization') ||
        key.toLowerCase().includes('secret') ||
        key.toLowerCase().includes('signature')
          ? `${value?.substring(0, 10)}...`
          : value;
      this.logger.debug(`  ${key}: ${maskedValue}`);
    }

    if (!this.webhookSecret) {
      this.logger.error(
        'Wave webhook secret not configured — rejecting request',
      );
      return false;
    }

    const waveSignature =
      headers['wave-signature'] || headers['Wave-Signature'];

    if (waveSignature) {
      this.logger.debug('Found Wave-Signature header, verifying signature');
      try {
        const [timeStamp, signature] = waveSignature.split(',');
        const eventTime = timeStamp.split('=')[1];
        const eventSignature = signature.split('=')[1];

        const now = Math.floor(Date.now() / 1000);
        const fiveMinutesAgo = now - 5 * 60;

        if (parseInt(eventTime, 10) < fiveMinutesAgo) {
          this.logger.warn('Wave signature timestamp is too old');
          return false;
        }

        const bodyString = typeof body === 'string' ? body : rawBody;
        const expectedSignature = crypto
          .createHmac('sha256', this.webhookSecret)
          .update(`${timeStamp}.${bodyString}`)
          .digest('hex');

        const signatureMatches = crypto.timingSafeEqual(
          Buffer.from(eventSignature),
          Buffer.from(expectedSignature),
        );

        if (signatureMatches) {
          this.logger.log('Wave signature verification successful');
          return true;
        }

        this.logger.warn('Wave signature verification failed');
        return false;
      } catch (error) {
        this.logger.error('Error verifying Wave signature:', error);
        return false;
      }
    }

    const authHeader =
      headers.authorization ||
      headers.Authorization ||
      headers['wave-authorization'] ||
      headers['Wave-Authorization'];

    if (!authHeader) {
      this.logger.warn('Missing Wave authorization headers');
      return false;
    }

    try {
      let providedSecret = authHeader;

      if (authHeader.toLowerCase().startsWith('bearer ')) {
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
          this.logger.warn('Invalid Authorization header format');
          return false;
        }
        providedSecret = parts[1];
      }

      const bufA = Buffer.from(providedSecret);
      const bufB = Buffer.from(this.webhookSecret);
      if (bufA.length !== bufB.length) {
        return false;
      }
      return crypto.timingSafeEqual(bufA, bufB);
    } catch (error) {
      this.logger.error('Error verifying Authorization header:', error);
      return false;
    }
  }

  /**
   * Handle checkout.session.completed event
   */
  private async handleCheckoutCompleted(data: any) {
    const waveTxnId = data.transaction_id;
    const sessionId = data.id;
    this.logger.log('Processing completed checkout session:', {
      wave_session_id: sessionId,
      transaction_id: waveTxnId,
      amount: data.amount,
      currency: data.currency,
      checkout_status: data.checkout_status,
      payment_status: data.payment_status,
    });

    // Find transaction using RPC (untyped - use getClient with any cast)
    const { data: transactions, error: txnError } = await (
      this.supabase.getClient() as any
    ).rpc('get_wave_transaction_by_checkout_id', {
      p_provider_checkout_id: sessionId,
    });

    if (txnError) {
      this.logger.error('Error finding transaction:', txnError);
      throw new Error('Error finding transaction');
    }

    const transactionsArray = transactions as any;

    if (
      !transactionsArray ||
      !Array.isArray(transactionsArray) ||
      transactionsArray.length === 0
    ) {
      this.logger.warn(
        `No transaction found with provider_checkout_id: ${sessionId}`,
      );

      // 1. Try lookup by client_reference (which maps to checkout_session_id)
      if (data.client_reference) {
        this.logger.debug(
          `Attempting lookup/recovery by client_reference: ${data.client_reference}`,
        );

        try {
          // Use RPC to find OR recover the transaction
          // This allows us to handle both "unlinked" and "missing" transaction cases
          const { data: recoveryResult, error: rpcError } = await (
            this.supabase.getClient() as any
          ).rpc('recover_missing_wave_transaction', {
            p_client_reference: data.client_reference,
            p_wave_session_id: sessionId,
            p_wave_transaction_id: waveTxnId,
            p_amount: data.amount ? parseInt(String(data.amount), 10) : null,
            p_currency: data.currency,
          });

          if (rpcError) {
            this.logger.warn('Error executing recovery RPC:', rpcError);
          } else if (recoveryResult && recoveryResult.length > 0) {
            const result = recoveryResult[0];
            const wasRecovered = result.r_was_recovered;

            this.logger.log(
              `Resolved transaction ${result.r_transaction_id} via client_reference (Recovered: ${wasRecovered})`,
            );

            // Process completion
            const recoveryMetadata =
              await this.buildWaveCheckoutCompletionMetadata(
                {
                  ...data,
                  transaction_id: waveTxnId,
                },
                result.r_transaction_id,
                { recovered: wasRecovered },
              );
            await this.updateTransactionStatus(
              result.r_transaction_id,
              'completed',
              recoveryMetadata,
            );

            this.logWavePaymentCompleted({
              organizationId: result.r_organization_id,
              sessionId,
              transactionId: result.r_transaction_id,
              amount: data.amount,
              currency: data.currency,
            });

            await this.triggerMerchantWebhook(
              result.r_transaction_id,
              result.r_organization_id,
              'PAYMENT_SUCCEEDED',
            );

            return { transaction_id: result.r_transaction_id };
          }
        } catch (err) {
          this.logger.error('Unexpected error in recovery lookup:', err);
        }
      }

      // 2. Try checkout_sessions table as fallback
      const { data: checkoutSession, error: sessionError } = await (
        this.supabase.getClient() as any
      ).rpc('get_checkout_session_by_wave_id', {
        p_wave_session_id: sessionId,
      });

      // The RPC returns an array, get the first result (deterministically ordered)
      const sessionArray = Array.isArray(checkoutSession)
        ? checkoutSession
        : [checkoutSession];
      const sessionData = sessionArray[0] as any;

      if (sessionError || !sessionData) {
        this.logger.error('Error finding checkout session:', sessionError);
        throw new NotFoundException('Transaction not found');
      }

      // Validate that we have a transaction_id from the checkout session
      if (!sessionData.transaction_id) {
        this.logger.error(
          'Checkout session found but no transaction_id associated:',
          {
            checkout_session_id: sessionData.checkout_session_id,
            wave_session_id: sessionId,
          },
        );
        throw new NotFoundException(
          'No transaction associated with checkout session',
        );
      }

      this.logger.log(
        `Found transaction ${sessionData.transaction_id} from checkout session ${sessionData.checkout_session_id}`,
      );

      // Update checkout session status (balance is now updated automatically by the DB)
      const sessionCompletionMetadata =
        await this.buildWaveCheckoutCompletionMetadata(
          {
            ...data,
            transaction_id: waveTxnId,
          },
          sessionData.transaction_id,
        );
      await this.updateTransactionStatus(
        sessionData.transaction_id,
        'completed',
        sessionCompletionMetadata,
      );

      this.logWavePaymentCompleted({
        organizationId: sessionData.organization_id,
        sessionId,
        transactionId: sessionData.transaction_id,
        amount: data.amount,
        currency: data.currency,
      });

      // Note: Balance is now automatically updated by the database when status = 'completed'

      // Trigger merchant webhooks
      await this.triggerMerchantWebhook(
        sessionData.transaction_id,
        sessionData.organization_id,
        'PAYMENT_SUCCEEDED',
      );

      return { transaction_id: sessionData.transaction_id };
    }

    // Use the deterministically ordered first transaction (newest)
    const transaction = transactionsArray[0];
    this.logger.log(
      `Processing transaction ${transaction.transaction_id} (created: ${transaction.created_at})`,
    );

    // Update transaction status (balance is now updated automatically by the DB)
    const completionMetadata = await this.buildWaveCheckoutCompletionMetadata(
      {
        ...data,
        transaction_id: waveTxnId,
      },
      transaction.transaction_id,
    );
    await this.updateTransactionStatus(
      transaction.transaction_id,
      'completed',
      {
        wave_session_id: sessionId,
        ...completionMetadata,
      },
    );

    this.logWavePaymentCompleted({
      organizationId: transaction.organization_id,
      sessionId,
      transactionId: transaction.transaction_id,
      amount: data.amount,
      currency: data.currency,
    });

    // Note: Balance is now automatically updated by the database when status = 'completed'
    // The update_balances_for_transaction function is called internally by update_transaction_status

    // Trigger merchant webhooks
    await this.triggerMerchantWebhook(
      transaction.transaction_id,
      transaction.organization_id,
      'PAYMENT_SUCCEEDED',
    );

    return { transaction_id: transaction.transaction_id };
  }

  /**
   * Handle checkout.session.payment_failed event
   */
  private async handlePaymentFailed(data: any) {
    this.logger.log('Processing failed checkout session:', {
      wave_session_id: data.id,
      error: data.last_payment_error,
    });

    // Find transaction using RPC (untyped - use getClient with any cast)
    const { data: transactions, error: txnError } = await (
      this.supabase.getClient() as any
    ).rpc('get_wave_transaction_by_checkout_id', {
      p_provider_checkout_id: data.id,
    });

    const transactionsArray = transactions as any;

    if (
      txnError ||
      !transactionsArray ||
      !Array.isArray(transactionsArray) ||
      transactionsArray.length === 0
    ) {
      // Try checkout_sessions table as fallback
      const { data: checkoutSession, error: sessionError } = await (
        this.supabase.getClient() as any
      ).rpc('get_checkout_session_by_wave_id', {
        p_wave_session_id: data.id,
      });

      const sessionData = checkoutSession as any;

      if (sessionError || !sessionData) {
        this.logger.error('Error finding checkout session:', sessionError);
        throw new NotFoundException('Transaction not found');
      }

      await this.updateTransactionStatus(sessionData.transaction_id, 'failed', {
        wave_payment_status: 'failed',
        wave_payment_error: data.last_payment_error,
        wave_session: {
          id: data.id,
          checkout_status: data.checkout_status,
          payment_status: data.payment_status,
          last_payment_error: data.last_payment_error,
          when_created: data.when_created,
          when_expires: data.when_expires,
        },
      });

      await this.triggerMerchantWebhook(
        sessionData.transaction_id,
        sessionData.organization_id,
        'PAYMENT_FAILED',
      );

      return { transaction_id: sessionData.transaction_id };
    }

    const transaction = transactionsArray[0];
    await this.updateTransactionStatus(transaction.transaction_id, 'failed', {
      wave_session_id: data.id,
      wave_payment_error: data.last_payment_error,
      wave_session: {
        id: data.id,
        checkout_status: data.checkout_status,
        payment_status: data.payment_status,
        last_payment_error: data.last_payment_error,
        when_created: data.when_created,
        when_expires: data.when_expires,
      },
    });

    await this.triggerMerchantWebhook(
      transaction.transaction_id,
      transaction.organization_id,
      'PAYMENT_FAILED',
    );

    return { transaction_id: transaction.transaction_id };
  }

  /**
   * Handle checkout.session.refunded event
   */
  private async handleRefund(data: any) {
    this.logger.log('Processing refunded checkout session:', {
      wave_session_id: data.id,
      transaction_id: data.transaction_id,
    });

    const { data: transactions, error: txnError } = await (
      this.supabase.getClient() as any
    ).rpc('get_wave_transaction_by_checkout_id', {
      p_provider_checkout_id: data.id,
    });

    const transactionsArray = transactions as any;

    if (
      txnError ||
      !transactionsArray ||
      !Array.isArray(transactionsArray) ||
      transactionsArray.length === 0
    ) {
      this.logger.error('Transaction not found for refund');
      throw new NotFoundException('Transaction not found for refund');
    }

    const transaction = transactionsArray[0];
    await this.updateTransactionStatus(transaction.transaction_id, 'refunded', {
      wave_session_id: data.id,
      wave_transaction_id: data.transaction_id,
      wave_session: {
        id: data.id,
        checkout_status: data.checkout_status,
        payment_status: 'refunded',
        when_created: data.when_created,
        when_expires: data.when_expires,
        when_refunded: new Date().toISOString(),
      },
    });

    return { transaction_id: transaction.transaction_id };
  }

  /**
   * Handle checkout.session.expired event
   */
  private async handleExpired(data: any) {
    this.logger.log('Processing expired checkout session:', {
      wave_session_id: data.id,
    });

    const { data: transactions, error: txnError } = await (
      this.supabase.getClient() as any
    ).rpc('get_wave_transaction_by_checkout_id', {
      p_provider_checkout_id: data.id,
    });

    const transactionsArray = transactions as any;

    if (
      txnError ||
      !transactionsArray ||
      !Array.isArray(transactionsArray) ||
      transactionsArray.length === 0
    ) {
      this.logger.error('Transaction not found for expiration');
      throw new NotFoundException('Transaction not found for expiration');
    }

    const transaction = transactionsArray[0];
    await this.updateTransactionStatus(transaction.transaction_id, 'expired', {
      wave_session_id: data.id,
      wave_session: {
        id: data.id,
        checkout_status: data.checkout_status,
        payment_status: 'expired',
        when_created: data.when_created,
        when_expires: data.when_expires,
        expired_at: new Date().toISOString(),
      },
    });

    return { transaction_id: transaction.transaction_id };
  }

  /**
   * Persist the actual Wave wallet used (`sender_mobile`) on the transaction.
   */
  private async handleMerchantPaymentReceived(data: any) {
    const waveTxnId = data?.id;
    const senderMobile =
      typeof data?.sender_mobile === 'string'
        ? data.sender_mobile.trim()
        : null;

    if (!waveTxnId || !senderMobile) {
      this.logger.warn(
        'merchant.payment_received missing transaction id or sender_mobile',
      );
      return { message: 'ignored_missing_fields' };
    }

    const transaction =
      await this.findWaveTransactionByProviderTxnId(waveTxnId);
    if (!transaction) {
      this.logger.warn(`No transaction found for Wave payment ${waveTxnId}`);
      return { message: 'transaction_not_found' };
    }

    await this.updateTransactionStatus(
      transaction.transaction_id,
      transaction.status,
      {
        payment_mobile: senderMobile,
        sender_mobile: senderMobile,
      },
    );

    return { transaction_id: transaction.transaction_id };
  }

  private readWavePaymentMobile(
    source?: Record<string, unknown> | null,
  ): string | undefined {
    if (!source) return undefined;

    const keys = [
      'sender_mobile',
      'payment_mobile',
      'mobile_money_phone',
      'customerPhone',
      'customer_phone',
      'phoneNumber',
      'phone',
      'restrict_payer_mobile',
      'enforce_payer_mobile',
    ];

    for (const key of keys) {
      const value = source[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    return undefined;
  }

  private async buildWaveCheckoutCompletionMetadata(
    data: Record<string, any>,
    transactionId: string,
    extras?: Record<string, unknown>,
  ): Promise<Record<string, any>> {
    const { data: txnRows, error } = await (
      this.supabase.getClient() as any
    ).rpc('get_transaction', {
      p_transaction_id: transactionId,
    });

    if (error) {
      this.logger.warn(
        `Failed to load transaction metadata for ${transactionId}: ${error.message}`,
      );
    }

    const txnRow = Array.isArray(txnRows) ? txnRows[0] : txnRows;
    const existingMetadata =
      txnRow?.metadata &&
      typeof txnRow.metadata === 'object' &&
      !Array.isArray(txnRow.metadata)
        ? (txnRow.metadata as Record<string, unknown>)
        : null;

    const paymentMobile =
      this.readWavePaymentMobile(data) ??
      this.readWavePaymentMobile(existingMetadata ?? undefined);

    return {
      wave_transaction_id: data.transaction_id ?? data.id,
      wave_payment_status: 'succeeded',
      wave_session: {
        id: data.id,
        checkout_status: data.checkout_status,
        payment_status: data.payment_status,
        transaction_id: data.transaction_id ?? data.id,
        when_created: data.when_created,
        when_expires: data.when_expires,
        when_completed: data.when_completed,
        client_reference: data.client_reference,
        ...extras,
      },
      ...(paymentMobile ? { payment_mobile: paymentMobile } : {}),
    };
  }

  private async findWaveTransactionByProviderTxnId(waveTxnId: string): Promise<{
    transaction_id: string;
    status: string;
  } | null> {
    const { data, error } = await (this.supabase.getClient() as any).rpc(
      'find_wave_transaction_by_provider_txn_id',
      {
        p_wave_transaction_id: waveTxnId,
      },
    );

    if (error) {
      this.logger.warn(
        `Failed to resolve Wave transaction ${waveTxnId}: ${error.message}`,
      );
      return null;
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.transaction_id || !row?.status) {
      return null;
    }

    return {
      transaction_id: row.transaction_id,
      status: row.status,
    };
  }

  /** Logs a wide event when a Wave checkout completes successfully. */
  private logWavePaymentCompleted(params: {
    organizationId: string;
    sessionId: string;
    transactionId: string;
    amount: unknown;
    currency: unknown;
  }): void {
    this.wideEvent.logEvent({
      eventName: 'wave_payment_completed',
      organizationId: params.organizationId,
      correlationId: params.sessionId,
      attributes: {
        'checkout.session_id': params.sessionId,
        'payment.transaction_id': params.transactionId,
        'payment.amount': params.amount,
        'payment.currency': params.currency,
        'telemetry.source_layer': 'api:webhook',
      },
    });
  }

  /**
   * Update transaction status using RPC
   */
  private async updateTransactionStatus(
    transactionId: string,
    status: string,
    metadata: Record<string, any>,
  ) {
    const { error } = await (this.supabase.getClient() as any).rpc(
      'update_transaction_status',
      {
        p_transaction_id: transactionId,
        p_status: status,
        p_metadata: metadata,
      },
    );

    if (error) {
      this.logger.error('Error updating transaction status:', error);
      throw new Error('Failed to update transaction status');
    }

    this.logger.log(
      `Successfully updated transaction ${transactionId} to ${status}`,
    );
  }

  /**
   * Update balances after transaction completion
   */
  private async updateBalances(transactionId: string) {
    try {
      this.logger.log(
        'Starting balance update for transaction:',
        transactionId,
      );

      const { error: balanceError } = await (
        this.supabase.getClient() as any
      ).rpc('update_balances_for_transaction', {
        p_transaction_id: transactionId,
      });

      if (balanceError) {
        this.logger.warn(
          'Warning: Failed to update balances but transaction is marked as completed:',
          balanceError,
        );
      } else {
        this.logger.log('Successfully updated balances for transaction');
      }
    } catch (error) {
      this.logger.warn('Warning: Error updating balances:', error);
    }
  }

  /**
   * Trigger merchant webhook notification
   */
  private async triggerMerchantWebhook(
    transactionId: string,
    organizationId: string,
    event: string,
  ) {
    try {
      this.logger.log(
        `Triggering merchant webhook: ${event} for txn ${transactionId}`,
      );

      // Get transaction data for webhook payload
      const { data: txnRows, error: txnError } = await this.supabase
        .getClient()
        .rpc(
          'get_transaction' as any,
          {
            p_transaction_id: transactionId,
            p_organization_id: organizationId,
          } as any,
        );

      const txnData = Array.isArray(txnRows) ? txnRows[0] : txnRows;

      if (txnError || !txnData) {
        this.logger.error('Failed to fetch transaction for webhook:', txnError);
        return;
      }

      const transactionData = txnData as Record<string, unknown>;

      await maybeNotifySubscriptionRenewed(
        this.supabase,
        this.webhookSender,
        organizationId,
        transactionData,
        event,
        this.logger,
      );

      sanitizeMerchantWebhookTransactionPayload(transactionData);

      // Use webhookSender.notifyOrganization instead of sendWebhook
      await this.webhookSender.notifyOrganization(
        organizationId,
        event as WebhookEvent,
        transactionData,
      );

      this.logger.log('Successfully triggered merchant webhook');
    } catch (error) {
      this.logger.error('Error triggering merchant webhook:', error);
      // Don't throw - webhook failures shouldn't fail the Wave webhook
    }
  }
}
