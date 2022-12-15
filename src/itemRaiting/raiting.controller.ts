import { Controller, Post, Body, UseGuards, Catch } from "@nestjs/common";
import { RaitingService } from "./raiting.service";
import { RaitingGuard } from "./raiting.guard"
@Controller()
export class RaitingController {
  constructor(private readonly service: RaitingService) {}

  @Post("/estimate")
  @UseGuards(RaitingGuard)
  async setRaiting(@Body() data: {userId: number, itemId: number, value: number}) {
    const {userId, itemId, value} = data
    return await this.service.estimate(userId, itemId, value);
  }
}
