"use server";

import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { defaultRatelimit } from "@/server/ratelimit";
import { handlePrismaError } from "@/server/error";
import { sendNotification, silentlyUpdateAPN } from "../actions";

export type GetUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;

export async function getUser(username?: string, id?: string) {
  try {
    if (!id && !username) {
      return null;
    }

    const { userId: myId } = auth();

    const user = await db.user.findUnique({
      where: {
        id: id,
        username: username,
      },
      select: {
        id: true,
        imageUrl: true,
        username: true,
        ads: true,
        private: true,
        viewSensitive: true,
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
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

// myId asks to follow userId
export async function follow(userId: string, revalidateUserPath = true) {
  const { userId: myId } = auth();
  await defaultRatelimit(myId);

  try {
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
      db.notificationFollowPending
        .create({
          data: {
            followId: newFollow.id,
            notifyeeId: userId,
          },
        })
        .then(async () => {
          await sendNotification({
            userId: userId,
            title: "New Follow Request 🌟",
            body: `${newFollow.follower.username} wants to connect with you!`,
            payload: { url: `/users/${newFollow.follower.username}` },
          });
        })
        .catch((error) => {
          console.error("Error creating follow notification", error);
        });
    }

    if (revalidateUserPath) {
      revalidatePath(`/users/${newFollow.follower.username}`);
    }

    return newFollow;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

// myId unfollows userId
export async function unfollow(userId: string, revalidateUserPath = true) {
  const { userId: myId } = auth();
  await defaultRatelimit(myId);

  try {
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

    if (revalidateUserPath) {
      revalidatePath(`/users/${deletedFollow.follower.username}`);
    }

    return deletedFollow;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function getFollowing() {
  const { userId: myId } = auth();

  try {
    if (!myId) return;

    const following = await db.follow.findMany({
      where: {
        followerId: myId,
      },
    });

    return following;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function getFollowers() {
  const { userId: myId } = auth();

  try {
    if (!myId) return;

    const followers = await db.follow.findMany({
      where: {
        followeeId: myId,
      },
    });

    return followers;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function declineFollow(followerId: string) {
  const { userId: myId } = auth();
  await defaultRatelimit(myId);

  try {
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
      db.notificationFollowPending
        .deleteMany({
          where: { followId: declinedFollow.id },
        })
        .then(async () => {
          await silentlyUpdateAPN();
        })
        .catch((error) => {
          console.error("Error deleting follow notification", error);
        });
    }

    revalidatePath(`/users/${declinedFollow.followee.username}`);
    return declinedFollow;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function acceptFollow(followerId: string) {
  const { userId: myId } = auth();
  await defaultRatelimit(myId);

  try {
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
        db.notificationFollowAccepted
          .create({
            data: {
              followId: updatedFollow.id,
              notifyeeId: followerId,
            },
          })
          .then(async () => {
            await sendNotification({
              userId: followerId,
              title: "Follow Request Accepted! 🎉",
              body: `${updatedFollow.followee.username} accepted your follow request.`,
              payload: { url: `/users/${updatedFollow.followee.username}` },
            });
          })
          .catch((error) => {
            console.error("Error creating follow accept notification", error);
          });
      }
    }

    revalidatePath(`/users/${updatedFollow.followee.username}`);
    revalidatePath(`/users/${updatedFollow.follower.username}`);
    return updatedFollow;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function cancelFollow(followeeId: string) {
  const { userId: myId } = auth();
  await defaultRatelimit(myId);

  try {
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
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function getPendingFollows(userId: string) {
  await defaultRatelimit();

  try {
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
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function setPrivateAccount(isPrivate: boolean) {
  const { userId } = auth();
  if (!userId) throw new Error("User not found");
  await defaultRatelimit(userId);

  try {
    await db.user.update({
      where: {
        id: userId,
        tier: { not: { equals: "FREE" } },
      },
      data: { private: isPrivate },
    });
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function setShowAds(showAds: boolean) {
  const { userId } = auth();
  if (!userId) throw new Error("User not found");
  await defaultRatelimit(userId);

  try {
    await db.user.update({
      where: {
        id: userId,
        tier: { not: { equals: "FREE" } },
      },
      data: { ads: showAds },
    });
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function setShowSensitiveContent(showSensitive: boolean) {
  const { userId } = auth();
  if (!userId) throw new Error("User not found");
  await defaultRatelimit(userId);

  try {
    await db.user.update({
      where: { id: userId },
      data: { viewSensitive: showSensitive },
    });
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function blockUser(userId: string) {
  const { userId: myId } = auth();
  await defaultRatelimit(myId);

  try {
    if (!myId) return;

    const blockedUser = await db.block.create({
      data: {
        blockerId: myId,
        blockeeId: userId,
      },
      include: {
        blockee: true,
      },
    });

    return blockedUser;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function unblockUser(userId: string) {
  const { userId: myId } = auth();
  await defaultRatelimit(myId);

  try {
    if (!myId) return;

    const unblockedUser = await db.block.delete({
      where: {
        blockerId_blockeeId: {
          blockerId: myId,
          blockeeId: userId,
        },
      },
      include: {
        blockee: true,
      },
    });

    return unblockedUser;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}
