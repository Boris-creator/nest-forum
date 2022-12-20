import { Controller, Post, Body, UseGuards, Catch } from "@nestjs/common";
import { JwtGuard } from "../auth/auth.guard";
import { User } from "../auth/auth.decorator";
import { newComment, CommentsService } from "./comments.service";
import { ValidationPipe } from "./comments.pipe";
@Controller("comment")
export class CommentsController {
  constructor(private service: CommentsService) {}
  @Post("add")
  @UseGuards(JwtGuard)
  async add(
    @Body(ValidationPipe) comment: newComment,
    @User(["id", "username"]) user: { id: number; username: string },
  ) {
    comment.userId = user.id;
    const res = await this.service.add(comment);
    res.dataValues.author = {
      login: user.username,
    };
    /*
    return {
      success: !!res,
      comment: res,
    };
    */
    return res;
  }
  @Post("find")
  async getAll(@Body() filter: { itemId: number }) {
    return await this.service.getAll(filter.itemId);
  }
}
