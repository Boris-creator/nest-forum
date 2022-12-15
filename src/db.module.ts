import { Module } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { User } from "./user/user.entity";
import { Unverified } from "./user/unverifiedUser.entity";
import { Item } from "./items/item.entity";
import { ItemRaiting } from "./itemRaiting/raiting.entity";
import * as dotenv from "dotenv";
dotenv.config();
const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async (): Promise<Sequelize> => {
      const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
        dialect: "mysql",
        host: "localhost",
      });
      sequelize.addModels([User, Unverified, Item, ItemRaiting]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
