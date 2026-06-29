import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { SupabaseService } from '../../../utils/supabase/supabase.service';
import { WideEventService } from '../../../utils/telemetry/wide-event.service';
import { WebhookSenderService } from '../../webhook-sender.service';
import { sanitizeMerchantWebhookTransactionPayload } from '../../sanitize-merchant-webhook-transaction-payload';
import { WebhookEvent } from '../../../utils/types/api';
import { maybeNotifySubscriptionRenewed } from '../../subscription-webhook.helper';
import {
  mapSpiEventToPaymentStatus,
  mapSpiWebhookEventToWebhookEvent,
} from '../../../core/spi/spi.utils';

type SpiWebhookPayload = {
  event?: string;
  type?: string;
  code?: string;
  txId?: string;
  data?: {
    event?: string;
    txId?: string;
    statut?: string;
  };
};

type CompleteRpcResult = {
  organization_id: string;
  transaction_id: string | null;
  checkout_session_id: string | null;
  already_completed: boolean;
  status: string;
};

@Injectable()
export class SpiWebhookService {
  private readonly logger = new Logger(SpiWebhookService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly webhookSender: WebhookSenderService,
    private readonly wideEvent: WideEventService,
  ) {}

  async handleWebhook(
    headers: Record<string, string>,
    body: Record<string, unknown>,
    rawBody: string,
  ) {
    if (!this.verifyWebhook(headers, rawBody)) {
      throw new UnauthorizedException('Invalid SPI webhook signature');
    }

    const payload = body as SpiWebhookPayload;
    const eventCode =
      payload.event ??
      payload.type ??
      payload.code ??
      payload.data?.event ??
      '';

    const spiTxId = payload.txId ?? payload.data?.txId;

    if (!eventCode) {
      throw new BadRequestException('Missing SPI webhook event code');
    }

    if (!spiTxId) {
      this.logger.warn(`SPI webhook without txId for event ${eventCode}`);
      return { ignored: true, reason: 'missing_tx_id' };
    }

    if (
      eventCode !== 'PAIEMENT_RECU' &&
      eventCode !== 'PAIEMENT_REJETE' &&
      eventCode !== 'PAIEMENT_ENVOYE'
    ) {
      this.logger.log(`Ignoring unsupported SPI webhook event: ${eventCode}`);
      return { ignored: true, event: eventCode };
    }

    const dedupeKey = `${eventCode}:${spiTxId}`;
    const { data: claimed, error: claimError } = await this.supabase.rpc(
      'claim_inbound_provider_webhook_event' as never,
      {
        p_provider: 'SPI',
        p_provider_event_id: dedupeKey,
        p_metadata: { event: eventCode, tx_id: spiTxId },
      } as never,
    );

    if (claimError) {
      this.logger.warn(`SPI idempotency claim error: ${claimError.message}`);
    } else if (claimed === false) {
      return { duplicate: true, event: eventCode };
    }

    const spiPaymentStatus = mapSpiEventToPaymentStatus(eventCode);

    const { data: completed, error: completeError } = await this.supabase.rpc(
      'complete_pos_spi_payment' as never,
      {
        p_spi_tx_id: spiTxId,
        p_spi_payment_status: spiPaymentStatus,
        p_metadata: {
          spi_webhook_event: eventCode,
          spi_tx_id: spiTxId,
        },
      } as never,
    );

    if (completeError) {
      this.logger.error(
        `complete_pos_spi_payment failed: ${completeError.message}`,
      );
      throw new BadRequestException(completeError.message);
    }

    const result = completed as unknown as CompleteRpcResult;
    if (!result.transaction_id) {
      return { event: eventCode, tx_id: spiTxId, transaction_missing: true };
    }

    const merchantEvent = mapSpiWebhookEventToWebhookEvent(eventCode);

    if (
      merchantEvent === 'PAYMENT_SUCCEEDED' &&
      spiPaymentStatus === 'IRREVOCABLE'
    ) {
      this.wideEvent.logEvent({
        eventName: 'spi_pos_payment_completed',
        organizationId: result.organization_id,
        attributes: {
          'payment.transaction_id': result.transaction_id,
          'payment.provider': 'SPI',
          'spi.tx_id': spiTxId,
          'telemetry.source_layer': 'api:webhook',
        },
      });
    }

    if (!result.already_completed) {
      await this.triggerMerchantWebhook(
        result.transaction_id,
        result.organization_id,
        merchantEvent,
      );
    }

    return {
      event: eventCode,
      tx_id: spiTxId,
      transaction_id: result.transaction_id,
      status: result.status,
    };
  }

  private verifyWebhook(
    headers: Record<string, string>,
    rawBody: string,
  ): boolean {
    const webhookSecret = process.env.SPI_WEBHOOK_SECRET;
    if (!webhookSecret) {
      this.logger.error(
        'SPI_WEBHOOK_SECRET not set — rejecting request',
      );
      return false;
    }

    const signature =
      headers['x-spi-signature'] ??
      headers['X-SPI-Signature'] ??
      headers['x-signature'] ??
      headers['X-Signature'];

    if (!signature) {
      return false;
    }

    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const normalized = signature.replace(/^sha256=/i, '');
    if (expected.length !== normalized.length) {
      return false;
    }

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(normalized),
      );
    } catch {
      return false;
    }
  }

  private async triggerMerchantWebhook(
    transactionId: string,
    organizationId: string,
    event: WebhookEvent,
  ) {
    try {
      const { data: txnRows, error: txnError } = await this.supabase.rpc(
        'get_transaction' as never,
        {
          p_transaction_id: transactionId,
          p_organization_id: organizationId,
        } as never,
      );

      const txnData = Array.isArray(txnRows) ? txnRows[0] : txnRows;
      if (txnError || !txnData) {
        this.logger.error(
          'Failed to fetch transaction for SPI webhook:',
          txnError,
        );
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

      await this.webhookSender.notifyOrganization(
        organizationId,
        event,
        transactionData,
      );
    } catch (error) {
      this.logger.error('SPI merchant webhook dispatch failed:', error);
    }
  }
}
