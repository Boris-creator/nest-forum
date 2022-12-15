import { Injectable, Inject } from "@nestjs/common";
import { ItemRaiting } from "./raiting.entity";
import { Item } from "../items/item.entity";
@Injectable()
export class RaitingService {
  constructor(
    @Inject("ITEM_REPOSITORY") private item: typeof Item,
    @Inject("RAITING_REPOSITORY") private raiting: typeof ItemRaiting,
  ) {}
  /*
  async findByEmail(login: string): Promise<item | null> {
    return await this.user.findOne({ where: { login } });
  }
  */
  async estimate(
    userId: number,
    itemId: number,
    value: number,
  ): Promise<boolean> {
    try {
      await this.raiting.upsert({
        value,
        itemId,
        userId,
      });
    } catch (e) {
      return false;
    }
    return true;
  }
}
