import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
type request = {
  headers: Record<string, string | string[]>;
  cookies: any
};
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest<
      request & { user?: Record<string, unknown> }
    >(context); 
    try {
      const token = this.getToken(request);
      const user = this.jwtService.verify(token);
      context.switchToHttp().getRequest().user = user;
      return true;
    } catch (e) {
      return false;
    }
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
