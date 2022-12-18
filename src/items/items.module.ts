import {
  Injectable,
  Inject,
  Module,
  Controller,
  Post,
  Body,
} from "@nestjs/common";
import { itemProviders } from "./item.providers";
import { Item } from "./item.entity";
import { schema } from "../validationSchema";
import {
  queryOptions as options,
  itemsInfo as info,
  itemsInfo,
} from "../types";
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
  async findSome(options: options) {
    const [count, items] = await Promise.all([
      this.item.count(),
      this.item.findAll(options),
    ]);
    const response: info<item> = { count, items };
    return response;
  }
  async getById(id: number) {
    return await this.item.findByPk(id);
  }
}
@Controller()
class ItemsController {
  constructor(private readonly appService: ItemsService) {}

  @Post("items")
  async getSome(@Body() data: options): Promise<itemsInfo<item>> {
    if (!schema.itemsPage.safeParse(data).success) {
      //I should do it in a pipe
      data = {
        limit: 1,
        offset: 0,
      };
    }
    return await this.appService.findSome(data);
  }
  @Post("item")
  async getById(@Body() data: { id: number }): Promise<item> {
    return await this.appService.getById(data.id);
  }
}

@Module({
  imports: [],
  controllers: [ItemsController],
  providers: [ItemsService, ...itemProviders],
})
export class ItemsModule {}
