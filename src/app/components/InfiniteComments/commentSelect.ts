export const commentSelect = (userId: string | undefined) => {
  return {
    id: true,
    pollId: true,
    parentId: true,
    text: true,
    at: true,
    createdAt: true,
    updatedAt: true,
    sensitive: true,
    deleted: true,
    author: { select: { id: true, username: true, imageUrl: true } },
    parent: {
      select: {
        authorId: true,
        author: { select: { username: true } },
      },
    },
    poll: {
      select: {
        authorId: true,
      },
    },
    likes: {
      where: { authorId: userId ?? undefined },
    },
    _count: {
      select: {
        likes: true,
        replies: { where: { deleted: false } },
      },
    },
  };
};
