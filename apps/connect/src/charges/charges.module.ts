import { Module } from '@nestjs/common';
import { ChargesController } from './charges.controller';
import { ChargesService } from './charges.service';

@Module({
  controllers: [ChargesController],
  providers: [ChargesService],
})
export class ChargesModule {}
