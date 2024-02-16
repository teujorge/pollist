export const PAGE_SIZE = 10;

export const CATEGORIES = ["New", "Trending", "Controversial"];

export type Category = (typeof CATEGORIES)[number];

export type PollQuery = {
  search?: string;
  category?: Category;
  authorId?: string;
  voterId?: string;
};
