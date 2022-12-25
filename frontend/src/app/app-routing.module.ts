import { NgModule, Injectable } from "@angular/core";
import {
  RouterModule,
  Router,
  Routes,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { LoginFormComponent } from "./login-form/login-form.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { ItemsComponent } from "./items/items.component";
import { ItemComponent } from "./item/item.component";
import { ProfileComponent } from "./profile/profile.component";

class Permissions {
  canActivate(): boolean {
    return !!localStorage.getItem("access_token");
  }
}

@Injectable({
  providedIn: "root",
})
class CanActivateRoute implements CanActivate {
  constructor(private permissions: Permissions, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const mainPage = ["items"];
    const loggedIn = this.permissions.canActivate(),
      path = route.url[0].path;
    switch (path) {
      case "login":
        if (loggedIn) {
          this.router.navigate(mainPage);
        }
        return !loggedIn;
      case "signup":
        if (loggedIn) {
          this.router.navigate(mainPage);
        }
        return !loggedIn;
      case "profile":
        if (!loggedIn) {
          this.router.navigate(mainPage);
        }
        return loggedIn;
      default:
        return true;
    }
  }
}
const routes: Routes = [
  {
    path: "login",
    component: LoginFormComponent,
    canActivate: [CanActivateRoute],
  },
  { path: "signup", component: SignUpComponent },
  { path: "items/:page", component: ItemsComponent },
  { path: "items", component: ItemsComponent },
  { path: "item/:id", component: ItemComponent },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [CanActivateRoute],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [Permissions],
})
export class AppRoutingModule {}
