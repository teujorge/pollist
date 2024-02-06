"use server";

import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";

export async function handleVote({
  userId,
  pollId,
  optionId,
  voteId,
}: {
  userId: string;
  pollId: string;
  optionId: string | undefined;
  voteId: string | undefined;
}) {
  // user is not logged in, so we cannot vote
  if (!userId) {
    throw new Error("You need to be logged in to vote");
  }

  // user has already voted
  if (voteId) {
    // need to change the vote
    if (optionId) {
      return await db.vote.update({
        where: {
          id: voteId,
        },
        data: {
          option: {
            connect: {
              id: optionId,
            },
          },
        },
      });
    }
    // need to remove the vote
    else {
      return await db.vote.delete({
        where: {
          id: voteId,
        },
      });
    }
  }

  // user has not voted yet
  else {
    return await db.vote.create({
      data: {
        voter: {
          connect: {
            id: userId,
          },
        },
        option: {
          connect: {
            id: optionId,
          },
        },
        poll: {
          connect: {
            id: pollId,
          },
        },
      },
    });
  }
}

export async function deletePoll(formData: FormData) {
  "use server";

  const { userId } = auth();

  const authorId = (formData.get("authorId") ?? "") as string;

  if (!userId || userId !== authorId) {
    throw new Error("You are not authorized to delete this poll");
  }

  const id = (formData.get("id") ?? "") as string;

  if (id === "") return;

  // parallel delete all votes and options
  await Promise.all([
    db.vote.deleteMany({ where: { pollId: id } }),
    db.option.deleteMany({ where: { pollId: id } }),
  ]);

  // safely delete poll without relation errors
  await db.poll.delete({ where: { id: id } });

  revalidateTag("/");
}
