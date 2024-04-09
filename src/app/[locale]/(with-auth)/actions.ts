"use server";

import { db } from "@/database/prisma";
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
    console.error(e);
    return "FREE";
  }
}
