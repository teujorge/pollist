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
        create: [
          { text: fields.option1 },
          { text: fields.option2 },
          ...fields.options.map((option) => ({ text: option.value })),
        ],
      },
    },
  });

  if (createdPoll) redirect(`/polls/${createdPoll.id}`);
}

export async function deletePoll(formData: FormData) {
  const { userId } = auth();

  // Get the pollId from the form data (dangerous data)

  const pollId = (formData.get("pollId") ?? "") as string;

  if (pollId === "") return;

  // Get authorId from db (safe data)

  const poll = await db.poll.findUnique({ where: { id: pollId } });

  if (!poll || poll.authorId !== userId) {
    throw new Error("You are not authorized to delete this poll");
  }

  const deletedPoll = await db.poll.delete({ where: { id: pollId } });

  if (deletedPoll) redirect(`/users/${userId}`);
}
