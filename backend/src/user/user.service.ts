import { Injectable, Inject } from "@nestjs/common";
import { User } from "./user.entity";
import { Unverified } from "./unverifiedUser.entity";
import { Role } from "../roles/roles.entity";
import * as sequelize from "sequelize";
export type user = {
  email: string;
  password: string;
  login: string;
  id?: number;
  roles?: { title: string }[];
};
type unverified = user & { hash: string; expire: number };
@Injectable()
export class UserService {
  constructor(
    @Inject("USER_REPOSITORY") private user: typeof User,
    @Inject("UNVERIFIED_REPOSITORY") private unverified: typeof Unverified,
  ) {}
  async findByEmail(email: string): Promise<user | null> {
    return await this.user.findOne({
      where: { email },
      include: {
        model: Role,
      },
    });
  }
  async findByLogin(login: string): Promise<user | null> {
    return await this.user.findOne({
      where: {
        login: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("login")),
          "LIKE",
          `%${login.toLowerCase()}%`,
        ),
      },
    });
  }
  async createUser(data: user) {
    return await this.user.create(data);
  }
  async createBid(data: unverified) {
    return await this.unverified.upsert(data);
  }
  async destroyBid(data) {
    return await this.unverified.destroy({ where: data });
  }
  async findBid(data) {
    return await this.unverified.findOne({ where: data });
  }
}
