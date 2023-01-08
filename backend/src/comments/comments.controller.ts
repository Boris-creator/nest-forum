import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
} from "@nestjs/common";
import { JwtGuard } from "../auth/auth.guard";
import { User } from "../auth/auth.decorator";
import { newComment, CommentsService } from "./comments.service";
import { RoleGuard } from "../roles/roles.guard";
import { EditGuard, AddGuard } from "./comments.guard";
import { permissions } from "../roles/permissions.constants";
import { ValidationPipe, MultiValidationPipe } from "../pipeFactory";
import { schema } from "../validationSchema";
import { editComment } from "../types";
import { FilesInterceptor } from "@nestjs/platform-express";
import { FileTypeValidator } from "./fileValidator";

@Controller("comment")
export class CommentsController {
  constructor(private service: CommentsService) {}

  @Post("add")
  @UseGuards(JwtGuard, AddGuard)
  //@UseInterceptors(FilesInterceptor("files")) //already got the files array in guard.
  async add(
    @Body(new MultiValidationPipe({ key: "comment", schema: schema.comment }))
    comment: newComment,
    @User(["id", "username"]) user: { id: number; username: string },
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    comment.userId = user.id;
    const res = await this.service.add(comment, files);
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
