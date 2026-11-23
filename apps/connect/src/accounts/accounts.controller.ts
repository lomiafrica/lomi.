import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import {
  AccountsService,
  CreateAccountInput,
  KycRelayInput,
} from "./accounts.service";
import { SupportedCountriesService } from "./supported-countries.service";

function assertInternalKey(key: string | undefined) {
  const expected = process.env.CONNECT_INTERNAL_KEY?.trim();
  if (!expected || key !== expected) {
    throw new UnauthorizedException();
  }
}

/**
 * Internal-only API. The monolith (apps/api) and admin call these with
 * X-Connect-Key; merchants never reach this service directly.
 */
@Controller("internal/accounts")
export class AccountsController {
  constructor(
    private readonly accounts: AccountsService,
    private readonly countries: SupportedCountriesService,
  ) {}

  /** Pre-flight for the dashboard tile: is this KYB country eligible? */
  @Get("eligibility")
  eligibility(
    @Headers("x-connect-key") key: string,
    @Query("legalCountry") legalCountry: string,
  ) {
    assertInternalKey(key);
    return { country: this.countries.eligibleCountry(legalCountry) };
  }

  @Post()
  create(
    @Headers("x-connect-key") key: string,
    @Body() body: CreateAccountInput,
  ) {
    assertInternalKey(key);
    return this.accounts.createAccount(body);
  }

  @Post(":organizationId/kyc")
  relayKyc(
    @Headers("x-connect-key") key: string,
    @Param("organizationId") organizationId: string,
    @Body() body: Omit<KycRelayInput, "organizationId">,
  ) {
    assertInternalKey(key);
    return this.accounts.relayKyc({ ...body, organizationId });
  }

  @Get(":organizationId")
  status(
    @Headers("x-connect-key") key: string,
    @Param("organizationId") organizationId: string,
    @Query("environment") environment: "live" | "test" = "test",
  ) {
    assertInternalKey(key);
    return this.accounts.getStatus(organizationId, environment);
  }

  @Post(":organizationId/refresh")
  refresh(
    @Headers("x-connect-key") key: string,
    @Param("organizationId") organizationId: string,
    @Body() body: { environment: "live" | "test" },
  ) {
    assertInternalKey(key);
    return this.accounts.refreshFromProvider(organizationId, body.environment);
  }

  /** Ops kill switch: reject an account (fraud / terms / other). */
  @Post(":organizationId/reject")
  reject(
    @Headers("x-connect-key") key: string,
    @Param("organizationId") organizationId: string,
    @Body()
    body: {
      environment: "live" | "test";
      reason: "fraud" | "terms_of_service" | "other";
    },
  ) {
    assertInternalKey(key);
    return this.accounts.rejectAccount(
      organizationId,
      body.environment,
      body.reason,
    );
  }

  /** Available + pending amounts settling to the merchant's bank. */
  @Get(":organizationId/balance")
  balance(
    @Headers("x-connect-key") key: string,
    @Param("organizationId") organizationId: string,
    @Query("environment") environment: "live" | "test" = "test",
  ) {
    assertInternalKey(key);
    return this.accounts.getBalance(organizationId, environment);
  }

  /** Balance transactions for reconciliation (optionally one payout). */
  @Get(":organizationId/balance-transactions")
  balanceTransactions(
    @Headers("x-connect-key") key: string,
    @Param("organizationId") organizationId: string,
    @Query("environment") environment: "live" | "test" = "test",
    @Query("payout") payout?: string,
  ) {
    assertInternalKey(key);
    return this.accounts.listBalanceTransactions(
      organizationId,
      environment,
      payout,
    );
  }
}
