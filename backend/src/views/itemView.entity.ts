import {
    Table,
    Column,
    Model,
    ForeignKey,
    PrimaryKey,
    BelongsTo,
  } from "sequelize-typescript";
  import { User } from "../user/user.entity";
  import { Item } from "../items/item.entity";
  @Table
  export class ItemView extends Model {
  
    @ForeignKey(() => User)
    @PrimaryKey
    @Column({ allowNull: false })
    userId: number;
  
    @ForeignKey(() => Item)
    @PrimaryKey
    @Column({ allowNull: false })
    itemId: number;
  
    @BelongsTo(() => User)
    user: number;
  
    @BelongsTo(() => Item)
    item: number;
  }
  