import { Role } from "./roles.entity";
import { UserRole } from "./userRoles.entity";
export const roleProviders = [
  {
    provide: "ROLE_REPOSITORY",
    useValue: Role,
  },
  {
    provide: "USER_ROLE_REPOSITORY",
    useValue: UserRole,
  },
];
