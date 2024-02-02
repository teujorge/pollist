"use server";

import { db } from "@/database/db";
import { redirect } from "next/navigation";
import type { CreatePollFields } from "./validation";

export async function createPoll(fields: CreatePollFields) {
  if (fields.userId === "") return;
  if (fields.title === "") return;
  if (fields.description === "") return;

  const createdPoll = await db.poll.create({
    data: {
      userId: fields.userId,
      title: fields.title,
      description: fields.description ?? "",
      options: { create: [{ text: fields.option1 }, { text: fields.option2 }] },
    },
  });

  if (createdPoll) redirect(`/post/${createdPoll.id}`);
}
