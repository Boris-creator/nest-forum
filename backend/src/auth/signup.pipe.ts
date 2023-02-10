import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { schema } from "../validationSchema";
import { UserService, user } from "../user/user.service";

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private userService: UserService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const check = schema.userData.safeParse(value);
    if (!check.success) {
      throw new BadRequestException({ code: 1 }, "Wrong format");
    }
    value = check.data;
    const emailExists = await this.userService.findByEmail(value.email);
    if (emailExists) {
      throw new BadRequestException({
        code: 2,
        msg: "Account with this email already exists",
      });
    }
    const loginExists = await this.userService.findByLogin(value.login);
    if (loginExists) {
      throw new BadRequestException({
        code: 3,
        msg: "Account with this login already exists",
      });
    }
    return value;
  }
}
