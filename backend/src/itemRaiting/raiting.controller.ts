import { Controller, Post, Body, UseGuards, Catch } from "@nestjs/common";
import { RaitingService } from "./raiting.service";
import { RaitingGuard } from "./raiting.guard";
import { JwtGuard } from "../auth/auth.guard";
import { User } from "../auth/auth.decorator";
import { userGrade } from "../types";

@Controller()
export class RaitingController {
  constructor(private readonly service: RaitingService) {}

  @Post("/estimate")
  @UseGuards(JwtGuard, RaitingGuard)
  async setRaiting(
    @Body() data: { userId: number; itemId: number; value: number },
  ) {
    const { userId, itemId, value } = data;
    return await this.service.estimate(userId, itemId, value);
  }
  @Post("/myGrade")
  @UseGuards(JwtGuard)
  async getGrade(
    @Body() data: { itemId: number },
    @User(["id"]) user,
  ): Promise<userGrade> {
    console.log(user)
    const raiting = await this.service.getGrade(user.id, data.itemId);
    return { raiting: raiting ? raiting.value : -1 };
  }
}
