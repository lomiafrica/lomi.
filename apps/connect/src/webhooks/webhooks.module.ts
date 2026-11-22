import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { MonolithForwarderService } from './monolith-forwarder.service';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [AccountsModule],
  controllers: [WebhooksController],
  providers: [MonolithForwarderService],
})
export class WebhooksModule {}
