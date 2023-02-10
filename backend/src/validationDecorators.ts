import "reflect-metadata";
import { schema } from "./validationSchema";
import { z as d } from "zod";

type handler = {
  success: Function;
  error: Function;
  getValue: (target: any) => any;
};
function decoratorFactory(schema: d.Schema) {
  const createDecorator = (handler: handler) => {
    function prop(target: any, field: string) {
      Reflect.defineProperty(target, field, {
        set(v) {
          const check = schema.safeParse(v);
          if (check.success) {
            handler.success(target, check.data);
          } else {
            handler.error(target, check);
          }
        },
        get: () => handler.getValue(target),
      });
    }
    return prop;
  };
  return createDecorator;
}
export const email = decoratorFactory(schema.email);
