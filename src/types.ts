export type queryOptions = {
  limit: number;
  offset: number;
};
export type itemsInfo<item> = {
  count: number;
  items: item[];
};
