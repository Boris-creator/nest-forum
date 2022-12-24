import { Injectable, Inject } from "@nestjs/common";
import { Item } from "./item.entity";
import { queryOptions as options, itemsInfo as info } from "../types";
export type item = {
  title: string;
  body: Object;
};
export type newItem = item & { userId: number; approved: boolean };
@Injectable()
export class ItemsService {
  constructor(@Inject("ITEM_REPOSITORY") private item: typeof Item) {}
  async getAll(): Promise<item[]> {
    return await this.item.findAll();
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
      }),
    ]);
    const response: info<item> = { count, items };
    return response;
  }
  async getById(id: number) {
    return await this.item.findByPk(id);
  }
  async create(item: newItem) {
    return await this.item.create(item);
  }
  async approve(id: number, approved: boolean) {
    return await this.item.update({ approved }, { where: { id } });
  }
}
