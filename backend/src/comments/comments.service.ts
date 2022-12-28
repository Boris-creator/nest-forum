import { Injectable, Inject } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Comment } from "./comments.entity";
import { User } from "../user/user.entity";
import { Notify } from "../notifications/notifications.enum";
import { newComment as comment, editComment } from "../types";
export type newComment = comment & {
  userId: number; //author
};
@Injectable()
export class CommentsService {
  constructor(
    @Inject("COMMENT_REPOSITORY") private comment: typeof Comment,
    private emitter: EventEmitter2,
  ) {}
  async add(data: newComment) {
    try {
      return await this.comment.create(data);
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
    const num = await this.comment.destroy({
      where: { id },
    });
    this.emitter.emit(Notify.deleteComment, { comment, by: by });
    return num;
  }
}
