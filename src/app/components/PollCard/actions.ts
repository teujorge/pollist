"use server";

import { db } from "@/database/db";

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

export async function getPoll(pollId: string) {
  const poll = await db.poll.findUnique({
    where: { id: pollId },
    include: { votes: true },
  });

  return poll;
}
