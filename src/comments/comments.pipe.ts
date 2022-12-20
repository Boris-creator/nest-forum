import {
    PipeTransform,
    Injectable,
    BadRequestException,
  } from "@nestjs/common";
  import { schema } from "../validationSchema";
  
  @Injectable()
  export class ValidationPipe implements PipeTransform {
    transform(value: any) {
      
      const check = schema.comment.safeParse(value);
      if (!check.success) {
        throw new BadRequestException({ code: 1 }, "Wrong format");
      }
      return check.data;
    }
  }
  