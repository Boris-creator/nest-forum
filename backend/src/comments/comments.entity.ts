import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Item } from "../items/item.entity";
import { User } from "../user/user.entity";
//TO DO: make it paranoid
@Table
export class Comment extends Model {
  @Column({ allowNull: false })
  content: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @ForeignKey(() => Item)
  @Column({ allowNull: false })
  itemId: number;

  @BelongsTo(() => User)
  author: User;

  @BelongsTo(() => Item)
  subject: Item;

  @ForeignKey(() => Comment)
  @Column({ allowNull: true })
  commentId: number;

  @BelongsTo(() => Comment)
  answerTo: number;
}
