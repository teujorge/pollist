"use server";

import { db } from "@/database/prisma";
import { auth } from "@clerk/nextjs";
import { PAGE_SIZE } from "@/constants";

export type Comment = NonNullable<
  Awaited<ReturnType<typeof getInfiniteComments>>[number]
>;

export type GetPaginatedCommentsParams = {
  cursor: string | undefined;
  pollId: string;
  parentId: string | undefined;
};

export async function getInfiniteComments({
  cursor,
  pollId,
  parentId,
}: GetPaginatedCommentsParams) {
  const { userId } = auth();

  const comments = await db.comment.findMany({
    where: {
      pollId: pollId,
      parentId: parentId ?? null,
    },
    orderBy: [
      {
        likes: {
          _count: "desc",
        },
      },
      {
        createdAt: "desc",
      },
    ],
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : undefined,
    take: PAGE_SIZE,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          imageUrl: true,
          tier: true,
        },
      },
      parent: {
        select: {
          authorId: true,
          author: { select: { username: true } },
        },
      },
      likes: {
        where: {
          authorId: userId ?? undefined,
        },
      },
      _count: {
        select: { likes: true, replies: true },
      },
    },
  });

  return comments;
}
