"use server";

import { db } from "@/database/db";
import { redirect } from "next/navigation";
import type { CreatePollFields } from "./validation";
import { auth } from "@clerk/nextjs";

export async function createPoll(fields: CreatePollFields) {
  const { userId } = auth();

  if (!userId || userId === "") {
    console.warn("User is not authenticated");
    return;
  }

  if (fields.title === "") {
    console.warn("Title is required");
    return;
  }

  const createdPoll = await db.poll.create({
    data: {
      userId: userId,
      title: fields.title,
      description: fields.description ?? "",
      options: {
        create: fields.options.map((option) => ({ text: option.value })),
      },
    },
  });

  if (createdPoll) redirect(`/poll/${createdPoll.id}`);
}
