import { Injectable } from "@nestjs/common";
import { UserService, user } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { MailModule } from "../mail.module";

import * as crypto from "crypto";
import * as argon from "argon2";
type LoginData = { email: string; password: string; login: string };
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailer: MailModule,
  ) {}
  async findUser(data: LoginData): Promise<user | null> {
    const { email, password } = data;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isCorrect = await argon.verify(user.password, password);
    return isCorrect ? user : null;
  }
  async signUp({ email, password, login }: LoginData): Promise<boolean> {
    const passwordHashed = await argon.hash(password);
    await this.userService.destroyBid({ email });
    const hash = crypto.randomBytes(16).toString("base64"),
      expire = Date.now() + 6 * 60 * 60 * 1000;

    await this.userService.createBid({
      password: passwordHashed,
      email,
      login,
      expire: expire,
      hash: hash,
    });
    this.mailer.send({
      to: email,
      subject: "Завершите регистрацию!",
      htmlContent: `Приветствуем! Перейдите по ссылке, чтобы завершить регистрацию. <br> <a href = '${process.env.URL}/verify?h=${hash}'>перейти</a>`,
    });
    return true;
  }
  authorize(user: user) {
    const payload = { username: user.login, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async recoverPassword(hash, password) {
    /*
      const usr = await Recover_password.findOne({ where: { hash } });
      if (!usr) {
        return { error: 1 };
      }
      Recover_password.destroy({ where: { hash } });
      const passwordHashed = await argon2.hash(password);
      await User.update(
        { password: passwordHashed },
        { where: { mail: usr.email } }
      );
      return { error: 0 };
      */
  }
  async verifyByMail(hash: string) {
    const unverified_user = await this.userService.findBid({ hash });
    if (!unverified_user) {
      return false;
    }
    if (unverified_user.expire < Date.now()) {
      return false;
    }
    const { login, email, password } = unverified_user;
    await Promise.all([
      this.userService.createUser({
        login,
        email,
        password,
      }),
      this.userService.destroyBid({ hash }),
    ]);
    return true;
  }
}
