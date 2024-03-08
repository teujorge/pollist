"use server";

import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { supabase } from "@/database/dbRealtime";
import type { CreatePollFields } from "./validation";

export async function createPoll(fields: CreatePollFields) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be logged in to create a poll");
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
    include: {
      options: true,
    },
  });

  return createdPoll;
}

export async function addImagePathToPollOption(optionId: string, path: string) {
  const updatedOption = await db.option.update({
    where: { id: optionId },
    data: { imagePath: path },
  });

  return updatedOption;
}

export async function redirectToPoll(pollId: string) {
  redirect(`/polls/${pollId}`);
}

export async function deletePoll(formData: FormData) {
  const { userId } = auth();

  // Get the pollId from the form data (dangerous data)

  const pollId = (formData.get("pollId") ?? "") as string;

  if (pollId === "") return;

  // Get authorId from db (safe data)

  const poll = await db.poll.findUnique({ where: { id: pollId } });

  if (!poll) {
    throw new Error("Poll not found...");
  }

  if (userId !== poll.authorId) {
    throw new Error("You are not authorized to delete this poll");
  }

  const deletedPoll = await db.poll.delete({
    where: { id: pollId },
    include: { options: true },
  });

  if (supabase) {
    const imagePaths = deletedPoll.options
      .map((option) => option.imagePath)
      .filter((path) => path !== null) as string[];
    console.log("Deleting images", imagePaths);

    const { data, error } = await supabase.storage
      .from("polls")
      .remove(imagePaths);
    console.log(data, error);

    if (error) {
      const { data: data2, error: error2 } = await supabase.storage
        .from("polls")
        .remove(imagePaths);
      console.log(data2, error2);
    }
  } else {
    console.error("Supabase client not found");
  }

  if (deletedPoll) redirect(`/users/${userId}`);
}
