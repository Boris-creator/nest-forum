export type queryOptions = {
  limit: number;
  offset: number;
  filter: {
    [key: string] : any
  }
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
  };
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
//user info in token
export type userData = {
  id: number;
  username: string;
  roles: string[];
  permissions: string[]
}
