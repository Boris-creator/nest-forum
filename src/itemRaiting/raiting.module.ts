import { Module } from "@nestjs/common";
import { RaitingService } from "./raiting.service";
import { RaitingController } from "./raiting.controller";
import { raitingProviders } from "./raiting.provider";
import { ItemsModule } from "../items/items.module";
import { itemProviders } from "../items/item.providers";
@Module({
  imports: [ItemsModule],
  providers: [
    RaitingService,
    ItemsModule,
    ...raitingProviders,
    ...itemProviders,
  ],
  controllers: [RaitingController],
  exports: [RaitingService],
})
export class RaitingModule {}
