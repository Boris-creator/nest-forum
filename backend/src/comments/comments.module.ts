import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { commentProviders } from "./comments.provider";
import { CommentsController } from "./comments.controller";
import { AuthModule } from "../auth/auth.module";
import { JwtGuard } from "../auth/auth.guard";
import { ItemsModule } from "../items/items.module"
@Module({
  imports: [AuthModule, ItemsModule],
  providers: [
    CommentsService,
    ...commentProviders,
    AuthModule,
    JwtGuard,
  ],
  controllers: [CommentsController],
})
export class CommentsModule {}
