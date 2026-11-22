import {
  Controller,
  Headers,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { RiskService } from './risk.service';

function assertInternalKey(key: string | undefined) {
  const expected = process.env.CONNECT_INTERNAL_KEY?.trim();
  if (!expected || key !== expected) {
    throw new UnauthorizedException();
  }
}

/**
 * Merchant risk evaluation. Callable by the monolith, admin, or a cron —
 * evaluates any org (either rail) against the shared thresholds.
 */
@Controller('internal/risk')
export class RiskController {
  constructor(private readonly risk: RiskService) {}

  @Post('evaluate/:organizationId')
  evaluate(
    @Headers('x-connect-key') key: string,
    @Param('organizationId') organizationId: string,
    @Query('environment') environment: 'live' | 'test' = 'live',
  ) {
    assertInternalKey(key);
    return this.risk.evaluate(organizationId, environment);
  }
}
