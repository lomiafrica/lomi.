import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WebhooksController } from './webhooks.controller';
import { WebhooksInternalController } from './webhooks-internal.controller';
import { WebhooksService } from './webhooks.service';
import { WebhookSenderModule } from './webhook-sender.module';
import { WebhookListener } from './listeners/webhook.listener';
import { WebhookQueueProcessor } from './processors/webhook.processor';
import { WaveWebhookModule } from './providers/wave/wave-webhook.module';
import { StripeWebhookModule } from './providers/stripe/stripe-webhook.module';
import { MtnWebhookModule } from './providers/mtn/mtn-webhook.module';
import { SpiWebhookModule } from './providers/spi/spi-webhook.module';
import { CliModule } from '../cli/cli.module';
import { InternalCronGuard } from '../core/common/guards/internal-cron.guard';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'webhooks',
      defaultJobOptions: {
        // Aggressive retention to keep Redis command volume low.
        // Webhooks fan out per event + 5 attempts each; old jobs bloat streams/hashes.
        removeOnComplete: { age: 3600, count: 1000 }, // 1h or last 1k
        removeOnFail: { age: 86400, count: 5000 }, // 24h or last 5k (for debugging)
      },
    }),
    WaveWebhookModule,
    StripeWebhookModule,
    MtnWebhookModule,
    SpiWebhookModule,
    WebhookSenderModule,
    CliModule,
  ],
  controllers: [WebhooksController, WebhooksInternalController],
  providers: [
    WebhooksService,
    WebhookListener,
    WebhookQueueProcessor,
    InternalCronGuard,
  ],
  exports: [WebhookSenderModule],
})
export class WebhooksModule {}
