import { Injectable, Inject } from "@nestjs/common";
import { ItemRaiting } from "./raiting.entity";
import { Item } from "../items/item.entity";
@Injectable()
export class RaitingService {
  constructor(
    @Inject("ITEM_REPOSITORY") private item: typeof Item,
    @Inject("RAITING_REPOSITORY") private raiting: typeof ItemRaiting,
  ) {}
  async estimate(
    userId: number,
    itemId: number,
    value: number,
  ): Promise<{ raiting: number } | null> {
    try {
      await this.raiting.upsert({
        value,
        itemId,
        userId,
      });
    } catch (e) {
      console.error(e);
      return null;
    }

    return { raiting: await this.updateRaiting(itemId) };
  }
  async updateRaiting(itemId: number) {
    const stars = await this.raiting.findAll({
      where: { itemId },
    });
    const median =
      stars.reduce((acc, { value }) => acc + value, 0) / stars.length;
    await this.item.update({ raiting: median }, { where: { id: itemId } });
    return median;
  }
  async getGrade(userId: number, itemId: number) {
    return await this.raiting.findOne({
      where: {
        userId,
        itemId,
      },
    });
  }
}
