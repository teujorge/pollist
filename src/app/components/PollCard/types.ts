import type { Poll, User, Vote, Option } from "@prisma/client";

export type PollDetails = Poll & {
  author: User;
  options: Option[];
  votes: Vote[];
};
