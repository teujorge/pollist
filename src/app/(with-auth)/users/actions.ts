"use server";

import { db } from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type GetUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;

export async function getUser(username: string) {
  const { userId: myId } = auth();

  const user = await db.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
      imageUrl: true,
      username: true,
      ads: true,
      private: true,
      tier: true,
      _count: {
        select: {
          polls: true,
          votes: true,
          followers: { where: { accepted: true } },
          followees: { where: { accepted: true } },
        },
      },
      followees: myId
        ? {
            where: {
              followerId: myId,
              accepted: true,
            },
          }
        : false,
    },
  });

  return user;
}

// myId asks to follow userId
export async function follow(userId: string) {
  const { userId: myId } = auth();
  if (!myId) return;
  if (myId === userId) return;

  const newFollow = await db.follow.create({
    data: {
      followerId: myId,
      followeeId: userId,
    },
    select: {
      id: true,
      follower: { select: { username: true } },
    },
  });

  if (newFollow) {
    await db.notificationFollowPending
      .create({
        data: {
          followId: newFollow.id,
          notifyeeId: userId,
        },
      })
      .catch((error) => {
        console.error("Error creating follow notification", error);
      });
  }

  revalidatePath(`/users/${newFollow.follower.username}`);
  return newFollow;
}

// myId unfollows userId
export async function unfollow(userId: string) {
  const { userId: myId } = auth();
  if (!myId) return;
  if (myId === userId) return;

  const deletedFollow = await db.follow.delete({
    where: {
      followerId_followeeId: {
        followerId: myId,
        followeeId: userId,
      },
    },
    select: {
      follower: { select: { username: true } },
    },
  });

  revalidatePath(`/users/${deletedFollow.follower.username}`);

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
      followeeId: myId,
    },
  });

  return followers;
}

export async function declineFollow(followerId: string) {
  const { userId: myId } = auth();
  if (!myId) return;

  const declinedFollow = await db.follow.delete({
    where: {
      followerId_followeeId: {
        followerId,
        followeeId: myId,
      },
    },
    select: {
      id: true,
      followee: { select: { username: true } },
    },
  });

  if (declinedFollow) {
    await db.notificationFollowPending
      .deleteMany({
        where: { followId: declinedFollow.id },
      })
      .catch((error) => {
        console.error("Error deleting follow notification", error);
      });
  }

  revalidatePath(`/users/${declinedFollow.followee.username}`);
  return declinedFollow;
}

export async function acceptFollow(followerId: string) {
  const { userId: myId } = auth();
  if (!myId) return;

  const updatedFollow = await db.follow.update({
    where: {
      followerId_followeeId: {
        followerId,
        followeeId: myId,
      },
    },
    data: {
      accepted: true,
    },
    select: {
      id: true,
      followee: { select: { username: true } },
      follower: { select: { username: true } },
    },
  });

  if (updatedFollow) {
    const removedPendingFollow = await db.notificationFollowPending
      .deleteMany({
        where: { followId: updatedFollow.id },
      })
      .catch((error) => {
        console.error("Error deleting follow notification", error);
      });

    if (removedPendingFollow) {
      await db.notificationFollowAccepted
        .create({
          data: {
            followId: updatedFollow.id,
            notifyeeId: followerId,
          },
        })
        .catch((error) => {
          console.error("Error creating follow accept notification", error);
        });
    }
  }

  revalidatePath(`/users/${updatedFollow.followee.username}`);
  revalidatePath(`/users/${updatedFollow.follower.username}`);
  return updatedFollow;
}

export async function cancelFollow(followeeId: string) {
  const { userId: myId } = auth();
  if (!myId) return;

  const cancelledFollow = await db.follow.delete({
    where: {
      followerId_followeeId: {
        followerId: myId,
        followeeId,
      },
    },
    select: {
      follower: { select: { username: true } },
    },
  });

  revalidatePath(`/users/${cancelledFollow.follower.username}`);
  return cancelledFollow;
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
          followeeId: userId,
          accepted: false,
        },
      ],
    },
  });

  return pendingFollows;
}

export async function setPrivateAccount(isPrivate: boolean) {
  const { userId } = auth();

  if (!userId) throw new Error("User not found");

  const newUser = await db.user.update({
    where: { id: userId },
    data: { private: isPrivate },
  });

  revalidatePath(`/users/${newUser.username}`);
  return newUser;
}

export async function setShowAds(showAds: boolean) {
  const { userId } = auth();

  if (!userId) throw new Error("User not found");

  const newUser = await db.user.update({
    where: { id: userId },
    data: { ads: showAds },
  });

  revalidatePath(`/users/${newUser.username}`);
  return newUser;
}
