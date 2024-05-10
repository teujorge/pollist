"use server";

import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/server/supabase";
import { moderate } from "@/app/(with-auth)/admin/moderation";
import { pollToString } from "@/lib/utils";
import { defaultRatelimit } from "@/server/ratelimit";
import { handlePrismaError } from "@/server/error";
import { analyticsServerClient } from "@/server/analytics";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";
import type { CreatePollFields } from "./validation";

export async function createPoll(fields: CreatePollFields) {
  const { userId } = auth();

  if (!userId) throw new Error("You must be logged in to create a poll");

  await defaultRatelimit(userId);

  const pollContent = pollToString({
    title: fields.title,
    description: fields.description,
    option1: fields.option1,
    option2: fields.option2,
    options: fields.options.map((option) => option.value),
  });
  const modFlagged = await moderate(pollContent);

  try {
    const createdPoll = await db.poll.create({
      data: {
        authorId: userId,
        title: fields.title,
        description: fields.description,
        private: fields.private,
        anonymous: fields.anonymous,
        sensitive: modFlagged,
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

    analyticsServerClient.capture({
      distinctId: userId,
      event: "Poll Created",
      properties: {
        pollId: createdPoll.id,
      },
    });

    return createdPoll;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
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

  if (userId !== poll.authorId)
    throw new Error("You are not authorized to delete this poll");

  if (!supabase) throw new Error("Supabase not found");

  await defaultRatelimit(userId);

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

  async function deletePoll() {
    const deletedPoll = await db.poll.delete({
      where: { id: poll.id },
      include: {
        author: { select: { username: true } },
      },
    });

    analyticsServerClient.capture({
      distinctId: userId!,
      event: "Poll Deleted",
      properties: {
        pollId: deletedPoll.id,
      },
    });

    return deletedPoll;
  }

  let deletedPoll: Awaited<ReturnType<typeof deletePoll>>;

  try {
    deletedPoll = await deletePoll();
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }

  redirect(`/users/${deletedPoll.author.username}`);
}

export async function boostPoll(pollId: string) {
  const { userId } = auth();

  if (!userId) throw new Error("You must be logged in to boost a poll");

  await defaultRatelimit(userId);

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        boostedPoll: {
          connect: { id: pollId },
        },
      },
    });
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }

  redirect(`/polls/${pollId}`);
}

export async function unBoostPoll(redirectPollId: string) {
  const { userId } = auth();

  if (!userId) throw new Error("You must be logged in to unboost a poll");

  await defaultRatelimit(userId);

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        boostedPoll: {
          disconnect: true,
        },
      },
    });
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }

  redirect(`/polls/${redirectPollId}`);
}
