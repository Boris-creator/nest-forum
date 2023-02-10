import { Module } from "@nestjs/common";
import { RaitingService } from "./raiting.service";
import { RaitingController } from "./raiting.controller";
import { raitingProviders } from "./raiting.provider";
import { ItemsModule } from "../items/items.module";
import { AuthModule } from "../auth/auth.module"
import { itemProviders } from "../items/item.providers";
import { JwtGuard} from "../auth/auth.guard"
@Module({
  imports: [ItemsModule, AuthModule],
  providers: [
    RaitingService,
    ItemsModule,
    JwtGuard,
    ...raitingProviders,
    ...itemProviders,
  ],
  controllers: [RaitingController],
  exports: [RaitingService],
})
export class RaitingModule {}
