import { Module } from '@nestjs/common';
import { SupabaseModule } from '../utils/supabase/supabase.module';
import { CliModule } from '../cli/cli.module';
import { WebhookSenderService } from './webhook-sender.service';

/** Webhook dispatch without BullMQ listeners or provider ingress. */
@Module({
  imports: [SupabaseModule, CliModule],
  providers: [WebhookSenderService],
  exports: [WebhookSenderService],
})
export class WebhookSenderModule {}
