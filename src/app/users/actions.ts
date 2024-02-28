"use server";

import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

// myId asks to follow userId
export async function follow(userId: string) {
  const { userId: myId } = auth();
  if (!myId) return;
  if (myId === userId) return;

  const newFollow = await db.follow.create({
    data: {
      followerId: myId,
      followedId: userId,
    },
  });

  if (newFollow) {
    void db.notification.create({
      data: {
        type: "FOLLOW_PENDING",
        referenceId: newFollow.id,
        userId,
      },
    });
  }

  console.log("newFollow", newFollow);

  revalidatePath(`/users/${userId}`);

  return newFollow;
}

// myId unfollows userId
export async function unfollow(userId: string) {
  const { userId: myId } = auth();
  if (!myId) return;
  if (myId === userId) return;

  const deletedFollow = await db.follow.delete({
    where: {
      followerId_followedId: {
        followerId: myId,
        followedId: userId,
      },
    },
  });

  revalidatePath(`/users/${userId}`);

  return deletedFollow;
}

export async function getFollowing() {
  const { userId: myId } = auth();
  if (!myId) return;

  const following = await db.follow.findMany({
    where: {
      followerId: myId,
    },
  });

  return following;
}

export async function getFollowers() {
  const { userId: myId } = auth();
  if (!myId) return;

  const followers = await db.follow.findMany({
    where: {
      followedId: myId,
    },
  });

  return followers;
}

export async function declineFollow(followerId: string) {
  console.log("declineFollow", followerId);
  const { userId: myId } = auth();
  if (!myId) return;
  console.log("myId", myId);

  const deletedFollow = await db.follow.delete({
    where: {
      followerId_followedId: {
        followerId,
        followedId: myId,
      },
    },
  });

  console.log("deletedFollow", deletedFollow);
  revalidatePath(`/users/${myId}`);
  return deletedFollow;
}

export async function acceptFollow(followerId: string) {
  console.log("acceptFollow", followerId);
  const { userId: myId } = auth();
  if (!myId) return;
  console.log("myId", myId);

  const updatedFollow = await db.follow.update({
    where: {
      followerId_followedId: {
        followerId,
        followedId: myId,
      },
    },
    data: {
      accepted: true,
    },
  });

  if (updatedFollow) {
    void db.notification.create({
      data: {
        type: "FOLLOW_ACCEPTED",
        referenceId: updatedFollow.id,
        userId: followerId,
      },
    });
  }

  console.log("updatedFollow", updatedFollow);
  revalidatePath(`/users/${myId}`);
  return updatedFollow;
}

export async function cancelFollow(followedId: string) {
  console.log("cancelFollow", followedId);
  const { userId: myId } = auth();
  if (!myId) return;
  console.log("myId", myId);

  const deletedFollow = await db.follow.delete({
    where: {
      followerId_followedId: {
        followerId: myId,
        followedId,
      },
    },
  });

  console.log("deletedFollow", deletedFollow);
  revalidatePath(`/users/${myId}`);
  return deletedFollow;
}

export async function getPendingFollows(userId: string) {
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

  return pendingFollows;
}

export async function getUnreadReplies(userId: string) {
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

  return unreadReplies;
}

export async function getNotifications() {
  const { userId } = auth();

  if (!userId) return;

  const notifications = await db.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
}
