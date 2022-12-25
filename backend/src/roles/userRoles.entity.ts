import {
    Table,
    Column,
    Model,
    ForeignKey,
    PrimaryKey,
    BelongsTo,
  } from "sequelize-typescript";
  import { User } from "../user/user.entity";
  import { Role } from "./roles.entity";
  @Table
  export class UserRole extends Model {
  
    @ForeignKey(() => User)
    @PrimaryKey
    @Column({ allowNull: false })
    userId: number;
  
    @ForeignKey(() => Role)
    @PrimaryKey
    @Column({ allowNull: false })
    roleId: string;
  
    @BelongsTo(() => User)
    user: number;
  
    @BelongsTo(() => Role)
    role: number;
  }
  