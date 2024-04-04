export const PAGE_SIZE = 10;

export const CATEGORIES = ["New", "Trending", "Controversial"];

export type Category = (typeof CATEGORIES)[number];

export type PollQuery = {
  search?: string;
  category?: Category;
  authorId?: string;
  voterId?: string;
  private?: boolean | "both";
  anonymous?: boolean | "both";
};

// Max file size 5mb
export const maxFileSize = 5 * 1024 * 1024;
// File type MIME patterns for validation
export const allowedImagePatterns = [
  /^data:image\/jpeg;base64,/,
  /^data:image\/jpg;base64,/,
  /^data:image\/png;base64,/,
  /^data:image\/webp;base64,/,
  /^data:image\/gif;base64,/,
];
