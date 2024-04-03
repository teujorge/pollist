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
    comments: {
      select: {
        _count: {
          select: { replies: true },
        },
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  };
}
