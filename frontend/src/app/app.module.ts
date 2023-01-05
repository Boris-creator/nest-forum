import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { HttpHelper } from "./http.service";
import { Helper as PermissionHelper } from "./permissions.service";

import { AppComponent } from "./app.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { ItemsComponent } from "./items/items.component";
import { ItemComponent } from "./item/item.component";
import { CommentsComponent } from "./comments/comments.component";
import { ThreadComponent } from "./thread/thread.component";
import { ItemRedactorComponent } from "./item-redactor/item-redactor.component";
import { AdminPanelComponent } from "./admin-panel/admin-panel.component";
import { PaginationComponent } from './pagination/pagination.component';
import { ProfileComponent } from './profile/profile.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RaitingComponent } from './raiting/raiting.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    SignUpComponent,
    ItemsComponent,
    ItemComponent,
    CommentsComponent,
    ThreadComponent,
    ItemRedactorComponent,
    AdminPanelComponent,
    PaginationComponent,
    ProfileComponent,
    MainPageComponent,
    NotFoundComponent,
    RaitingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [HttpHelper, PermissionHelper],
  bootstrap: [AppComponent],
})
export class AppModule {}
