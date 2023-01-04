import { Component, Injectable, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { schema } from '@common/validationSchema';

import { z as d } from 'zod';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
@Injectable()
export class LoginFormComponent {
  constructor(private router: Router) {}
  @ViewChild('email_') emailInput!: ElementRef;
  private email_!: string;
  private password_!: string;
  private prefix = true ? 'api' : '';
  errors: { email: Error | null; password: Error | null } = {
    email: new Error(),
    password: new Error(),
  };

  /*
  @email({
    success: (ob: any, value: string) => {
      ob.email_ = value;
      ob.errors.email = null;
    },
    error: (ob: any, check: d.SafeParseError<any>) => {
      ob.errors.email = new Error(ob.displayErrors(check));
    },
    getValue: (ob: any) => ob.email_,
  })
  email!: string;
  */

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
    this.errors.password = check.success
      ? null
      : new Error(this.displayErrors(check));
    this.password_ = value;
  }
  async submitForm() {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ email: this.email_, password: this.password_ }),
    });
    if (response.ok) {
      const { access_token } = await response.json();
      localStorage.setItem('access_token', access_token);
      this.router.navigate(['/items']);
    } else {
      console.log('Wrong...');
    }
  }
  displayErrors(check: d.SafeParseError<any>) {
    if (!check.error) {
      return;
    }
    return check.error.errors.map(({ message }) => message).join('; ');
  }
  ngAfterViewInit() {
    //thou I could use 'autofocus' attribute.
    this.emailInput.nativeElement.focus();
  }
}
