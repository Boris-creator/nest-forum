import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginFormComponent } from "./login-form/login-form.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { ItemsComponent } from "./items/items.component";
import { ItemComponent } from "./item/item.component";

const routes: Routes = [
  { path: "signin", component: LoginFormComponent },
  { path: "signup", component: SignUpComponent },
  { path: "items", component: ItemsComponent },
  { path: "item/:id", component: ItemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
