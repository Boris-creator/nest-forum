import { Module } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { itemProviders } from "./item.providers";
import { ItemsController } from "./items.controller";
import { AuthModule } from "../auth/auth.module";
@Module({
  imports: [AuthModule],
  controllers: [ItemsController],
  providers: [ItemsService, ...itemProviders],
  exports: [ItemsService]
})
export class ItemsModule {}
