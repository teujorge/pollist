"use server";

import { v4 } from "uuid";
import { db } from "@/database/db";
import { cookies } from "next/headers";

export async function checkAndCreateAnonUser() {
  let anonId = cookies().get("anonId")?.value;
  if (!anonId) {
    anonId = "anon_" + v4();
    cookies().set("anonId", anonId);
  }

  // Create anon user if it doesn't exist
  let anonUser = await db.user.findUnique({ where: { id: anonId } });

  if (!anonUser) {
    anonUser = await db.user.create({ data: { id: anonId, anon: true } });
  }

  return anonUser.id;
}
