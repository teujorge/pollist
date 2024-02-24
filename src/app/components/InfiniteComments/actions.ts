"use server";

import { db } from "@/database/db";
import { PAGE_SIZE } from "@/constants";
import { auth } from "@clerk/nextjs";

export type Comment = NonNullable<
  Awaited<ReturnType<typeof getPaginatedComments>>[number]
>;

export type GetPaginatedCommentsParams = {
  page: number;
  pollId: string;
  parentId: string | undefined;
};

export async function getPaginatedComments({
  page,
  pollId,
  parentId,
}: GetPaginatedCommentsParams) {
  const { userId } = auth();

  const polls = await db.comment.findMany({
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
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      author: true,
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

  return polls;
}
