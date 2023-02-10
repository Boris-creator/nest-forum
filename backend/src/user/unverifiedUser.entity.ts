import { Table, Column, Model, DataType } from "sequelize-typescript";
@Table
export class Unverified extends Model {
  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: false })
  hash: string;

  @Column({ allowNull: false })
  login: string;

  @Column(DataType.BIGINT)
  @Column({ allowNull: false })
  expire: bigint;
}
