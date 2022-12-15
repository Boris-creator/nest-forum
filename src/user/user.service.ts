import { Injectable, Inject } from "@nestjs/common";
import { User } from "./user.entity";
import { Unverified } from "./unverifiedUser.entity";
export type user = {
  email: string;
  password: string;
  login: string;
  id?: number;
};

@Injectable()
export class UserService {
  constructor(
    @Inject("USER_REPOSITORY") private user: typeof User,
    @Inject("UNVERIFIED_REPOSITORY") private unverified: typeof Unverified,
  ) {}
  async findByEmail(email: string): Promise<user | null> {
    return await this.user.findOne({ where: { email } });
  }
  async findByLogin(login: string): Promise<user | null> {
    return await this.user.findOne({ where: { login } });
  }
  async createUser(data: user) {
    return await this.user.create(data);
  }
  async createBid(data) {
    return await this.unverified.upsert(data);
  }
  async destroyBid(data) {
    return await this.unverified.destroy({ where: data });
  }
  async findBid(data) {
    return await this.unverified.findOne({ where: data });
  }
}
