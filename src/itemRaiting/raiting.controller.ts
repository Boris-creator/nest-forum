import { Controller, Post, Body, UseGuards, Catch } from "@nestjs/common";
import { RaitingService } from "./raiting.service";
import { RaitingGuard } from "./raiting.guard"
import { JwtGuard } from "../auth/auth.guard"
@Controller()
export class RaitingController {
  constructor(private readonly service: RaitingService) {}

  @Post("/estimate")
  @UseGuards(JwtGuard, RaitingGuard)
  async setRaiting(@Body() data: {userId: number, itemId: number, value: number}) {
    const {userId, itemId, value} = data
    return await this.service.estimate(userId, itemId, value);
  }
}
