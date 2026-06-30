import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../utils/supabase/supabase.module';
import { WebhookSenderModule } from '../../webhooks/webhook-sender.module';
import { RadarModule } from '../radar/radar.module';
import { GimHmacService } from './gim-hmac.service';
import { GimClientService } from './gim-client.service';
import { GimChargeService } from './gim-charge.service';
import { GimCheckoutService } from './gim-checkout.service';
import { GimReturnController } from './gim-return.controller';

@Module({
  imports: [SupabaseModule, RadarModule, WebhookSenderModule],
  controllers: [GimReturnController],
  providers: [
    GimHmacService,
    GimClientService,
    GimChargeService,
    GimCheckoutService,
  ],
  exports: [
    GimHmacService,
    GimClientService,
    GimChargeService,
    GimCheckoutService,
  ],
})
export class GimModule {}
