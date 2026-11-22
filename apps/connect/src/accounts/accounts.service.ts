import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { StripeClientService } from '../stripe/stripe-client.service';
import { SupabaseService } from '../supabase/supabase.service';
import { SupportedCountriesService } from './supported-countries.service';

export interface CreateAccountInput {
  organizationId: string;
  environment: 'live' | 'test';
}

export interface KycRelayInput {
  organizationId: string;
  environment: 'live' | 'test';
  representative: {
    firstName: string;
    lastName: string;
    email: string;
    dob?: { day: number; month: number; year: number };
    phone?: string;
  };
  bankAccount: {
    country: string;
    currency: string;
    accountHolderName: string;
    /** IBAN for EEA, account number + routing number elsewhere. */
    iban?: string;
    accountNumber?: string;
    routingNumber?: string;
  };
  tosAcceptance: {
    ip: string;
    userAgent?: string;
  };
}

const ACCOUNT_COLUMNS =
  'acquiring_account_id, organization_id, environment, stripe_account_id, country, status, charges_enabled, payouts_enabled, capabilities, requirements_due, tos_accepted_at, kyc_submitted_at, disabled_reason, created_at, updated_at';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    private readonly stripe: StripeClientService,
    private readonly supabase: SupabaseService,
    private readonly countries: SupportedCountriesService,
  ) {}

  /**
   * Creates the platform-onboarded merchant account for an eligible org.
   * Fully white-label: no provider dashboard for the merchant, the platform
   * pays processing fees and bills its own rates, and requirements are
   * collected programmatically through lomi.'s own onboarding.
   */
  async createAccount(input: CreateAccountInput) {
    const kyc = await this.loadKyc(input.organizationId);
    if (kyc.status !== 'approved') {
      throw new BadRequestException(
        'Organization verification must be approved before enabling card processing.',
      );
    }
    const country = this.countries.eligibleCountry(kyc.legal_country);
    if (!country) {
      throw new BadRequestException(
        'Card onboarding through this rail is not available for this country.',
      );
    }

    const existing = await this.findRow(input.organizationId, input.environment);
    if (existing) {
      throw new ConflictException(
        'This organization already has a card account for this environment.',
      );
    }

    const client = this.stripe.getClient(input.environment);
    const account = await client.accounts.create({
      country,
      business_type: 'company',
      controller: {
        stripe_dashboard: { type: 'none' },
        fees: { payer: 'application' },
        losses: { payments: 'application' },
        requirement_collection: 'application',
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      // Cross-border recipient agreement for non-US accounts on a US
      // platform (same pattern Polar uses): the account receives charge
      // proceeds under destination charges, it does not run its own charges.
      ...(country !== 'US'
        ? { tos_acceptance: { service_agreement: 'recipient' } }
        : {}),
      company: {
        name: kyc.legal_organization_name ?? undefined,
        tax_id: kyc.tax_number ?? undefined,
        address: this.legalAddress(kyc),
      },
      metadata: { lomi_organization_id: input.organizationId },
    });

    const { data, error } = await this.supabase
      .from('organization_acquiring_accounts')
      .insert({
        organization_id: input.organizationId,
        environment: input.environment,
        stripe_account_id: account.id,
        country,
        status: 'pending',
      })
      .select(ACCOUNT_COLUMNS)
      .single();
    if (error) {
      this.logger.error(
        `acquiring row insert failed for org ${input.organizationId}: ${error.message}`,
      );
      throw new Error('Could not record the card account.');
    }
    return data;
  }

  /**
   * Relays the org's existing KYB (company, representative, payout bank) and
   * records the merchant's terms acceptance. No provider-hosted forms: the
   * merchant stays inside lomi.'s onboarding end to end.
   */
  async relayKyc(input: KycRelayInput) {
    const row = await this.mustFindRow(input.organizationId, input.environment);
    const client = this.stripe.getClient(input.environment);
    const accountId = row.stripe_account_id as string;
    const kyc = await this.loadKyc(input.organizationId);

    await client.accounts.update(accountId, {
      company: {
        name: kyc.legal_organization_name ?? undefined,
        tax_id: kyc.tax_number ?? undefined,
        address: this.legalAddress(kyc),
      },
    });

    await client.accounts.createPerson(accountId, {
      first_name: input.representative.firstName,
      last_name: input.representative.lastName,
      email: input.representative.email,
      phone: input.representative.phone,
      dob: input.representative.dob,
      relationship: {
        representative: true,
        executive: true,
        title: 'Legal representative',
      },
    });

    const externalAccount: Stripe.AccountCreateExternalAccountParams = {
      external_account: {
        object: 'bank_account',
        country: input.bankAccount.country,
        currency: input.bankAccount.currency,
        account_holder_name: input.bankAccount.accountHolderName,
        account_number:
          input.bankAccount.iban ?? input.bankAccount.accountNumber,
        routing_number: input.bankAccount.routingNumber,
      } as Stripe.AccountCreateExternalAccountParams['external_account'],
    };
    await client.accounts.createExternalAccount(accountId, externalAccount);

    // Settlement rhythm: weekly, Monday, to the account just linked.
    await client.accounts.update(accountId, {
      settings: {
        payouts: {
          schedule: { interval: 'weekly', weekly_anchor: 'monday' },
        },
      },
    });

    await client.accounts.update(accountId, {
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: input.tosAcceptance.ip,
        user_agent: input.tosAcceptance.userAgent,
      },
    });

    const { data, error } = await this.supabase
      .from('organization_acquiring_accounts')
      .update({
        status: 'review',
        kyc_submitted_at: new Date().toISOString(),
        tos_accepted_at: new Date().toISOString(),
        tos_acceptance_ip: input.tosAcceptance.ip,
        updated_at: new Date().toISOString(),
      })
      .eq('acquiring_account_id', row.acquiring_account_id)
      .select(ACCOUNT_COLUMNS)
      .single();
    if (error) {
      throw new Error('Could not update the card account.');
    }
    return data;
  }

  /** Current state from our table; webhooks keep it fresh. */
  async getStatus(organizationId: string, environment: 'live' | 'test') {
    return this.mustFindRow(organizationId, environment);
  }

  /** Pull the provider state once and sync the row (manual refresh / repair). */
  async refreshFromProvider(organizationId: string, environment: 'live' | 'test') {
    const row = await this.mustFindRow(organizationId, environment);
    const client = this.stripe.getClient(environment);
    try {
      const account = await client.accounts.retrieve(
        row.stripe_account_id as string,
      );
      return await this.syncFromAccount(
        row.acquiring_account_id as string,
        account,
      );
    } catch (err) {
      // Deleted or inaccessible account: close the row instead of looping.
      this.logger.warn(
        `account retrieve failed for ${row.stripe_account_id}: ${(err as Error).message}; marking disconnected`,
      );
      const { data } = await this.supabase
        .from('organization_acquiring_accounts')
        .update({
          status: 'disconnected',
          charges_enabled: false,
          payouts_enabled: false,
          updated_at: new Date().toISOString(),
        })
        .eq('acquiring_account_id', row.acquiring_account_id)
        .select(ACCOUNT_COLUMNS)
        .single();
      return data;
    }
  }

  /** Ops kill switch: reject an account (fraud, terms, other). */
  async rejectAccount(
    organizationId: string,
    environment: 'live' | 'test',
    reason: 'fraud' | 'terms_of_service' | 'other',
  ) {
    const row = await this.mustFindRow(organizationId, environment);
    const client = this.stripe.getClient(environment);
    await client.accounts.reject(row.stripe_account_id as string, {
      reason,
    });
    const { data, error } = await this.supabase
      .from('organization_acquiring_accounts')
      .update({
        status: 'disconnected',
        charges_enabled: false,
        payouts_enabled: false,
        disabled_reason: `rejected:${reason}`,
        updated_at: new Date().toISOString(),
      })
      .eq('acquiring_account_id', row.acquiring_account_id)
      .select(ACCOUNT_COLUMNS)
      .single();
    if (error) {
      throw new Error('Could not update the card account.');
    }
    return data;
  }

  /** Available + pending amounts on the merchant's connected account. */
  async getBalance(organizationId: string, environment: 'live' | 'test') {
    const row = await this.mustFindRow(organizationId, environment);
    const client = this.stripe.getClient(environment);
    const balance = await client.balance.retrieve({
      stripeAccount: row.stripe_account_id as string,
    });
    const shape = (entries: Stripe.Balance.Available[]) =>
      entries.map((entry) => ({
        amount: entry.amount / 100,
        currency: entry.currency.toUpperCase(),
      }));
    return {
      available: shape(balance.available),
      pending: shape(balance.pending),
    };
  }

  /** Balance transactions for reconciliation, optionally for one payout. */
  async listBalanceTransactions(
    organizationId: string,
    environment: 'live' | 'test',
    payoutId?: string,
  ) {
    const row = await this.mustFindRow(organizationId, environment);
    const client = this.stripe.getClient(environment);
    const result = await client.balanceTransactions.list(
      { limit: 100, payout: payoutId },
      { stripeAccount: row.stripe_account_id as string },
    );
    return result.data.map((entry) => ({
      id: entry.id,
      amount: entry.amount / 100,
      fee: entry.fee / 100,
      net: entry.net / 100,
      currency: entry.currency.toUpperCase(),
      type: entry.type,
      description: entry.description,
      created: new Date(entry.created * 1000).toISOString(),
    }));
  }

  /** Shared upsert used by refresh and by the webhook handler. */
  async syncFromAccount(acquiringAccountId: string, account: Stripe.Account) {
    const requirements = account.requirements;
    const due = [
      ...(requirements?.currently_due ?? []),
      ...(requirements?.past_due ?? []),
    ];
    const { data, error } = await this.supabase
      .from('organization_acquiring_accounts')
      .update({
        status: account.charges_enabled ? 'active' : 'review',
        charges_enabled: account.charges_enabled ?? false,
        payouts_enabled: account.payouts_enabled ?? false,
        capabilities: (account.capabilities ?? {}) as Record<string, string>,
        requirements_due: due,
        disabled_reason: requirements?.disabled_reason ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('acquiring_account_id', acquiringAccountId)
      .select(ACCOUNT_COLUMNS)
      .single();
    if (error) {
      throw new Error('Could not sync the card account.');
    }
    return data;
  }

  private async loadKyc(organizationId: string) {
    const { data, error } = await this.supabase
      .from('organization_kyc')
      .select(
        'status, legal_country, legal_region, legal_city, legal_postal_code, legal_street, legal_organization_name, tax_number, authorized_signatory_name, authorized_signatory_email',
      )
      .eq('organization_id', organizationId)
      .maybeSingle();
    if (error) {
      throw new Error(`organization_kyc read failed: ${error.message}`);
    }
    if (!data) {
      throw new NotFoundException('Organization verification not found.');
    }
    return data;
  }

  private legalAddress(kyc: {
    legal_street: string | null;
    legal_city: string | null;
    legal_region: string | null;
    legal_postal_code: string | null;
    legal_country: string | null;
  }): Stripe.AddressParam | undefined {
    if (!kyc.legal_street && !kyc.legal_city) {
      return undefined;
    }
    const country = this.countries.eligibleCountry(kyc.legal_country);
    return {
      line1: kyc.legal_street ?? undefined,
      city: kyc.legal_city ?? undefined,
      state: kyc.legal_region ?? undefined,
      postal_code: kyc.legal_postal_code ?? undefined,
      country: country ?? undefined,
    };
  }

  private async findRow(organizationId: string, environment: string) {
    const { data, error } = await this.supabase
      .from('organization_acquiring_accounts')
      .select(ACCOUNT_COLUMNS)
      .eq('organization_id', organizationId)
      .eq('environment', environment)
      .maybeSingle();
    if (error) {
      throw new Error(`acquiring account read failed: ${error.message}`);
    }
    return data;
  }

  private async mustFindRow(organizationId: string, environment: string) {
    const row = await this.findRow(organizationId, environment);
    if (!row) {
      throw new NotFoundException(
        'No card account for this organization in this environment.',
      );
    }
    return row;
  }
}
