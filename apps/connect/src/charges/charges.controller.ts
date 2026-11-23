import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ChargesService,
  CreateChargeInput,
  RefundChargeInput,
} from "./charges.service";

function assertInternalKey(key: string | undefined) {
  const expected = process.env.CONNECT_INTERNAL_KEY?.trim();
  if (!expected || key !== expected) {
    throw new UnauthorizedException();
  }
}

/** Internal-only: the monolith creates destination charges through here. */
@Controller("internal/charges")
export class ChargesController {
  constructor(private readonly charges: ChargesService) {}

  @Post()
  create(
    @Headers("x-connect-key") key: string,
    @Body() body: CreateChargeInput,
  ) {
    assertInternalKey(key);
    return this.charges.createCharge(body);
  }

  @Post("refund")
  refund(
    @Headers("x-connect-key") key: string,
    @Body() body: RefundChargeInput,
  ) {
    assertInternalKey(key);
    return this.charges.refundCharge(body);
  }
}
