"use server";

import { db } from "@/database/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import type { CreatePollFields } from "./validation";
import { checkAndCreateAnonUser } from "@/app/api/anon/actions";
export async function createPoll(fields: CreatePollFields) {
  const { userId } = auth();

  if (fields.title === "") {
    console.warn("Title is required");
    return;
  }

  const safeDuration =
    Math.min(24, fields.duration > 0 ? fields.duration : 1) * 60 * 60 * 1000;

  let anonId: string | undefined = undefined;
  if (!userId) {
    anonId = await checkAndCreateAnonUser();
    if (!anonId) {
      console.warn("Failed to create anon user");
      return;
    }
  }

  const createdPoll = await db.poll.create({
    data: {
      authorId: userId ?? anonId!,
      title: fields.title,
      description: fields.description ?? "",
      options: {
        create: [
          { text: fields.option1 },
          { text: fields.option2 },
          ...fields.options.map((option) => ({ text: option.value })),
        ],
      },
      realtime: userId
        ? fields.realtime // user poll can be realtime
        : false, // anon poll cannot be realtime
      expiresAt: userId
        ? undefined // user has no expiration date
        : new Date(Date.now() + safeDuration), // anon poll expires in duration hours
      allowAnon: userId
        ? fields.allowAnon // user poll can allow anon
        : true, // anon poll always allows anon
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
