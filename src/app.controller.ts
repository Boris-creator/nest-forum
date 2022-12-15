import { Controller, Get, Res, Req, UseGuards } from "@nestjs/common";
import { Response, Request } from "express";
import { AppService } from "./app.service";
import { JwtGuard } from "./auth/auth.guard";
import { join } from "path";
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/hello")
  @UseGuards(JwtGuard)
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("/")
  send(@Req() req: Request, @Res() res: Response) {
    res.sendFile(join(__dirname, "..", "..", "frontend", "dist", "frontend", "index.html"));
  }
}
