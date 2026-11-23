import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AccountsModule } from "./accounts/accounts.module";
import { ChargesModule } from "./charges/charges.module";
import { RiskModule } from "./risk/risk.module";
import { RoutingModule } from "./routing/routing.module";
import { StripeModule } from "./stripe/stripe.module";
import { SupabaseModule } from "./supabase/supabase.module";
import { WebhooksModule } from "./webhooks/webhooks.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    StripeModule,
    SupabaseModule,
    AccountsModule,
    ChargesModule,
    RiskModule,
    RoutingModule,
    WebhooksModule,
  ],
})
export class AppModule {}
