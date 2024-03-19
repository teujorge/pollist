"use server";

import { db } from "@/database/prisma";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { supabase } from "@/database/supabase";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";
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
      description: fields.description,
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

export async function deletePoll(poll: PollsDetails[number]) {
  const { userId } = auth();

  if (userId !== poll.authorId) {
    throw new Error("You are not authorized to delete this poll");
  }

  if (!supabase) {
    throw new Error("Supabase not found");
  }

  const imagePaths = poll.options
    .map((option) => option.imagePath)
    .filter((path) => path !== null) as string[];

  if (imagePaths.length > 0) {
    const { data, error } = await supabase.storage
      .from("polls")
      .remove(imagePaths);

    if (error !== null || imagePaths.length !== data?.length) {
      const deletedPathsFromStorage = data?.map((file) => file.name) ?? [];

      const optionsToUpdate = poll.options.filter(
        (option) =>
          option.imagePath &&
          deletedPathsFromStorage.includes(option.imagePath),
      );

      await db.option.updateMany({
        where: {
          id: { in: optionsToUpdate.map((o) => o.id) },
          imagePath: { in: deletedPathsFromStorage },
        },
        data: { imagePath: null },
      });

      // Now throw an error, to prevent deleting the poll
      if (error?.message) throw new Error(error.message);
      throw new Error("Some images were not be deleted. Please try again.");
    }
  }

  const deletedPoll = await db.poll.delete({
    where: { id: poll.id },
    include: {
      author: { select: { username: true } },
    },
  });

  if (deletedPoll) redirect(`/users/${deletedPoll.author.username}`);
}
