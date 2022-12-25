import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
@Controller()
export class UserController {
    /*
  constructor(private readonly appService: UserService) {}

  @Post("/users")
  async getHello(@Body() user) {
    console.log(user.login)
    return await this.appService.findByEmail(user.login);
  }
  */
}
