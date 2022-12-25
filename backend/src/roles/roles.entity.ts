import { Table, Column, Model, PrimaryKey } from "sequelize-typescript";
@Table
export class Role extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: true })
  delete_comments: boolean;

  @Column({ allowNull: true })
  add_items: boolean;

  @Column({ allowNull: true })
  update_roles: boolean;
}
