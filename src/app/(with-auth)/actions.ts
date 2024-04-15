"use server";

import { db } from "@/database/prisma";
import { handlePrismaError } from "@/database/error";
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
    try {
      handlePrismaError(e);
    } catch (e) {
      return "FREE";
    }
    return "FREE";
  }
}
