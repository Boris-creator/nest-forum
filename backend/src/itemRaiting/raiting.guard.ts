import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { z } from "zod";
import { Item } from "../items/item.entity";
import { constants } from "./raiting.constants";
const { MIN, MAX } = constants;
type req = { userId: number; itemId: number; value: number };
@Injectable()
export class RaitingGuard implements CanActivate {
  constructor(@Inject("ITEM_REPOSITORY") private item: typeof Item) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const body: req = {...request.body, userId: request.user?.id};
    let errorCode: number = 0;
    const valueSchema = z.object({
      value: z.number().min(MIN).max(MAX),
      itemId: z.number(),
      userId: z.number(),
    });
    if (!valueSchema.parse(body)) {
      errorCode = 1;
      //body.value = Math.max(MIN, Math.min(MAX, body.value || 0)); //
    } else {
      const targetItem = await this.item.findOne({
        where: { id: body.itemId },
      });
      if (!targetItem) {
        errorCode = 2;
      }
      if (targetItem.userId == body.userId) {
        errorCode = 3;
      }
    }

    if (errorCode != 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: errorCode,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    request.body.userId = body.userId
    return true;
  }
}
