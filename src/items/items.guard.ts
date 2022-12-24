import { Injectable, CanActivate, ExecutionContext,   createParamDecorator,
} from "@nestjs/common";
import { permissions } from "../roles/permissions.constants";
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
        const check = user.permissions.includes(permissions.add_items);

      request.body.userId = user.id;
      console.log(user);
      if(!check) {
        request.body.filter.approved = true;
      }
      return request.body;
    },
  );