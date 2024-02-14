"use server";

import { db } from "@/database/db";
import { headers } from "next/headers";

export async function checkAndCreateAnonUser() {
  // Use the IP address instead of user ID
  let anonId: string | undefined = undefined;
  if (process.env.NODE_ENV === "development") {
    anonId = "localhost";
  } else {
    anonId = headers().get("x-real-ip") ?? undefined;
  }

  // If we couldn't get the IP address, log a warning and return
  if (!anonId) {
    console.warn("Could not get IP address");
    return undefined;
  }

  // Create anon user if it doesn't exist
  const anonUser = await db.user.findUnique({ where: { id: anonId } });
  if (!anonUser) {
    const anonUser = await db.user.create({ data: { id: anonId, anon: true } });
    return anonUser.id;
  } else {
    return anonUser.id;
  }
}
