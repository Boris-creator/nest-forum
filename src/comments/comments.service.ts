import { Injectable, Inject } from "@nestjs/common";
import { Comment } from "./comments.entity";
import { User } from "../user/user.entity";

export type newComment = {
  itemId: number; //subject
  userId: number; //author
  content: string;
  commentId?: number; //answerTo
};
@Injectable()
export class CommentsService {
  constructor(@Inject("COMMENT_REPOSITORY") private comment: typeof Comment) {}
  async add(data: newComment) {
    try {
      return await this.comment.create(data);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async getAll(itemId: number) {
    return await this.comment.findAll({
      where: { itemId },
      attributes: {
        exclude: ["updatedAt"],
      },
      include: {
        model: User,
        attributes: ["login"],
      },
    });
  }
}
