import { Injectable, Inject } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Comment } from "./comments.entity";
import { User } from "../user/user.entity";
import { Notify } from "../notifications/notifications.enum";
import { newComment as comment, editComment } from "../types";
import { frontend } from "../constants";
import * as fs from "fs/promises";
import { join } from "path";

export type newComment = comment & {
  userId: number; //author
};
@Injectable()
export class CommentsService {
  constructor(
    @Inject("COMMENT_REPOSITORY") private comment: typeof Comment,
    private emitter: EventEmitter2,
  ) {}

  private uploadsFolder = join(
    __dirname,
    "..",
    ...frontend,
    "src",
    "assets",
    "uploads",
  );
  async add(data: newComment, files: Express.Multer.File[]) {
    const safeNames = files.reduce(
      (a, f) => ({
        ...a,
        [f.fieldname]: `${Date.now()}_${data.userId}_${data.itemId}_${
          f.fieldname
        }.${f.originalname.replace(/.+\./, "")}`, //I don't want to use originalname
      }),
      {},
    );
    try {
      await Promise.all(
        files.map((file) => {
          fs.writeFile(
            join(this.uploadsFolder, safeNames[file.fieldname]),
            file.buffer,
          );
        }),
      );
      return await this.comment.create({
        ...data,
        files: Object.values(safeNames),
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async edit(comment: editComment) {
    return await this.comment.update(
      { content: comment.content },
      {
        where: { id: comment.id },
      },
    );
  }
  async getAll(itemId: number) {
    return await this.comment.findAll({
      where: { itemId },
      attributes: {
        exclude: ["updatedAt"],
      },
      include: {
        model: User,
        attributes: ["login", "id"],
      },
    });
  }
  findOne(id: number) {
    return this.comment.findByPk(id);
  }
  async deleteOne(
    filter: { id: number },
    by: { id: number; username: string },
  ) {
    const { id } = filter;
    //it should be paranoid
    const comment = await this.comment.findByPk(id);
    await Promise.all(
      comment.files.map((file) => fs.unlink(join(this.uploadsFolder, file))),
    );
    const num = await this.comment.destroy({
      where: { id },
    });
    this.emitter.emit(Notify.deleteComment, { comment, by: by });
    return num;
  }
}
