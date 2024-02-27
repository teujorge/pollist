"use server";

import { db } from "@/database/db";

export async function getPendingFollows(userId: string) {
  console.log("getPendingFollows");

  const pendingFollows = await db.follow.findMany({
    where: {
      OR: [
        {
          followerId: userId,
          accepted: false,
        },
        {
          followedId: userId,
          accepted: false,
        },
      ],
    },
  });

  console.log("pendingFollows", pendingFollows);

  return pendingFollows;
}

export async function getUnreadReplies(userId: string) {
  console.log("getUnreadReplies");

  const unreadReplies = await db.comment.findMany({
    where: {
      parent: {
        authorId: userId,
      },
      acknowledgedByParent: false,
    },
    select: {
      id: true,
      pollId: true,
      author: {
        select: {
          username: true,
        },
      },
      parent: {
        select: {
          id: true,
        },
      },
    },
  });

  console.log("unreadReplies", unreadReplies);

  return unreadReplies;
}
