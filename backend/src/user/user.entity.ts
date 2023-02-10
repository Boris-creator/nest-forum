import { Table, Column, Model, BelongsToMany } from "sequelize-typescript";
import { Role } from "../roles/roles.entity";
import { UserRole } from "../roles/userRoles.entity";
@Table
export class User extends Model {
  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: false })
  login: string;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];
}
