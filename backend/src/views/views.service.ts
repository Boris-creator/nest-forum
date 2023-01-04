import { Injectable, Inject } from "@nestjs/common";
import { ItemView } from "./itemView.entity";
@Injectable()
export class ViewsService {
  constructor(@Inject("ITEM_VIEW_REPOSITORY") private stats: typeof ItemView) {}
  async addView(itemId: number, userId: number) {
    return await this.stats.upsert({ itemId, userId });
  }
}
