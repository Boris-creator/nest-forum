import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { HttpHelper } from "./http.service";

import { AppComponent } from "./app.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { ItemsComponent } from "./items/items.component";
import { ItemComponent } from "./item/item.component";
import { CommentsComponent } from "./comments/comments.component";
import { ThreadComponent } from "./thread/thread.component";
@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    SignUpComponent,
    ItemsComponent,
    ItemComponent,
    CommentsComponent,
    ThreadComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [HttpHelper],
  bootstrap: [AppComponent],
})
export class AppModule {}
