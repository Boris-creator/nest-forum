import {
  Controller,
  Post,
  Body,
  Query,
  UnauthorizedException,
  Get,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ValidationPipe as signupPipe } from "./signup.pipe";
import { ValidationPipe as loginPipe } from "./login.pipe";

type LoginData = { email: string; password: string; login: string };

@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post("login")
  async signIn(
    @Body(loginPipe) body: LoginData,
  ): Promise<{ access_token: string }> {
    const user = await this.appService.findUser(body);
    if (!user) {
      throw new UnauthorizedException(
        "Username or password may be incorrect. Please try again",
      );
    }
    return this.appService.authorize(user);
  }
  @Post("signup")
  //@UsePipes(new ValidationPipe())
  async signUp(@Body(signupPipe) body: LoginData) {
    return await this.appService.signUp(body);
  }
  @Get("verify")
  async verify(@Query() query: { h: string }, @Res() res) {
    const ok = await this.appService.verifyByMail(query.h.replace(/ /g, "+"));
    if (ok) {
      res.redirect("/login");
    }
  }
}
