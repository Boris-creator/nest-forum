import {
  Controller,
  Post,
  Body,
  Req,
  UseInterceptors,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ItemsService, newItem, item } from "./items.service";
import { schema } from "../validationSchema";
import { ValidationPipe } from "../pipeFactory";
import {
  ItemTransform,
  ValidationPipe as Pipe,
  ReqAsBody,
} from "./createItem.interceptor";
import { JwtGuard } from "../auth/auth.guard";
import { Guard as FilterGuard, Filtered } from "./items.guard";
import { queryOptions as options, itemsInfo } from "../types";
import { RoleGuard } from "src/roles/roles.guard";
import { permissions } from "src/roles/permissions.constants";

@Controller("items")
export class ItemsController {
  constructor(private readonly appService: ItemsService) {}

  @Post("")
  @UseGuards(
    JwtGuard,
    //FilterGuard
  )
  async getSome(@Filtered() data: options): Promise<itemsInfo<item>> {
    if (!schema.itemsPage.safeParse(data).success) {
      //I should do it in a pipe
      Object.assign(data, {
        limit: 1,
        offset: 0,
      });
    }
    return await this.appService.findSome(data);
  }
  @Post("item")
  async getById(@Body() data: { id: number }): Promise<item> {
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
}
