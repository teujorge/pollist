import type { PollsDetails } from "./actions";

export function pollInclude(userId: string | null) {
  return {
    author: { select: { username: true, imageUrl: true } },
    votes: true,
    options: true,
    likes: userId
      ? {
          where: {
            authorId: userId,
          },
        }
      : false,
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  };
}

export function censorPollAuthor(
  poll: PollsDetails[number],
  userId: string | null,
) {
  if (!poll.anonymous) return;
  if (poll.authorId === userId) return;

  poll.authorId = "Anonymous";
  poll.author.imageUrl = "Anonymous";
  poll.author.username = "Anonymous";
}
