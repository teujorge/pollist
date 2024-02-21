"use server";

import { v4 } from "uuid";
import { db } from "@/database/db";
import { cookies } from "next/headers";

export async function getAnonUser() {
  const anonId = cookies().get("anonId")?.value;

  if (!anonId) return null;

  return db.user.findUnique({ where: { id: anonId } });
}

export async function createAnonUser() {
  const anonId = "anon_" + v4();

  cookies().set("anonId", anonId);

  return db.user.create({ data: { id: anonId, anon: true } });
}

export async function validateAnonUser() {
  const anonUser = await getAnonUser();

  if (!anonUser) return createAnonUser();

  return anonUser;
}
