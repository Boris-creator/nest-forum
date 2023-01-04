import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  DataType,
} from "sequelize-typescript";
import { User } from "../user/user.entity";
import { ItemView } from "../views/itemView.entity";
@Table
export class Item extends Model {
  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false, type: DataType.JSON })
  body: object;

  @ForeignKey(() => User)
  @Column({ allowNull: true })
  userId: number;

  @Column({ allowNull: true })
  raiting: number;

  @Column({ allowNull: false })
  approved: boolean;

  @BelongsTo(() => User)
  author: User;

  @HasMany(() => ItemView)
  views: ItemView[];
}
