import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '../../../utils/supabase/supabase.service';
import { WideEventService } from '../../../utils/telemetry/wide-event.service';
import { WebhookSenderService } from '../../webhook-sender.service';
import { sanitizeMerchantWebhookTransactionPayload } from '../../sanitize-merchant-webhook-transaction-payload';
import { maybeNotifySubscriptionRenewed } from '../../subscription-webhook.helper';
import { WebhookEvent } from '../../../utils/types/api';
import Stripe from 'stripe';
import { constructStripeWebhookEvent } from '../../../utils/stripe/stripe-keys';
import { StripeClientsService } from '../../../utils/stripe/stripe-clients.service';
import { normalizePaymentEnvironment } from '../../../utils/payment-environment';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly webhookSender: WebhookSenderService,
    private readonly stripeClients: StripeClientsService,
    private readonly wideEvent: WideEventService,
  ) {}

  /**
   * Main webhook handler
   */
  async handleWebhook(signature: string, rawBody: Buffer | string) {
    const event = this.verifyWebhook(signature, rawBody);

    const { data: claimed, error: claimError } = await this.supabase.rpc(
      'claim_inbound_provider_webhook_event',
      {
        p_provider: 'STRIPE',
        p_provider_event_id: event.id,
        p_metadata: { type: event.type } as any,
      },
    );

    if (claimError) {
      this.logger.warn(
        `Stripe inbound idempotency claim error: ${claimError.message}`,
      );
    } else if (claimed === false) {
      this.logger.log({
        message: 'stripe_webhook_duplicate',
        event_id: event.id,
        event_type: event.type,
      });
      return {
        message: 'duplicate_event',
        duplicate: true,
        event_id: event.id,
      };
    }

    // Wide Event: Log webhook receipt with structured context
    this.logger.log({
      message: 'stripe_webhook_received',
      event_type: event.type,
      event_id: event.id,
      timestamp: new Date().toISOString(),
    });

    switch (event.type) {
      // ========================================================================
      // PAYMENT EVENTS
      // ========================================================================
      case 'payment_intent.succeeded':
        return await this.handlePaymentSuccess(
          event.data.object as Stripe.PaymentIntent,
        );

      case 'payment_intent.payment_failed':
        return await this.handlePaymentFailure(
          event.data.object as Stripe.PaymentIntent,
        );

      case 'payment_intent.processing':
        return await this.handlePaymentProcessing(
          event.data.object as Stripe.PaymentIntent,
        );

      case 'setup_intent.succeeded':
        return await this.handleSetupIntentSucceeded(
          event.data.object as Stripe.SetupIntent,
        );

      // ========================================================================
      // CHARGE EVENTS
      // ========================================================================
      case 'charge.succeeded':
        return await this.handleChargeSucceeded(
          event.data.object as Stripe.Charge,
        );

      // ========================================================================
      // DISPUTE EVENTS
      // ========================================================================
      case 'charge.dispute.created':
        return await this.handleDisputeCreated(
          event.data.object as Stripe.Dispute,
        );

      case 'charge.dispute.updated':
        return await this.handleDisputeUpdated(
          event.data.object as Stripe.Dispute,
        );

      case 'charge.dispute.closed':
        return await this.handleDisputeClosed(
          event.data.object as Stripe.Dispute,
        );

      // ========================================================================
      // REFUND EVENTS
      // ========================================================================
      case 'charge.refunded':
        return await this.handleRefund(event.data.object as Stripe.Charge);

      // ========================================================================
      // CHECKOUT EVENTS
      // ========================================================================
      case 'checkout.session.completed':
        return await this.handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );

      case 'checkout.session.async_payment_succeeded':
        return await this.handleAsyncPaymentSuccess(
          event.data.object as Stripe.Checkout.Session,
        );

      case 'checkout.session.async_payment_failed':
        return await this.handleAsyncPaymentFailure(
          event.data.object as Stripe.Checkout.Session,
        );

      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
        return {
          message: `Event type ${event.type} not handled`,
          eventType: event.type,
        };
    }
  }

  /**
   * Verify webhook signature using Stripe's library
   */
  private verifyWebhook(
    signature: string,
    rawBody: Buffer | string,
  ): Stripe.Event {
    try {
      const event = constructStripeWebhookEvent(rawBody, signature);
      this.logger.log({
        message: 'stripe_signature_verified',
        livemode: event.livemode,
        event_type: event.type,
      });
      return event;
    } catch (error) {
      this.logger.error('Stripe signature verification failed:', error);
      const message =
        error instanceof Error ? error.message : 'Verification failed';
      throw new BadRequestException(`Webhook Error: ${message}`);
    }
  }

  /**
   * Handle payment_intent.succeeded event
   */
  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const metadata = paymentIntent.metadata || {};

    const chargeId =
      typeof paymentIntent.latest_charge === 'string'
        ? paymentIntent.latest_charge
        : paymentIntent.latest_charge?.id || null;

    // Extract Payment Method ID
    const paymentMethodId =
      typeof paymentIntent.payment_method === 'string'
        ? paymentIntent.payment_method
        : paymentIntent.payment_method?.id || null;

    let txnData: any = null;

    // =========================================================================
    // 1. SERVER-SIDE INTERNATIONAL CARD FEE DETECTION (MUST run BEFORE balance update)
    // =========================================================================
    // CRITICAL: We must apply the international card fee to the transaction
    // BEFORE update_stripe_checkout_status runs update_balances_for_transaction.
    // Otherwise the balance gets credited with the pre-intl-fee amount (e.g. 11,150 XOF)
    // while the transaction shows post-intl-fee net (e.g. 10,910 XOF), causing
    // "En cours" to display the wrong (higher) amount.
    const stripe = this.stripeClients.getClientForStripeLivemode(
      paymentIntent.livemode,
    );
    if (paymentMethodId && stripe) {
      try {
        const paymentMethod =
          await stripe.paymentMethods.retrieve(paymentMethodId);
        const cardCountry = paymentMethod.card?.country;
        const walletType = paymentMethod.card?.wallet?.type;

        // "International" = NOT France (FR). User's policy: only France is domestic.
        const isInternational = cardCountry
          ? cardCountry.toUpperCase() !== 'FR'
          : false;

        this.logger.log({
          message: 'international_card_check',
          payment_intent_id: paymentIntent.id,
          card_country: cardCountry,
          wallet_type: walletType ?? null,
          is_international: isInternational,
        });

        // Call RPC to update fee and save card details BEFORE balance credit
        const { error: feeError } = await (
          this.supabase.getClient() as any
        ).rpc('update_transaction_fee_metadata', {
          p_stripe_payment_intent_id: paymentIntent.id,
          p_payment_method_id: paymentMethodId,
          p_card_details: {
            brand: paymentMethod.card?.brand,
            last4: paymentMethod.card?.last4,
            exp_month: paymentMethod.card?.exp_month,
            exp_year: paymentMethod.card?.exp_year,
            country: cardCountry,
            fingerprint: paymentMethod.card?.fingerprint || paymentMethodId,
            wallet_type: walletType ?? undefined,
          },
          p_is_international: isInternational,
        });

        if (feeError) {
          this.logger.warn({
            message: 'update_transaction_fee_metadata_failed',
            payment_intent_id: paymentIntent.id,
            error: feeError.message,
          });
        }
      } catch (pmError: any) {
        this.logger.warn({
          message: 'retrieve_payment_method_failed',
          payment_intent_id: paymentIntent.id,
          error: pmError?.message || 'Unknown error',
        });
        // Non-blocking: do not fail the webhook for this
      }
    }

    // =========================================================================
    // 2. UPDATE TRANSACTION STATUS & CREDIT BALANCE (Non-blocking - don't fail if this times out)
    // =========================================================================
    try {
      txnData = await this.updateStripeCheckoutStatus(
        paymentIntent.id,
        chargeId,
        'succeeded',
        null,
        null,
        paymentMethodId,
      );
    } catch (statusError: any) {
      this.logger.error({
        message: 'update_stripe_checkout_status_failed',
        payment_intent_id: paymentIntent.id,
        error: statusError?.message || 'Unknown error',
      });
      // Continue processing - don't fail the entire webhook
    }

    if (!txnData) {
      try {
        const { data, error } = await (this.supabase.getClient() as any).rpc(
          'get_transaction_by_stripe_intent',
          {
            p_payment_intent_id: paymentIntent.id,
          },
        );

        if (error) {
          this.logger.warn({
            message: 'get_transaction_by_stripe_intent_failed',
            payment_intent_id: paymentIntent.id,
            error: error.message,
          });
        } else {
          txnData = data;
        }
      } catch (lookupError: any) {
        this.logger.warn({
          message: 'get_transaction_by_stripe_intent_exception',
          payment_intent_id: paymentIntent.id,
          error: lookupError?.message || 'Unknown error',
        });
      }
    }

    if (txnData) {
      await this.mergeStripeRadarSignals(paymentIntent, chargeId);
    }

    if (txnData && metadata.organization_id) {
      this.wideEvent.logEvent({
        eventName: 'stripe_payment_confirmed',
        organizationId: metadata.organization_id,
        correlationId: metadata.checkout_session_id,
        attributes: {
          'organization.id': metadata.organization_id,
          'checkout.session_id': metadata.checkout_session_id,
          'stripe.payment_intent_id': paymentIntent.id,
          'payment.amount': paymentIntent.amount,
          'payment.currency': paymentIntent.currency,
          'telemetry.source_layer': 'api:webhook',
        },
      });
    }

    // =========================================================================
    // 3. TRIGGER MERCHANT WEBHOOK (Always attempt, even if status update failed)
    // =========================================================================
    if (metadata.organization_id) {
      await this.triggerMerchantWebhook(
        paymentIntent.id,
        metadata.organization_id,
        'PAYMENT_SUCCEEDED',
        txnData,
      );
    }

    return {
      eventType: 'payment_intent.succeeded',
      payment_intent_id: paymentIntent.id,
    };
  }

  /**
   * Handle payment_intent.payment_failed event
   */
  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const metadata = paymentIntent.metadata || {};
    const lastError = paymentIntent.last_payment_error;
    const errorCode = lastError?.code || 'unknown';
    const declineCode = lastError?.decline_code || '';
    const errorMessage = lastError?.message || 'Payment failed';
    const resolvedErrorCode = declineCode || errorCode;

    const txnData = await this.updateStripeCheckoutStatus(
      paymentIntent.id,
      null,
      'cancelled',
      resolvedErrorCode,
      errorMessage,
    );

    if (metadata.organization_id) {
      this.wideEvent.logEvent({
        eventName: 'stripe_payment_confirm_failed',
        organizationId: metadata.organization_id,
        correlationId: metadata.checkout_session_id,
        attributes: {
          'organization.id': metadata.organization_id,
          'checkout.session_id': metadata.checkout_session_id,
          'stripe.payment_intent_id': paymentIntent.id,
          'stripe.error_code': errorCode,
          'stripe.decline_code': declineCode,
          'stripe.resolved_error_code': resolvedErrorCode,
          'stripe.error': errorMessage,
          'payment.amount': paymentIntent.amount,
          'payment.currency': paymentIntent.currency,
          'telemetry.source_layer': 'api:webhook',
        },
      });

      await this.triggerMerchantWebhook(
        paymentIntent.id,
        metadata.organization_id,
        'PAYMENT_FAILED',
        txnData,
      );
    }

    return {
      eventType: 'payment_intent.payment_failed',
      payment_intent_id: paymentIntent.id,
    };
  }

  /**
   * Handle payment_intent.processing event
   */
  private async handlePaymentProcessing(paymentIntent: Stripe.PaymentIntent) {
    await this.updateStripeCheckoutStatus(paymentIntent.id, null, 'processing');

    return {
      eventType: 'payment_intent.processing',
      payment_intent_id: paymentIntent.id,
    };
  }

  /**
   * Handle setup_intent.succeeded — trial or deferred subscription card save (no charge).
   */
  private async handleSetupIntentSucceeded(setupIntent: Stripe.SetupIntent) {
    const metadata = setupIntent.metadata || {};
    const paymentFlow = metadata.payment_flow;

    const paymentMethodId =
      typeof setupIntent.payment_method === 'string'
        ? setupIntent.payment_method
        : setupIntent.payment_method?.id || null;

    if (paymentFlow === 'customer_portal_update') {
      if (
        !paymentMethodId ||
        !metadata.internal_customer_id ||
        !metadata.organization_id
      ) {
        this.logger.warn({
          message: 'setup_intent_succeeded_missing_metadata',
          setup_intent_id: setupIntent.id,
          payment_flow: paymentFlow,
        });
        return {
          eventType: 'setup_intent.succeeded',
          setup_intent_id: setupIntent.id,
          error: 'missing_metadata',
        };
      }

      let cardDetails: Record<string, unknown> = {};
      try {
        const env = normalizePaymentEnvironment(metadata.environment);
        const stripe = this.stripeClients.getClient(env);
        const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
        const card = pm.card;
        cardDetails = {
          type: pm.type ?? 'card',
          brand: card?.brand ?? null,
          last4: card?.last4 ?? null,
          exp_month: card?.exp_month ?? null,
          exp_year: card?.exp_year ?? null,
          country: card?.country ?? null,
          fingerprint: card?.fingerprint ?? null,
          is_international: card?.country != null && card.country !== 'CI',
        };
      } catch (retrieveError) {
        this.logger.warn({
          message: 'customer_portal_pm_retrieve_failed',
          setup_intent_id: setupIntent.id,
          error:
            retrieveError instanceof Error
              ? retrieveError.message
              : String(retrieveError),
        });
      }

      const { error } = await (this.supabase.getClient() as any).rpc(
        'complete_customer_portal_payment_method_setup',
        {
          p_organization_id: metadata.organization_id,
          p_customer_id: metadata.internal_customer_id,
          p_stripe_payment_method_id: paymentMethodId,
          p_card_details: cardDetails,
        },
      );

      if (error) {
        this.logger.error({
          message: 'complete_customer_portal_payment_method_setup_failed',
          setup_intent_id: setupIntent.id,
          error: error.message,
        });
        throw new Error(
          'Failed to complete customer portal payment method setup',
        );
      }

      return {
        eventType: 'setup_intent.succeeded',
        setup_intent_id: setupIntent.id,
        payment_flow: paymentFlow,
      };
    }

    if (
      paymentFlow !== 'subscription_trial_setup' &&
      paymentFlow !== 'subscription_deferred_setup'
    ) {
      return {
        eventType: 'setup_intent.succeeded',
        setup_intent_id: setupIntent.id,
        skipped: true,
      };
    }

    if (
      !paymentMethodId ||
      !metadata.internal_customer_id ||
      !metadata.product_id ||
      !metadata.organization_id ||
      !metadata.merchant_id
    ) {
      this.logger.warn({
        message: 'setup_intent_succeeded_missing_metadata',
        setup_intent_id: setupIntent.id,
        payment_flow: paymentFlow,
      });
      return {
        eventType: 'setup_intent.succeeded',
        setup_intent_id: setupIntent.id,
        error: 'missing_metadata',
      };
    }

    const rpcName =
      paymentFlow === 'subscription_deferred_setup'
        ? 'complete_stripe_deferred_subscription_setup'
        : 'complete_stripe_trial_setup';

    const { error } = await (this.supabase.getClient() as any).rpc(rpcName, {
      p_merchant_id: metadata.merchant_id,
      p_organization_id: metadata.organization_id,
      p_customer_id: metadata.internal_customer_id,
      p_product_id: metadata.product_id,
      p_price_id: metadata.price_id || null,
      p_checkout_session_id: metadata.checkoutSessionId || null,
      p_stripe_payment_method_id: paymentMethodId,
    });

    if (error) {
      this.logger.error({
        message: `${rpcName}_failed`,
        setup_intent_id: setupIntent.id,
        error: error.message,
      });
      throw new Error(`Failed to complete Stripe setup (${paymentFlow})`);
    }

    return {
      eventType: 'setup_intent.succeeded',
      setup_intent_id: setupIntent.id,
      payment_flow: paymentFlow,
    };
  }

  /**
   * Handle charge.succeeded event
   * NOTE: We do NOT update transaction status here because payment_intent.succeeded
   * already handles it. Doing so would trigger duplicate email notifications.
   * This handler is kept for logging/auditing the charge ID.
   */
  private async handleChargeSucceeded(charge: Stripe.Charge) {
    const paymentIntentId = charge.payment_intent as string;

    if (!paymentIntentId) {
      this.logger.warn({
        message: 'charge_succeeded_no_payment_intent',
        charge_id: charge.id,
      });
      return {
        eventType: 'charge.succeeded',
        charge_id: charge.id,
        payment_intent_id: null,
      };
    }

    // Log for auditing - do NOT update status (payment_intent.succeeded handles that)
    this.logger.log({
      message: 'charge_succeeded',
      charge_id: charge.id,
      payment_intent_id: paymentIntentId,
    });

    return {
      eventType: 'charge.succeeded',
      charge_id: charge.id,
      payment_intent_id: paymentIntentId,
    };
  }

  /**
   * Handle charge.dispute.created event
   */
  private async handleDisputeCreated(dispute: Stripe.Dispute) {
    try {
      const stripe = this.stripeClients.getClientForStripeLivemode(
        dispute.livemode,
      );
      if (!stripe) {
        throw new Error('Stripe client not initialized');
      }

      const charge = await stripe.charges.retrieve(dispute.charge as string);
      const paymentIntentId = charge.payment_intent as string;

      const { data: rpcResult, error } = await (
        this.supabase.getClient() as any
      ).rpc('handle_stripe_dispute_created', {
        p_stripe_dispute_id: dispute.id,
        p_stripe_charge_id: dispute.charge,
        p_payment_intent_id: paymentIntentId,
        p_amount: dispute.amount / 100,
        p_currency: dispute.currency.toUpperCase(),
        p_reason: dispute.reason,
        p_dispute_data: {
          status: dispute.status,
          evidence: dispute.evidence,
          evidence_details: dispute.evidence_details,
          is_charge_refundable: dispute.is_charge_refundable,
        },
      });

      if (error) {
        throw new Error('Failed to create dispute record');
      }

      const disputeId = (rpcResult as { dispute_id?: string })?.dispute_id;
      if (disputeId && rpcResult?.idempotent !== true) {
        await this.notifyDisputeWebhook(disputeId, 'DISPUTE_CREATED');
      }
    } catch {
      throw new Error('Failed to create dispute record');
    }

    return {
      eventType: 'charge.dispute.created',
      dispute_id: dispute.id,
    };
  }

  /**
   * Handle charge.dispute.updated event
   */
  private async handleDisputeUpdated(dispute: Stripe.Dispute) {
    try {
      const { error } = await (this.supabase.getClient() as any).rpc(
        'handle_stripe_dispute_updated',
        {
          p_stripe_dispute_id: dispute.id,
          p_status: dispute.status,
          p_dispute_data: {
            status: dispute.status,
            evidence: dispute.evidence,
            evidence_details: dispute.evidence_details,
          },
        },
      );

      if (error) {
        throw new Error('Failed to update dispute record');
      }

      const { data: disputeRow, error: lookupError } = await this.supabase.rpc(
        'get_dispute_by_stripe_id' as never,
        { p_stripe_dispute_id: dispute.id } as never,
      );

      if (!lookupError) {
        const row = Array.isArray(disputeRow) ? disputeRow[0] : disputeRow;
        const disputeId = (
          row as unknown as { dispute_id?: string } | undefined
        )?.dispute_id;
        if (disputeId) {
          await this.notifyDisputeWebhook(disputeId, 'DISPUTE_UPDATED');
        }
      }
    } catch {
      throw new Error('Failed to update dispute record');
    }

    return {
      eventType: 'charge.dispute.updated',
      dispute_id: dispute.id,
    };
  }

  /**
   * Handle charge.dispute.closed event
   */
  private async handleDisputeClosed(dispute: Stripe.Dispute) {
    await this.handleDisputeUpdated(dispute);

    try {
      const { data: disputeRow } = await this.supabase.rpc(
        'get_dispute_by_stripe_id' as never,
        { p_stripe_dispute_id: dispute.id } as never,
      );
      const row = Array.isArray(disputeRow) ? disputeRow[0] : disputeRow;
      const disputeId = (row as unknown as { dispute_id?: string } | undefined)
        ?.dispute_id;
      if (disputeId) {
        await this.notifyDisputeWebhook(disputeId, 'DISPUTE_CLOSED');
      }
    } catch {
      // non-fatal for closed notification
    }

    return {
      eventType: 'charge.dispute.closed',
      dispute_id: dispute.id,
    };
  }

  /**
   * Handle charge.refunded event
   */
  private async handleRefund(charge: Stripe.Charge) {
    try {
      const paymentIntentId = charge.payment_intent as string;
      const refund = charge.refunds?.data[0];

      if (!refund) {
        return {
          eventType: 'charge.refunded',
          charge_id: charge.id,
        };
      }

      const { error } = await (this.supabase.getClient() as any).rpc(
        'handle_stripe_refund',
        {
          p_stripe_charge_id: charge.id,
          p_payment_intent_id: paymentIntentId,
          p_refund_amount: refund.amount / 100,
          p_refund_id: refund.id,
          p_reason: refund.reason || null,
        },
      );

      if (error) {
        throw new Error('Failed to handle refund');
      }
    } catch {
      throw new Error('Failed to handle refund');
    }

    return {
      eventType: 'charge.refunded',
      charge_id: charge.id,
    };
  }

  /**
   * Handle checkout.session.completed event
   */
  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    return {
      eventType: 'checkout.session.completed',
      session_id: session.id,
    };
  }

  /**
   * Handle checkout.session.async_payment_succeeded event
   */
  private async handleAsyncPaymentSuccess(session: Stripe.Checkout.Session) {
    if (session.payment_intent) {
      await this.updateStripeCheckoutStatus(
        session.payment_intent as string,
        null,
        'succeeded',
      );
    }

    return {
      eventType: 'checkout.session.async_payment_succeeded',
      session_id: session.id,
    };
  }

  /**
   * Handle checkout.session.async_payment_failed event
   */
  private async handleAsyncPaymentFailure(session: Stripe.Checkout.Session) {
    if (session.payment_intent) {
      await this.updateStripeCheckoutStatus(
        session.payment_intent as string,
        null,
        'cancelled',
      );
    }

    return {
      eventType: 'checkout.session.async_payment_failed',
      session_id: session.id,
    };
  }

  /**
   * Update Stripe checkout status using RPC
   */
  private async updateStripeCheckoutStatus(
    paymentIntentId: string,
    chargeId: string | null,
    status: string,
    errorCode?: string | null,
    errorMessage?: string | null,
    paymentMethodId?: string | null,
  ) {
    const { data, error } = await (this.supabase.getClient() as any).rpc(
      'update_stripe_checkout_status',
      {
        p_stripe_payment_intent_id: paymentIntentId,
        p_stripe_charge_id: chargeId,
        p_payment_status: status,
        p_error_code: errorCode || null,
        p_error_message: errorMessage || null,
        p_metadata: null,
        p_stripe_payment_method_id: paymentMethodId || null,
      },
    );

    if (error) {
      throw new Error('Failed to update checkout status');
    }

    return data;
  }

  /**
   * Enrich risk assessments with Stripe Radar outcome when available.
   */
  private async mergeStripeRadarSignals(
    paymentIntent: Stripe.PaymentIntent,
    chargeId: string | null,
  ) {
    if (!chargeId) return;

    try {
      const stripe = this.stripeClients.getClientForStripeLivemode(
        paymentIntent.livemode,
      );
      if (!stripe) return;

      const charge = await stripe.charges.retrieve(chargeId);
      const outcome = charge.outcome;
      if (!outcome?.risk_level && outcome?.risk_score == null) return;

      const { data: txnData } = await (this.supabase.getClient() as any).rpc(
        'get_transaction_by_stripe_intent',
        { p_payment_intent_id: paymentIntent.id },
      );
      const transactionId =
        txnData?.transaction_id ?? txnData?.[0]?.transaction_id;
      if (!transactionId) return;

      await this.supabase.rpc(
        'merge_stripe_radar_signals' as never,
        {
          p_transaction_id: transactionId,
          p_stripe_risk_level: outcome.risk_level ?? null,
          p_stripe_risk_score: outcome.risk_score ?? null,
        } as never,
      );
    } catch {
      // Non-blocking enrichment
    }
  }

  /**
   * Trigger merchant webhook notification
   */
  private async notifyDisputeWebhook(
    disputeId: string,
    event: 'DISPUTE_CREATED' | 'DISPUTE_UPDATED' | 'DISPUTE_CLOSED',
  ) {
    try {
      const { data: payload, error } = await this.supabase.rpc(
        'get_dispute_webhook_payload' as never,
        { p_dispute_id: disputeId } as never,
      );

      if (error || !payload || typeof payload !== 'object') {
        return;
      }

      const row = payload as Record<string, unknown>;
      const organizationId = row.organization_id as string | undefined;
      if (!organizationId) return;

      await this.webhookSender.notifyOrganization(
        organizationId,
        event as WebhookEvent,
        row,
      );
    } catch {
      // Don't throw - webhook failures shouldn't fail the Stripe webhook
    }
  }

  private async triggerMerchantWebhook(
    paymentIntentId: string,
    organizationId: string,
    event: string,
    txnData?: any,
  ) {
    if (!txnData) return;

    // Sandbox card payments are delivered by DB trigger (trigger_sandbox_stripe_payment_webhook).
    if (
      event === 'PAYMENT_SUCCEEDED' &&
      normalizePaymentEnvironment(txnData.environment) === 'test'
    ) {
      return;
    }

    try {
      await maybeNotifySubscriptionRenewed(
        this.supabase,
        this.webhookSender,
        organizationId,
        txnData as Record<string, unknown>,
        event,
        this.logger,
      );

      sanitizeMerchantWebhookTransactionPayload(txnData);

      await this.webhookSender.notifyOrganization(
        organizationId,
        event as WebhookEvent,
        txnData,
      );
    } catch {
      // Don't throw - webhook failures shouldn't fail the Stripe webhook
    }
  }
}
