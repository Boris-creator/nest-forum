import { Injectable, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
type request = {
  headers: Record<string, string | string[]>;
  cookies: any;
};
@Injectable()
export class Helper {
  constructor(private jwtService: JwtService) {}

  transform(context: ExecutionContext) {
    const request = this.getRequest<
      request & { user?: Record<string, unknown> }
    >(context);
    const token = this.getToken(request);
    const user = this.jwtService.verify(token);
    request.user = user;
    return context;
  }
  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }

  protected getToken(request: request): string {
    const authorization = request.headers["authorization"];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error("Invalid Authorization Header");
    }
    const [_, token] = authorization.split(" ");
    return token;
  }
}
