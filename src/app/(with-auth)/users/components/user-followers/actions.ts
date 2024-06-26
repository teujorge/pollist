"use server";

import { db } from "@/server/prisma";
import { PAGE_SIZE } from "@/constants";

export type Followers = NonNullable<
  Awaited<ReturnType<typeof getMoreFollowers>>
>;

export async function getMoreFollowers({
  userId,
  cursor,
}: {
  userId: string;
  cursor: string | undefined;
}) {
  const follows = await db.follow.findMany({
    where: {
      followeeId: userId,
      accepted: true,
    },
    select: {
      follower: true,
    },
    take: PAGE_SIZE,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const followers = follows.map((f) => f.follower);

  return followers;
}
