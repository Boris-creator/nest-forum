import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { permissions } from "../roles/permissions.constants";
import { CommentsService } from "./comments.service";
import { ItemsService } from "../items/items.service";
import { RoleGuard } from "../roles/roles.guard";
import { editCommentMaxTime as maxAge } from "../constants";
@Injectable()
export class EditGuard extends RoleGuard implements CanActivate {
  constructor(private service: CommentsService) {
    super([permissions.delete_comments]);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (super.canActivate(context)) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const comment = await this.service.findOne(req.body.id);
    if (!comment || req.user.id != comment.userId) {
      return false;
    }
    if (Date.now() - comment.createdAt > maxAge) {
      return false;
    }
    return true;
  }
}
@Injectable()
export class AddGuard implements CanActivate {
  constructor(private service: ItemsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const item = await this.service.findOne(req.body.itemId);
    if (!item) {
      return false;
    }
    if (!item.approved) {
      return false; //no sense to comment items which were not approved
    }
    return true;
  }
}
