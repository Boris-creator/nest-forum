import {
  Controller,
  Post,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ItemsService, newItem } from "./items.service";
import { schema } from "../validationSchema";
import { ValidationPipe } from "../pipeFactory";
import {
  ItemTransform,
  ValidationPipe as Pipe,
  ReqAsBody,
} from "./createItem.interceptor";
import { JwtGuard } from "../auth/auth.guard";
import {
  Guard as FilterGuard,
  Filtered,
  EditGuard,
  GuardOne,
} from "./items.guard";
import { User } from "../auth/auth.decorator";
import { AuthInterceptor } from "../auth/auth.interceptor";
import { queryOptions as options, itemsInfo, item } from "../types";
import { RoleGuard } from "src/roles/roles.guard";
import { permissions } from "src/roles/permissions.constants";
import { ViewsService } from "../views/views.service";

@Controller("items")
export class ItemsController {
  constructor(
    private readonly appService: ItemsService,
    private stats: ViewsService,
  ) {}

  @Post("")
  @UseInterceptors(AuthInterceptor)
  async getSome(
    @Filtered() @User(["id", "permissions"]) data: options,
  ): Promise<itemsInfo<item>> {
    if (!schema.itemsPage.safeParse(data).success) {
      //I should do it in a pipe
      Object.assign(data, {
        limit: 1,
        offset: 0,
      });
    }
    return await this.appService.findSome(data);
  }
  @Post("item/:id")
  @UseInterceptors(AuthInterceptor)
  @UseGuards(GuardOne)
  async getById(
    @Param() data: { id: number },
    @User(["id"]) user: { id?: number },
  ): Promise<item> {
    if (user.id) {
      await this.stats.addView(data.id, user.id);
    }
    return await this.appService.getById(data.id);
  }
  @UseGuards(JwtGuard)
  @UsePipes(Pipe) // 3. pipe for req and custom decorator
  //@UsePipes(new ValidationPipe(schema.item)) // 1. pipe for req.body
  //Pipes only work for @Body(), @Param(), @Query() and custom decorators. Interceptors do not modify request.body when using with @Body decorator!
  //So I must create a custom decorator or I cannot use pipes with interceptor. But does the interceptor work with custom dec?
  //@UseInterceptors(ItemTransform) // 2. interceptor
  @Post("create")
  //async createItem(@Body(new ValidationPipe(schema.item)) data: newItem) {
  //async createItem(@Req() data: { body: newItem }) { 2. interceptor
  async createItem(@ReqAsBody() data: { body: newItem }) {
    // 3. pipe for req and custom decorator

    return await this.appService.create(data.body);
  }
  @UseGuards(JwtGuard, new RoleGuard([permissions.add_items]))
  @Post("approve")
  async approveItem(@Body() data: { id: number; approve: boolean }) {
    return await this.appService.approve(data.id, data.approve);
  }
  @Post("edit")
  @UseGuards(EditGuard)
  async edit(data: { id: number; title: string; body: { text: string } }) {
    return this.appService.edit(data);
  }
}
