import { Controller, Post, Body, UseGuards, Catch } from "@nestjs/common";
import { JwtGuard } from "../auth/auth.guard";
import { User } from "../auth/auth.decorator";
import { newComment, CommentsService } from "./comments.service";
import { RoleGuard } from "../roles/roles.guard";
import { EditGuard, AddGuard } from "./comments.guard";
import { permissions } from "../roles/permissions.constants";
import { ValidationPipe } from "../pipeFactory";
import { schema } from "../validationSchema";
import { editComment } from "../types";

@Controller("comment")
export class CommentsController {
  constructor(private service: CommentsService) {}
  @Post("add")
  @UseGuards(JwtGuard, AddGuard)
  async add(
    @Body(new ValidationPipe(schema.comment)) comment: newComment,
    @User(["id", "username"]) user: { id: number; username: string },
  ) {
    comment.userId = user.id;
    const res = await this.service.add(comment);
    if (!res) {
      return null;
    }
    res.dataValues.author = {
      login: user.username,
      id: user.id,
    };
    /*
    return {
      success: !!res,
      comment: res,
    };
    */
    return res;
  }
  @Post("edit")
  @UseGuards(JwtGuard, EditGuard)
  async edit(
    @Body(new ValidationPipe(schema.editComment)) comment: editComment,
    @User(["id"]) user: { id: number },
  ) {
    const res = await this.service.edit(comment);
    return { success: res[0] > 0 };
  }
  @Post("find")
  async getAll(@Body() filter: { itemId: number }) {
    return await this.service.getAll(filter.itemId);
  }
  @Post("delete")
  @UseGuards(JwtGuard, new RoleGuard([permissions.delete_comments]))
  async deleteOne(
    @Body() filter: { id: number },
    @User(["id", "username"]) user: { id: number; username: string },
  ) {
    try {
      await this.service.deleteOne(filter, user);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
}
