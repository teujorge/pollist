"use server";

import { db } from "@/server/prisma";
import { handlePrismaError } from "@/server/error";
import type { SubTier } from "@prisma/client";

export async function getUserTier(userId: string): Promise<SubTier> {
  try {
    if (!userId) return "FREE";

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { tier: true },
    });

    return user?.tier ?? "FREE";
  } catch (e) {
    throw new Error(handlePrismaError(e));
  }
}
