"use server";

import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { handlePrismaError } from "@/server/error";
import type { SubTier } from "@prisma/client";

export async function getUserSettings(userId: string) {
  const { userId: myId } = auth();

  if (!myId || myId !== userId) {
    return {
      tier: "FREE" as SubTier,
      deviceToken: null,
      blockerUsers: [],
    };
  }

  try {
    return await db.user.findUnique({
      where: { id: userId },
      select: {
        tier: true,
        deviceToken: true,
        blockerUsers: {
          select: {
            blockee: {
              select: { id: true, username: true, imageUrl: true },
            },
          },
        },
      },
    });
  } catch (e) {
    throw new Error(handlePrismaError(e));
  }
}

export async function updateUserDeviceToken(
  userId: string,
  deviceToken: string,
) {
  const { userId: myId } = auth();

  if (!myId || myId !== userId) {
    throw new Error("Unauthorized");
  }

  try {
    return await db.user.update({
      where: { id: userId },
      data: { deviceToken },
    });
  } catch (e) {
    throw new Error(handlePrismaError(e));
  }
}
