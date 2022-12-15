import { Injectable, Inject, Module, Controller, Post } from "@nestjs/common";
import { itemProviders } from "./item.providers";
import { Item } from "./item.entity";
type item = {
  title: string;
  body: Object;
};
@Injectable()
class ItemsService {
  constructor(@Inject("ITEM_REPOSITORY") private item: typeof Item) {}
  async getAll(): Promise<item[]> {
    return await this.item.findAll();
  }
}
@Controller()
class ItemsController {
  constructor(private readonly appService: ItemsService) {}

  @Post("items")
  async getHello(): Promise<item[]> {
    return await this.appService.getAll();
  }
}

@Module({
  imports: [],
  controllers: [ItemsController],
  providers: [ItemsService, ...itemProviders],
})
export class ItemsModule {}
