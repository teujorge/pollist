"use server";

import { db } from "@/server/prisma";
import { PAGE_SIZE } from "@/constants";

export type Followees = NonNullable<
  Awaited<ReturnType<typeof getMoreFollowees>>
>;

export async function getMoreFollowees({
  userId,
  cursor,
}: {
  userId: string;
  cursor: string | undefined;
}) {
  const follows = await db.follow.findMany({
    where: {
      followerId: userId,
      accepted: true,
    },
    select: {
      followee: true,
    },
    take: PAGE_SIZE,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const followees = follows.map((f) => f.followee);

  return followees;
}
