import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "../mail.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Helper } from "./auth.helper"
import { RolesModule } from "../roles/roles.module";
import { RolesService } from "../roles/roles.service";
import { Mult } from "../multimedia.service"
import * as dotenv from "dotenv";
dotenv.config()
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: 60 * 1000 + "s" },
    }),
    MailModule,
    RolesModule,
  ],
  exports: [JwtModule, Helper],
  controllers: [AuthController],
  providers: [AuthService, Helper, MailModule, RolesService, Mult],
})
export class AuthModule {}
