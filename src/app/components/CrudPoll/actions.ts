"use server";

import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { validateAnonUser } from "@/app/api/anon/actions";
import type { CreatePollFields } from "./validation";

export async function createPoll(fields: CreatePollFields) {
  const { userId } = auth();

  const hourToMs = 60 * 60 * 1000;
  const safeDuration = fields.duration
    ? Math.min(24, fields.duration > 0 ? fields.duration : 1) * hourToMs
    : hourToMs;

  let anonId: string | undefined = undefined;
  if (!userId) {
    anonId = (await validateAnonUser()).id;
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
        ? fields.allowAnon // user poll can allow/disallow anon
        : true, // anon poll always allows anon
    },
  });

  if (createdPoll) redirect(`/polls/${createdPoll.id}`);
}

export async function deletePoll(formData: FormData) {
  const { userId } = auth();

  // Use the IP address instead of user ID
  let anonId: string | undefined = undefined;
  if (process.env.NODE_ENV === "development") {
    anonId = "localhost";
  } else {
    anonId = headers().get("x-real-ip") ?? undefined;
  }

  // Get the pollId from the form data (dangerous data)

  const pollId = (formData.get("pollId") ?? "") as string;

  if (pollId === "") return;

  // Get authorId from db (safe data)

  const poll = await db.poll.findUnique({ where: { id: pollId } });

  if (!poll) {
    throw new Error("Poll not found...");
  }

  if (userId !== poll.authorId && anonId !== poll.authorId) {
    throw new Error("You are not authorized to delete this poll");
  }

  const deletedPoll = await db.poll.delete({ where: { id: pollId } });

  if (deletedPoll) redirect(`/users/${userId ?? anonId}`);
}
