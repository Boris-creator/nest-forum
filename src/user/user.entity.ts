import { Table, Column, Model } from "sequelize-typescript";
@Table
export class User extends Model {
  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: false })
  login: string;
}
