import { Injectable, Inject } from "@nestjs/common";
import { Item } from "./item.entity";
import { ItemView } from "../views/itemView.entity";
import {User} from "../user/user.entity"
import { Sequelize } from "sequelize";
import { queryOptions as options, itemsInfo as info, item } from "../types";

export type newItem = item & { userId: number; approved: boolean };
@Injectable()
export class ItemsService {
  constructor(@Inject("ITEM_REPOSITORY") private item: typeof Item) {}
  async getAll(): Promise<item[]> {
    return await this.item.findAll();
  }
  async findOne(itemId: number) {
    return await this.item.findByPk(itemId);
  }
  async findSome(options: options) {
    const condition = options.filter;
    const [count, items] = await Promise.all([
      this.item.count({
        where: condition,
      }),
      this.item.findAll({
        ...options,
        where: condition,
        include: {
          model: User,
          attributes: ["login"]
        }
      }),
    ]);
    const response: info<item> = { count, items };
    return response;
  }
  async getById(id: number) {
    return await this.item.findByPk(id, {
      include: [
        {
          as: "views",
          model: ItemView,
          attributes: {
            include: [
              [Sequelize.fn("COUNT", Sequelize.col("views.itemId")), "views"],
            ],
            exclude: ["id", "itemId", "userId", "createdAt", "updatedAt"]
          },
        },
      ],
      //subQuery: false,
    });
  }
  async create(item: newItem) {
    return await this.item.create(item);
  }
  async edit(item: item & { id: number }) {}
  async approve(id: number, approved: boolean) {
    return await this.item.update({ approved }, { where: { id } });
  }
}
