import { Component, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { schema } from "@common/validationSchema";
import { z as d } from "zod";
@Component({
  selector: "login-form",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
@Injectable()
export class SignUpComponent {
  constructor(private router: Router) {}
  private email_!: string;
  private password_!: string;
  private password_2_!: string;
  private login_!: string;
  step: 0 | 1 | 2 = 0;
  get stepWrong() {
    const { email, password, password_2, login } = this.errors;
    return !![email, password || password_2, login][this.step];
  }
  get steps() {
    return [
      { complete: !this.errors.email },
      { complete: !this.errors.password && !this.errors.password_2 },
      { complete: !this.errors.login },
    ];
  }
  error_messages = {};
  success: boolean = false;
  errors: {
    email: Error | null;
    password: Error | null;
    password_2: Error | null;
    login: Error | null;
    exists: Error | null;
  } = {
    email: new Error(),
    password: new Error(),
    password_2: new Error(),
    login: new Error(),
    exists: null,
  };
  get email() {
    return this.email_;
  }
  set email(value: string) {
    const check = schema.email.safeParse(value);
    this.errors.email = check.success
      ? null
      : new Error(this.displayErrors(check));
    if (check.success) {
      this.email_ = check.data;
    }
  }
  get password() {
    return this.password_;
  }
  set password(value: string) {
    const check = schema.password.safeParse(value);
    this.comparePasswords(value.trim(), this.password_2_);

    this.errors.password = check.success
      ? null
      : new Error(this.displayErrors(check));
    this.password_ = value;
  }
  get password_2() {
    return this.password_2_;
  }
  set password_2(value: string) {
    this.comparePasswords(this.password_, value);
    this.password_2_ = value;
  }
  get login() {
    return this.login_;
  }
  set login(value: string) {
    const check = schema.login.safeParse(value);
    this.errors.login = check.success
      ? null
      : new Error(this.displayErrors(check));
    if (check.success) {
      this.login_ = check.data;
    }
  }
  comparePasswords(p1?: string, p2?: string) {
    const check = schema.password_2.safeParse({
      password_1: p1,
      password_2: p2,
    });
    this.errors.password_2 = check.success
      ? null
      : new Error(this.displayErrors(check));
  }
  displayErrors(check: d.SafeParseError<any>) {
    if (!check.error) {
      return;
    }
    return check.error.errors.map(({ message }) => message).join("; ");
  }
  async submitForm() {
    //demonstrates the native fetch at work. To do: use http.
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        login: this.login_,
        password: this.password_,
        email: this.email_,
      }),
    });
    if (response.ok) {
      this.errors.exists = null;
      this.success = true;
      //this.router.navigate(["/signin"])
      return;
    }
    const { msg } = await response.json();
    this.errors.exists = new Error(msg);
    this.success = false;
  }
  nextStep() {
    if (!this.stepWrong) {
      this.step++;
    }
  }
  previousStep() {
    this.step--;
  }
}
