"use server";

import { db } from "@/server/prisma";
import { handlePrismaError } from "@/server/error";
import type { SubTier } from "@prisma/client";

export async function getUserSettings(userId: string) {
  if (!userId) {
    return {
      tier: "FREE" as SubTier,
      blockerUsers: [],
    };
  }

  try {
    return await db.user.findUnique({
      where: { id: userId },
      select: {
        tier: true,
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
