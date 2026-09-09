/**
 * lomi. Network operator endpoints (hand-written resource).
 *
 * Operator key only, no `Lomi-Account` header:
 * - `network.accounts.createLoginLink(account)` opens the member dashboard.
 * - `network.accountSessions.create({ account, components })` mints a
 *   short-lived client secret for embedded components (onboarding, payments,
 *   payouts, balance, notification banner).
 *
 * Member balance is `sdk.accounts.getBalance(undefined, { account: 'acct_…' })`.
 */

import type { LomiClient } from '../client.js';
import { requestWithClient } from '../http.js';
import type { LomiRequestOptions } from '../request-options.js';

export interface LoginLink {
  object: 'login_link';
  account: string;
  url: string;
  created_at: string;
  expires_at: string;
}

export interface AccountSessionComponent {
  enabled: boolean;
}

export interface AccountSessionComponents {
  onboarding?: AccountSessionComponent;
  payments?: AccountSessionComponent;
  payouts?: AccountSessionComponent;
  balance?: AccountSessionComponent;
  notification_banner?: AccountSessionComponent;
}

export interface CreateAccountSessionParams {
  /** Member Account (`acct_…`). */
  account: string;
  /** Components the embedded UI may render. Omit for the default set. */
  components?: AccountSessionComponents;
}

export interface AccountSession {
  object: 'account_session';
  account: string;
  client_secret: string;
  expires_at: string;
  components: AccountSessionComponents;
  embed_base_url: string;
}

export class NetworkAccountsResource {
  constructor(private readonly client: LomiClient) {}

  /** Create a hosted dashboard login link for a member (`POST /network/accounts/{account}/login_links`). */
  public async createLoginLink(
    account: string,
    options?: LomiRequestOptions,
  ): Promise<LoginLink> {
    return requestWithClient<LoginLink>(this.client, {
      method: 'POST',
      url: '/network/accounts/{account}/login_links',
      path: { account },
      ...options,
    });
  }
}

export class NetworkAccountSessionsResource {
  constructor(private readonly client: LomiClient) {}

  /** Mint a client secret for embedded member components (`POST /network/account-sessions`). */
  public async create(
    params: CreateAccountSessionParams,
    options?: LomiRequestOptions,
  ): Promise<AccountSession> {
    return requestWithClient<AccountSession>(this.client, {
      method: 'POST',
      url: '/network/account-sessions',
      body: params,
      ...options,
    });
  }
}

export class NetworkResource {
  public readonly accounts: NetworkAccountsResource;
  public readonly accountSessions: NetworkAccountSessionsResource;

  constructor(client: LomiClient) {
    this.accounts = new NetworkAccountsResource(client);
    this.accountSessions = new NetworkAccountSessionsResource(client);
  }
}
