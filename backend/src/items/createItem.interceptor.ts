import {
  Injectable,
  //interceptor
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  //dec
  createParamDecorator,
  //pipe
  PipeTransform,
  BadRequestException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { schema } from "../validationSchema";
import { permissions } from "../roles/permissions.constants";
//interceptor
@Injectable()
export class ItemTransform implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest(),
      { user } = request;
    request.body.userId = user.id;
    request.body.approved = user.permissions.includes("create_item");
    return next.handle();
  }
}
//decorator
export const ReqAsBody = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest(),
      { user } = request;
    request.body.userId = user.id;
    console.log(user);
    request.body.approved = user.permissions.includes(permissions.add_items);
    return request;
  },
);
//pipe
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any) {
    const check = schema.item.safeParse(value.body);
    if (check.success == false) {
      throw new BadRequestException(
        { code: 1, error: check.error.message },
        "Wrong format",
      );
    }
    Object.assign(value.body, check.data);
    return value;
  }
}
