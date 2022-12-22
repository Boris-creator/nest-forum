import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { Role } from "./roles.entity";
import { UserRole } from "./userRoles.entity";
import { permissions } from "./permissions.constants";

type role = {
  title: string;
  permissions: {
    delete_comments?: boolean;
    add_items?: boolean;
    update_roles?: boolean;
  };
};
type permission = keyof typeof permissions; //keyof role["permissions"];
@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @Inject("ROLE_REPOSITORY") private role: typeof Role,
    @Inject("USER_ROLE_REPOSITORY") private userRole: typeof UserRole,
  ) {}
  basicRoles: role[] = [
    {
      title: "Moderator",
      //permissions: ["delete_comments", "add_items"],
      permissions: { delete_comments: true, add_items: true },
    },
    {
      title: "Admin",
      //permissions: ["delete_comments", "add_items", "update_roles"],
      permissions: {
        delete_comments: true,
        add_items: true,
        update_roles: true,
      },
    },
  ];
  getPermissions(roles: { [key: string]: boolean | string }[]) {
    const perms: permission[] = roles.reduce((acc, r) => {
      for (const key in permissions) {
        const named = permissions[key];
        if (r[named] === true) {
          acc.push(named);
        }
      }
      return acc;
    }, []);
    return perms;
  }
  async init() {
    try {
      return await Promise.all(
        this.basicRoles.map((r) =>
          this.role.create({ title: r.title, ...r.permissions }),
        ),
      );
    } catch (err) {}
  }
  onModuleInit() {
    this.init();
  }
}
