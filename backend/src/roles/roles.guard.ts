import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { permissions } from "./permissions.constants";
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(requiredPermissions: string[]) {
    this.requiredPermissions = requiredPermissions;
  }
  requiredPermissions: string[];
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;
    if (this.requiredPermissions.every((p) => user.permissions.includes(p))) {
      return true;
    }
    return false;
  }
}
