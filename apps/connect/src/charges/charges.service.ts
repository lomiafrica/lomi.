import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import Stripe from "stripe";
import { StripeClientService } from "../stripe/stripe-client.service";
import { isString } from "../json";
import { SupabaseService } from "../supabase/supabase.service";

export interface CreateChargeInput {
  organizationId: string;
  environment: "live" | "test";
  amountCents: number;
  currency: string;
  /** lomi.'s merchant-facing fee in the charge currency's minor units. */
  applicationFeeAmountCents: number;
  metadata: Record<string, string>;
  paymentMethodTypes: string[];
  customerEmail?: string;
  lomiCustomerId?: string;
  captureMethod?: "automatic" | "manual";
  statementDescriptorSuffix?: string;
  idempotencyKey: string;
}

export interface RefundChargeInput {
  organizationId: string;
  environment: "live" | "test";
  paymentIntentId: string;
  amountCents?: number;
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
  idempotencyKey: string;
}

@Injectable()
export class ChargesService {
  constructor(
    private readonly stripe: StripeClientService,
    private readonly supabase: SupabaseService,
  ) {}

  /**
   * Destination charge for a routed org: created on the platform account,
   * net funds land on the merchant's connected account (settlement merchant),
   * lomi.'s fee stays on the platform. Same shape the monolith returns for
   * aggregate charges so checkout code paths stay interchangeable.
   */
  async createCharge(input: CreateChargeInput) {
    const account = await this.chargeableAccount(
      input.organizationId,
      input.environment,
    );
    const client = this.stripe.getClient(input.environment);

    const params: Stripe.PaymentIntentCreateParams = {
      amount: input.amountCents,
      currency: input.currency,
      payment_method_types: input.paymentMethodTypes,
      metadata: { ...input.metadata, acquiring: "connect" },
      transfer_data: { destination: account },
      on_behalf_of: account,
      application_fee_amount: input.applicationFeeAmountCents,
    };
    if (input.captureMethod && input.captureMethod !== "automatic") {
      params.capture_method = input.captureMethod;
    }
    if (input.statementDescriptorSuffix) {
      params.statement_descriptor_suffix = input.statementDescriptorSuffix;
    }

    const customerId = await this.resolveCustomer(client, input);
    if (customerId) {
      params.customer = customerId;
      params.setup_future_usage = "off_session";
    }

    const paymentIntent = await client.paymentIntents.create(params, {
      idempotencyKey: input.idempotencyKey,
    });

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customer: customerId,
    };
  }

  /**
   * Refund a destination charge. The merchant's share is pulled back
   * (reverse_transfer); lomi. keeps its fee on refunds, matching the
   * platform revenue ledger rules.
   */
  async refundCharge(input: RefundChargeInput) {
    await this.chargeableAccount(input.organizationId, input.environment);
    const client = this.stripe.getClient(input.environment);

    const params: Stripe.RefundCreateParams = {
      payment_intent: input.paymentIntentId,
      reverse_transfer: true,
    };
    if (input.amountCents != null) {
      params.amount = input.amountCents;
    }
    if (input.reason) {
      params.reason = input.reason;
    }

    const refund = await client.refunds.create(params, {
      idempotencyKey: input.idempotencyKey,
    });
    return { id: refund.id, status: refund.status, amount: refund.amount };
  }

  private async chargeableAccount(
    organizationId: string,
    environment: string,
  ): Promise<string> {
    const { data, error } = await this.supabase
      .from("organization_acquiring_accounts")
      .select("stripe_account_id, charges_enabled")
      .eq("organization_id", organizationId)
      .eq("environment", environment)
      .maybeSingle();
    if (error) {
      throw new Error(`acquiring account read failed: ${error.message}`);
    }
    if (!data) {
      throw new NotFoundException(
        "No card account for this organization in this environment.",
      );
    }
    if (!data.charges_enabled) {
      throw new BadRequestException("Card account is not ready to charge yet.");
    }
    if (!isString(data.stripe_account_id)) {
      throw new Error("card account id is missing");
    }
    return data.stripe_account_id;
  }

  /** Customers live on the platform account; keyed by the lomi. customer id. */
  private async resolveCustomer(
    client: Stripe,
    input: CreateChargeInput,
  ): Promise<string | undefined> {
    if (!input.lomiCustomerId && !input.customerEmail) {
      return undefined;
    }
    if (input.lomiCustomerId) {
      const found = await client.customers.search({
        query: `metadata['lomi_customer_id']:'${input.lomiCustomerId}'`,
        limit: 1,
      });
      if (found.data[0]) {
        return found.data[0].id;
      }
    }
    const customer = await client.customers.create({
      email: input.customerEmail,
      metadata: input.lomiCustomerId
        ? { lomi_customer_id: input.lomiCustomerId }
        : {},
    });
    return customer.id;
  }
}
