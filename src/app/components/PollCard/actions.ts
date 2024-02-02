"use server";

import { db } from "@/database/db";
import { revalidateTag } from "next/cache";

export async function handleVote({
  userId,
  pollId,
  optionId,
  voteId,
}: {
  userId: string | undefined;
  pollId: string;
  optionId: string;
  voteId: string | undefined;
}) {
  // user is not logged in, so we cannot vote
  if (!userId) {
    throw new Error("You need to be logged in to vote");
  }

  console.log("DELETE", voteId);
  // user has already voted, so we need to remove the vote
  if (voteId) {
    await db.vote.delete({
      where: {
        id: voteId,
      },
    });
  }

  // now we need to add the vote
  await db.vote.create({
    data: {
      user: {
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

  revalidateTag("/");
}
