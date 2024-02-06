"use server";

import { db } from "@/database/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import type { CreatePollFields } from "./validation";

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
      authorId: userId,
      title: fields.title,
      description: fields.description ?? "",
      options: {
        create: fields.options.map((option) => ({ text: option.value })),
      },
    },
  });

  console.log("Created Poll:", createdPoll);

  if (createdPoll) redirect(`/polls/${createdPoll.id}`);
}
