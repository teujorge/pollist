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
    await db.notificationFollowPending
      .create({
        data: {
          followId: newFollow.id,
          notifyeeId: userId,
        },
      })
      .catch((error) => {
        console.error("Error creating notification", error);
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

  const declinedFollow = await db.follow.delete({
    where: {
      followerId_followedId: {
        followerId,
        followedId: myId,
      },
    },
  });

  if (declinedFollow) {
    await db.notificationFollowPending
      .deleteMany({
        where: { followId: declinedFollow.id },
      })
      .catch((error) => {
        console.error("Error deleting notification", error);
      });
  }

  console.log("deletedFollow", declinedFollow);
  revalidatePath(`/users/${myId}`);
  return declinedFollow;
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
    const removedPendingFollow = await db.notificationFollowPending
      .deleteMany({
        where: { followId: updatedFollow.id },
      })
      .catch((error) => {
        console.error("Error deleting notification", error);
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
          console.error("Error creating notification", error);
        });
    }
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

  const cancelledFollow = await db.follow.delete({
    where: {
      followerId_followedId: {
        followerId: myId,
        followedId,
      },
    },
  });

  console.log("deletedFollow", cancelledFollow);
  revalidatePath(`/users/${myId}`);
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
          followedId: userId,
          accepted: false,
        },
      ],
    },
  });

  return pendingFollows;
}
