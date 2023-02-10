import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../user/user.entity";
import { Notify } from "./notifications.enum";
@Table
export class Notification extends Model {
  @Column({ allowNull: false })
  text: string;

  @Column({ allowNull: false })
  type: Notify;

  @ForeignKey(() => User)
  @Column({ allowNull: true })
  userId: number;

  @Column({ allowNull: true })
  read: boolean;

  @BelongsTo(() => User)
  recipient: User;
}
