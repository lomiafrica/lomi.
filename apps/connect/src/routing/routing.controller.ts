import {
  Controller,
  Get,
  Headers,
  Param,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";

function assertInternalKey(key: string | undefined) {
  const expected = process.env.CONNECT_INTERNAL_KEY?.trim();
  if (!expected || key !== expected) {
    throw new UnauthorizedException();
  }
}

export type CardRail = "aggregate" | "connect";

/**
 * Per-org card rail resolution for checkout. Default is always the existing
 * aggregate rail; an org only flips when an operator sets the flag AND the
 * connected account can actually charge.
 */
@Controller("internal/routing")
export class RoutingController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get(":organizationId")
  async resolve(
    @Headers("x-connect-key") key: string,
    @Param("organizationId") organizationId: string,
    @Query("environment") environment: "live" | "test" = "test",
  ): Promise<{ rail: CardRail }> {
    assertInternalKey(key);

    const { data: routing } = await this.supabase
      .from("organization_card_routing")
      .select("rail")
      .eq("organization_id", organizationId)
      .eq("environment", environment)
      .maybeSingle();
    if (!routing || routing.rail !== "connect") {
      return { rail: "aggregate" };
    }

    const { data: account } = await this.supabase
      .from("organization_acquiring_accounts")
      .select("charges_enabled")
      .eq("organization_id", organizationId)
      .eq("environment", environment)
      .maybeSingle();

    // Never strand a merchant: any doubt falls back to the aggregate rail.
    return { rail: account?.charges_enabled ? "connect" : "aggregate" };
  }
}
