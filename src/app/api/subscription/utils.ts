import { db } from "@/server/prisma";
import type { SubTier } from "@prisma/client";

// Function to activate a subscription
export async function updateActiveSubscription(userId: string, tier: SubTier) {
  console.log("Activating Subscription:", userId, tier);
  const user = await db.user.update({
    where: { id: userId },
    data: { tier: tier, ads: false },
  });

  console.log("Subscription Activated:", user.username, user.tier);
  return user;
}

// Function to deactivate a subscription
export async function updateInactiveSubscription(userId: string) {
  console.log("Deactivating Subscription:", userId);
  const user = await db.user.update({
    where: { id: userId },
    data: { tier: "FREE", ads: true, private: false },
  });

  console.log("Subscription Deactivated:", user.username, user.tier);
  return user;
}
