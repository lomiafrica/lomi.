import { Module } from "@nestjs/common";
import { RoutingController } from "./routing.controller";

@Module({
  controllers: [RoutingController],
})
export class RoutingModule {}
