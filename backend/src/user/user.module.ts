import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { usersProviders } from "./user.provider";
import { unverifiedUserProviders } from "./unverifiedUser.provider";
import { UserController } from "./user.controller";
@Module({
  providers: [UserService, ...usersProviders, ...unverifiedUserProviders],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
