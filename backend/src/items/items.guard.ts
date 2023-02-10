import {
  Injectable,
  CanActivate,
  ExecutionContext,
  createParamDecorator,
  NotFoundException,
} from "@nestjs/common";
import { Helper as Transformer } from "../auth/auth.helper";
import { permissions } from "../roles/permissions.constants";
import { ItemsService } from "./items.service";
import { RoleGuard } from "../roles/roles.guard";
@Injectable()
export class EditGuard extends RoleGuard implements CanActivate {
  constructor(private service: ItemsService) {
    super([permissions.add_items]);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (super.canActivate(context)) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const item = await this.service.findOne(req.body.id);
    if (!item || req.user.id != item.userId || item.approved) {
      return false;
    }
    return true;
  }
}
//guard. I'm not using it now
@Injectable()
export class Guard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const check = request.user.permissions.includes(permissions.add_items);
    if (!check && !request.body.filter.approved) {
      return false;
    }
    return true;
  }
}
//decorator. I use it.
export const Filtered = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest(),
      { user } = request;

    if (!user) {
      request.body.filter.approved = true;
      return request.body;
    }
    const check = user.permissions.includes(permissions.add_items);
    request.body.userId = user.id;
    if (!check) {
      request.body.filter.approved = true;
    }
    return request.body;
  },
);
//guard for a single item
//Guards are executed after all middleware, but before any interceptor
@Injectable()
export class GuardOne implements CanActivate {
  constructor(private transformer: Transformer, private items: ItemsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      this.transformer.transform(context);
    } catch (e) {}
    const request = context.switchToHttp().getRequest();
    const {
      user,
      params: { id },
    } = request;
    const check = user
      ? user.permissions.includes(permissions.add_items)
      : false;
    const item = await this.items.findOne(id);
    if (!item) {
      throw new NotFoundException();
    }
    if (!check && !item.approved) {
      return false;
    }
    return true;
  }
}
