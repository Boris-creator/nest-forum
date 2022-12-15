import { Component, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { z as d } from "zod";
@Component({
  selector: "login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"],
})
@Injectable()
export class LoginFormComponent {
  constructor(private router: Router) {}
  private email_!: string;
  private password_!: string;
  errors: { email: Error | null; password: Error | null } = {
    email: new Error(),
    password: new Error(),
  };
  get email() {
    return this.email_;
  }
  set email(value: string) {
    const check = d.string().email().safeParse(value);
    if (!check.success) {
      this.errors.email = new Error(
        check.error.errors.map(({ message }) => message).join(";"),
      );
    } else {
      this.errors.email = null;
      this.email_ = check.data;
    }
  }
  async submitForm() {
    const response = await fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ email: this.email_ }),
    });
    if (response.ok) {
      const { access_token } = await response.json();
      localStorage.setItem("access_token", access_token);
    } else {
      this.router.navigate(["/signup"]);
    }
    const r = await fetch("/hello", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "access_token " + localStorage["access_token"],
      },
    });
  }
}
