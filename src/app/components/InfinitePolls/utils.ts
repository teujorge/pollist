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
