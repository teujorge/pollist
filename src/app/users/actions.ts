"use server";

import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export async function follow(userId: string) {
  console.log("userId", userId);

  const { userId: myId } = auth();

  console.log("myId", myId);

  if (!myId) return;

  console.log("start follow");

  const newFollow = await db.follow.create({
    data: {
      followerId: myId, // user who is following
      followingId: userId, // user being followed
    },
  });

  console.log("newFollow", newFollow);

  revalidatePath(`/users/${userId}`);

  return newFollow;
}

export async function unfollow(userId: string) {
  const { userId: myId } = auth();
  if (!myId) return;

  const deletedFollow = await db.follow.delete({
    where: {
      followerId_followingId: {
        followerId: myId,
        followingId: userId,
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
      followingId: myId,
    },
  });

  return followers;
}
