export const PAGE_SIZE = 1;

export const CATEGORIES = ["New", "Trending", "Controversial"];

export type Category = (typeof CATEGORIES)[number];

export type PollQuery = {
  search?: string;
  category?: Category;
  authorId?: string;
  voterId?: string;
};
