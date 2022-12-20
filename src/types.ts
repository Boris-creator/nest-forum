export type queryOptions = {
  limit: number;
  offset: number;
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
  createdAt: Date
};
