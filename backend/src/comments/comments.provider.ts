import { Comment } from "./comments.entity";

export const commentProviders = [
  {
    provide: "COMMENT_REPOSITORY",
    useValue: Comment,
  },
];
