/**
 * Main lomi. SDK class
 * AUTO-GENERATED - Do not edit manually
 */

import type { LomiConfig } from './config.js';
import { LomiClient } from './client.js';
import {
  AccountService,
  AccountsService,
  ApiKeysService,
  ChargesService,
  CheckoutSessionsService,
  CouponsService,
  CustomersService,
  DisputesService,
  ExportsService,
  FinanceService,
  InvoicesService,
  LogsService,
  MerchantsService,
  MetersService,
  OrganizationsService,
  PaymentLinksService,
  PaymentRequestsService,
  PayoutMethodsService,
  PayoutsService,
  ProductsService,
  ProvidersService,
  RefundsService,
  RiskAssessmentsService,
  SettingsService,
  SettlementsService,
  SubscriptionsService,
  SupportRequestsService,
  TeamService,
  TransactionsService,
  UsageService,
  WebhooksService,
} from './generated/index.js';
import { NetworkResource } from './resources/network.js';
import { TransfersResource } from './resources/transfers.js';

export class LomiSDK {
  private readonly client: LomiClient;

  public readonly account: AccountService;
  public readonly accounts: AccountsService;
  public readonly apiKeys: ApiKeysService;
  public readonly charges: ChargesService;
  public readonly checkoutSessions: CheckoutSessionsService;
  public readonly coupons: CouponsService;
  public readonly customers: CustomersService;
  public readonly disputes: DisputesService;
  public readonly exports: ExportsService;
  public readonly finance: FinanceService;
  public readonly invoices: InvoicesService;
  public readonly logs: LogsService;
  public readonly merchants: MerchantsService;
  public readonly meters: MetersService;
  public readonly organizations: OrganizationsService;
  public readonly paymentLinks: PaymentLinksService;
  public readonly paymentRequests: PaymentRequestsService;
  public readonly payoutMethods: PayoutMethodsService;
  public readonly payouts: PayoutsService;
  public readonly products: ProductsService;
  public readonly providers: ProvidersService;
  public readonly refunds: RefundsService;
  public readonly riskAssessments: RiskAssessmentsService;
  public readonly settings: SettingsService;
  public readonly settlements: SettlementsService;
  public readonly subscriptions: SubscriptionsService;
  public readonly supportRequests: SupportRequestsService;
  public readonly team: TeamService;
  public readonly transactions: TransactionsService;
  public readonly usage: UsageService;
  public readonly webhooks: WebhooksService;
  /** lomi. Network (hand-written resource). */
  public readonly network: NetworkResource;
  /** lomi. Network (hand-written resource). */
  public readonly transfers: TransfersResource;

  constructor(config: LomiConfig) {
    this.client = new LomiClient(config);

    this.account = new AccountService(this.client);
    this.accounts = new AccountsService(this.client);
    this.apiKeys = new ApiKeysService(this.client);
    this.charges = new ChargesService(this.client);
    this.checkoutSessions = new CheckoutSessionsService(this.client);
    this.coupons = new CouponsService(this.client);
    this.customers = new CustomersService(this.client);
    this.disputes = new DisputesService(this.client);
    this.exports = new ExportsService(this.client);
    this.finance = new FinanceService(this.client);
    this.invoices = new InvoicesService(this.client);
    this.logs = new LogsService(this.client);
    this.merchants = new MerchantsService(this.client);
    this.meters = new MetersService(this.client);
    this.organizations = new OrganizationsService(this.client);
    this.paymentLinks = new PaymentLinksService(this.client);
    this.paymentRequests = new PaymentRequestsService(this.client);
    this.payoutMethods = new PayoutMethodsService(this.client);
    this.payouts = new PayoutsService(this.client);
    this.products = new ProductsService(this.client);
    this.providers = new ProvidersService(this.client);
    this.refunds = new RefundsService(this.client);
    this.riskAssessments = new RiskAssessmentsService(this.client);
    this.settings = new SettingsService(this.client);
    this.settlements = new SettlementsService(this.client);
    this.subscriptions = new SubscriptionsService(this.client);
    this.supportRequests = new SupportRequestsService(this.client);
    this.team = new TeamService(this.client);
    this.transactions = new TransactionsService(this.client);
    this.usage = new UsageService(this.client);
    this.webhooks = new WebhooksService(this.client);
    this.network = new NetworkResource(this.client);
    this.transfers = new TransfersResource(this.client);
  }

  /** Rotate the secret API key on this client instance. */
  setApiKey(apiKey: string): void {
    this.client.setApiKey(apiKey);
  }

  /** Current API base URL for this client instance. */
  getBaseUrl(): string {
    return this.client.baseUrl;
  }
}
