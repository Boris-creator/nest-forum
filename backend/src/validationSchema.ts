import { z as d } from "zod";
const trim = (v: unknown) => (typeof v == "string" ? v.trim() : v);
const capitalize = (v: string) => v[0].toUpperCase() + v.slice(1);
const password = d
    .string()
    .regex(/^\S*$/, "Password must not contain empty spaces")
    .min(6, "Password must contain at least 6 characters")
    .max(100, "Your password is too long"),
  password_2 = d
    .object({
      password_1: d.string(),
      //password_2: d.optional(d.string()), //if we want to
      password_2: d.string({ required_error: "Repeat the password" }),
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
  login = d.preprocess(
    trim,
    d.string().min(3, "Your login cannot be less than 3 characters").max(30),
  );
const itemTitle = d
    .preprocess(
      trim,
      d.string().min(3, "Title must contain at least 3 characters."),
    )
    .transform(capitalize),
  itemText = d.preprocess(
    trim,
    d.string().min(3, "Text must contain at least 3 characters.").max(3000),
  );
const commentContent = d.string().min(3);
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
  editComment: d.object({
    content: commentContent,
    id: d.number().min(1),
  }),
  comment: d.object({
    content: commentContent,
    itemId: d.number().min(1),
    commentId: d.any(),
  }),
  commentContent,
  itemTitle,
  itemText,
  item: d.object({
    title: itemTitle,
    body: d.object({
      text: itemText,
    }),
  }),
};
