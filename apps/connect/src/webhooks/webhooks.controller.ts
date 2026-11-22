import {
  BadRequestException,
  Controller,
  Headers,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import Stripe from 'stripe';
import { AccountsService } from '../accounts/accounts.service';
import { StripeClientService } from '../stripe/stripe-client.service';
import { SupabaseService } from '../supabase/supabase.service';
import { MonolithForwarderService } from './monolith-forwarder.service';

/** Radar for Platforms v2 account signals (Polar watches the same two). */
const RISK_SIGNAL_EVENT_TYPES = new Set<string>([
  'v2.signals.account_signal.fraudulent_merchant_ready',
  'v2.signals.account_signal.fraudulent_website_ready',
]);

/**
 * Platform-account webhooks. Account-lifecycle events are handled here;
 * payment-domain events are forwarded to the monolith; payout events record
 * merchant settlements.
 */
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly stripe: StripeClientService,
    private readonly accounts: AccountsService,
    private readonly supabase: SupabaseService,
    private readonly forwarder: MonolithForwarderService,
  ) {}

  @Post('platform-accounts')
  async handle(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature || !req.rawBody) {
      throw new BadRequestException();
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.constructWebhookEvent(req.rawBody, signature);
    } catch (err) {
      this.logger.warn(
        `platform webhook signature failed: ${(err as Error).message}`,
      );
      throw new BadRequestException();
    }

    switch (event.type) {
      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        const orgId = account.metadata?.lomi_organization_id;
        const { data: row } = await this.supabase
          .from('organization_acquiring_accounts')
          .select('acquiring_account_id')
          .eq('stripe_account_id', account.id)
          .maybeSingle();
        if (row) {
          await this.accounts.syncFromAccount(
            row.acquiring_account_id as string,
            account,
          );
        } else {
          this.logger.warn(
            `account.updated for unknown account ${account.id} (org ${orgId ?? 'n/a'})`,
          );
        }
        break;
      }
      case 'account.application.deauthorized': {
        // data.object is the Application; the connected account id rides on
        // event.account for Connect-context events.
        const accountId = event.account;
        if (accountId) {
          await this.supabase
            .from('organization_acquiring_accounts')
            .update({
              status: 'disconnected',
              charges_enabled: false,
              payouts_enabled: false,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_account_id', accountId);
        }
        break;
      }
      case 'payout.created':
      case 'payout.paid':
      case 'payout.failed':
      case 'payout.canceled': {
        await this.recordSettlement(event);
        break;
      }
      default:
        // Radar for Platforms: account risk signals go to ops (same events
        // Polar watches). Flag the row; rejection stays a human decision.
        if (RISK_SIGNAL_EVENT_TYPES.has(event.type)) {
          await this.recordRiskSignal(event);
          break;
        }
        // payment_intent.*, charge.*, review.* and dispute events: the
        // monolith runs the same handlers as the aggregate rail.
        if (
          event.type.startsWith('payment_intent.') ||
          event.type.startsWith('charge.') ||
          event.type.startsWith('review.') ||
          event.type.startsWith('setup_intent.') ||
          event.type.startsWith('checkout.')
        ) {
          await this.forwarder.forward(req.rawBody, event.type);
        }
        break;
    }

    return { received: true };
  }

  /** Record a Radar for Platforms signal on the account row for ops review. */
  private async recordRiskSignal(event: Stripe.Event) {
    const payload = event.data.object as unknown as Record<string, unknown>;
    const accountId =
      event.account ??
      (typeof payload['account'] === 'string'
        ? (payload['account'] as string)
        : undefined);
    if (!accountId) {
      return;
    }
    const { data: account } = await this.supabase
      .from('organization_acquiring_accounts')
      .select('acquiring_account_id, metadata')
      .eq('stripe_account_id', accountId)
      .maybeSingle();
    if (!account) {
      this.logger.warn(`risk signal for unknown account ${accountId}`);
      return;
    }
    const current = (account.metadata ?? {}) as Record<string, unknown>;
    const existing = Array.isArray(current['risk_signals'])
      ? (current['risk_signals'] as unknown[])
      : [];
    const metadata = {
      ...current,
      risk_signals: [
        ...existing.slice(-9),
        {
          type: event.type,
          signal_type: payload['type'] ?? null,
          at: new Date().toISOString(),
        },
      ],
    };
    const { error } = await this.supabase
      .from('organization_acquiring_accounts')
      .update({ metadata, updated_at: new Date().toISOString() })
      .eq('acquiring_account_id', account.acquiring_account_id);
    if (error) {
      this.logger.error(`risk signal record failed: ${error.message}`);
    }
    this.logger.warn(`risk signal ${event.type} on account ${accountId}`);
  }

  /** Merchant settlements: payouts the provider sends to the merchant bank. */
  private async recordSettlement(event: Stripe.Event) {
    const payout = event.data.object as Stripe.Payout;
    const accountId = event.account;
    if (!accountId) {
      return;
    }
    const { data: account } = await this.supabase
      .from('organization_acquiring_accounts')
      .select('organization_id, environment')
      .eq('stripe_account_id', accountId)
      .maybeSingle();
    if (!account) {
      this.logger.warn(`payout event for unknown account ${accountId}`);
      return;
    }
    const status =
      event.type === 'payout.paid'
        ? 'paid'
        : event.type === 'payout.failed'
          ? 'failed'
          : event.type === 'payout.canceled'
            ? 'canceled'
            : 'in_transit';
    const { error } = await this.supabase
      .from('organization_acquiring_settlements')
      .upsert(
        {
          organization_id: account.organization_id,
          environment: account.environment,
          stripe_payout_id: payout.id,
          amount: payout.amount / 100,
          currency_code: payout.currency.toUpperCase(),
          status,
          arrival_date: payout.arrival_date
            ? new Date(payout.arrival_date * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'stripe_payout_id' },
      );
    if (error) {
      this.logger.error(`settlement upsert failed: ${error.message}`);
    }
  }
}
