import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "../mail.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: "MySecret",
      signOptions: { expiresIn: 60 * 1000 + "s" },
    }),
    MailModule,
  ],
  exports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, MailModule],
})
export class AuthModule {}
