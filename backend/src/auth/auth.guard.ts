import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Helper } from "./auth.helper"

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private transformer: Helper){}
  canActivate(context: ExecutionContext): boolean {
    try {
      this.transformer.transform(context);
      return true;
    } catch (e) {
      return false;
    }
  }
}
