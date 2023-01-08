export type queryOptions = {
  limit: number;
  offset: number;
  filter: {
    [key: string]: any;
  };
};
export type item = {
  id?: number;
  title: string;
  body: object;
  userId?: number;
  approved?: boolean;
};
export type itemsInfo<item> = {
  count: number;
  items: item[];
};
export type comment = {
  id: number;
  itemId: number; //subject
  userId: number; //author
  author: {
    login: string;
    id?: number;
  };
  files: string[];
  content: string;
  commentId: number | null; //answerTo
  createdAt: Date;
};
//comment from client
export type newComment = {
  content: string;
  itemId: number;
  commentId: number | null;
};
export type editComment = {
  content: string;
  id: number;
};
//user info in token
export type userData = {
  id: number;
  username: string;
  roles: string[];
  permissions: string[];
};
export type userGrade = {
  raiting: number;
};
