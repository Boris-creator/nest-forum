import { Injectable } from "@angular/core";
import jwt_decode from "jwt-decode";
import { userData } from "@common/types";
import { permissions } from "@common/roles/permissions.constants";
type user = { permissions: string[] };
@Injectable()
export class Helper {
  permissions: string[] = [];
  canAddItems() {
    return this.permissions?.includes(permissions.add_items);
  }
  canDeleteComments() {
    return this.permissions.includes(permissions.delete_comments);
  }
  decode(): this {
    const jwt = localStorage["access_token"];
    if (typeof jwt != "string") {
      return this;
    }
    const user: user = jwt_decode(jwt);
    this.permissions = user.permissions;
    return this;
  }
}
