import { Injectable, Inject } from "@nestjs/common";
import { Comment } from "./comments.entity";
import { User } from "../user/user.entity";
import { newComment as comment } from "../types";
export type newComment = comment & {
  userId: number; //author
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
  async deleteOne(filter: { id: number }) {
    const { id } = filter;
    return await this.comment.destroy({
      where: { id },
    });
  }
}
