"use server";

import { db } from "@/database/prisma";
import { auth } from "@clerk/nextjs";
import { PAGE_SIZE } from "@/constants";
import { commentSelect } from "./commentSelect";
import { handlePrismaError } from "@/database/error";

export type Comment = NonNullable<
  Awaited<ReturnType<typeof getInfiniteComments>>[number]
>;

export type GetPaginatedCommentsParams = {
  cursor: string | undefined;
  pollId: string;
  parentId: string | undefined;
  dateOrderBy: "asc" | "desc";
  orderByLikes?: boolean;
};

export async function getInfiniteComments({
  cursor,
  pollId,
  parentId,
  dateOrderBy,
  orderByLikes,
}: GetPaginatedCommentsParams) {
  try {
    const { userId } = auth();

    const comments = await db.comment.findMany({
      where: {
        pollId: pollId,
        parentId: parentId ?? null,
      },
      orderBy: [
        orderByLikes
          ? {
              likes: {
                _count: "desc",
              },
            }
          : {},
        {
          createdAt: dateOrderBy,
        },
      ],
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
      take: PAGE_SIZE,
      select: commentSelect(userId ?? undefined),
    });

    return comments;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}
