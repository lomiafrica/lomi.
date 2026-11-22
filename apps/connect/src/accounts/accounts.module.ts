import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { SupportedCountriesService } from './supported-countries.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, SupportedCountriesService],
  exports: [AccountsService, SupportedCountriesService],
})
export class AccountsModule {}
