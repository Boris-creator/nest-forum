import { Controller, Post, Body, UseGuards, Catch } from "@nestjs/common";
import { JwtGuard } from "../auth/auth.guard";
import { User } from "../auth/auth.decorator";
import { newComment, CommentsService } from "./comments.service";
import { ValidationPipe } from "./comments.pipe";
import { RoleGuard } from "../roles/roles.guard";
import { permissions } from "../roles/permissions.constants";
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
    if (!res) {
      return null;
    }
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
  @Post("delete")
  @UseGuards(JwtGuard, new RoleGuard([permissions.delete_comments]))
  async deleteOne(@Body() filter: { id: number }) {
    try {
      await this.service.deleteOne(filter);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
}
