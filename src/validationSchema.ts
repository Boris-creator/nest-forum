import { z as d } from "zod";
const trim = (v: unknown) => (typeof v == "string" ? v.trim() : v);
const password = d
    .string()
    .regex(/^\S+$/, "Password must contain only")
    .min(6, "p")
    .max(100),
  password_2 = d
    .object({
      password_1: d.string(),
      //password_2: d.optional(d.string()), //if we want to
      password_2: d.string(),
    })
    .superRefine(({ password_1, password_2 }, ctx) => {
      if (typeof password_2 == "undefined") {
        //return true;
      }
      password_1 = password_1.trim();
      password_2 = password_2.trim();
      if (password_1 != password_2) {
        ctx.addIssue({
          code: d.ZodIssueCode.custom,
          message: "Passwords do not match!",
        });
        return false;
      }
      return true;
    }),
  email = d.preprocess(trim, d.string().email("This is not an email")),
  login = d.preprocess(trim, d.string().min(3, "your login cannot").max(30));
export const schema = {
  password,
  password_2,
  email,
  login,
  userData: d.object({
    email,
    login,
    password,
  }),
  loginData: d.object({
    email,
    password,
  }),
  itemsPage: d.object({
    offset: d.number().min(0),
    limit: d.number().min(1),
  }),
};
