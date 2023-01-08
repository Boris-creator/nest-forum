//however, not a factory in realisation
import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { z as d } from "zod";
@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(s: d.Schema) {
    this.schema = s;
  }
  schema: d.Schema;
  transform(value: any) {
    const check = this.schema.safeParse(value);
    if (check.success == false) {
      throw new BadRequestException(
        { code: 1, error: check.error.message },
        "Wrong format",
      );
    }
    return check.data;
  }
}
@Injectable()
export class MultiValidationPipe implements PipeTransform {
  constructor(fields: { key: string; schema: d.Schema }) {
    this.schema = fields.schema;
    this.field = fields.key;
  }
  schema: d.Schema;
  field: string;
  transform(value: any) {
    const v = JSON.parse(value[this.field]);
    const check = this.schema.safeParse(v);
    if (check.success == false) {
      throw new BadRequestException(
        { code: 1, error: check.error.message },
        "Wrong format",
      );
    }
    return check.data;
  }
}
