import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const res: { [key: string]: any } = {};
    for (let key of data) {
      res[key] = user?.[key];
    }
    return data.length ? res : user;
  },
);
