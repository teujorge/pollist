"use server";

import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { PAGE_SIZE } from "@/constants";

export type UsersDetails = NonNullable<
  Awaited<ReturnType<typeof getInfiniteUsers>>
>;

export async function getInfiniteUsers({
  cursor,
  username,
}: {
  cursor: string | undefined;
  username: string | undefined;
}) {
  const { userId: myId } = auth();

  const users = await db.user.findMany({
    where: {
      username: username
        ? { contains: username, mode: "insensitive" }
        : undefined,
    },

    orderBy: {
      votes: { _count: "desc" },
    },

    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : undefined,
    take: PAGE_SIZE,
    select: {
      id: true,
      username: true,
      imageUrl: true,
      private: true,

      followers: myId
        ? {
            where: { followeeId: myId },
            select: { followeeId: true, accepted: true },
          }
        : undefined,
      followees: myId
        ? {
            where: { followerId: myId },
            select: { followerId: true, accepted: true },
          }
        : undefined,

      _count: {
        select: {
          polls: true,
          votes: true,
          followees: { where: { accepted: true } },
          followers: { where: { accepted: true } },
        },
      },
    },
  });

  return users;
}
