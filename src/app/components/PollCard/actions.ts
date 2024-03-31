"use server";

import { db } from "@/database/prisma";
import { auth } from "@clerk/nextjs/server";

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

export async function handleLikePoll({
  pollId,
  pollAuthorId,
}: {
  pollId: string;
  pollAuthorId: string;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const pollLike = await db.pollLike.create({
    data: {
      poll: {
        connect: {
          id: pollId,
        },
      },
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });

  if (pollLike) {
    if (userId === pollAuthorId) {
      return;
    }

    await db.notificationPollLike.create({
      data: {
        pollLike: {
          connect: {
            id: pollLike.id,
          },
        },
        notifyee: {
          connect: {
            id: pollAuthorId,
          },
        },
      },
    });
  }
}

export async function handleUnlikePoll({ pollId }: { pollId: string }) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const unlikes = await db.pollLike.deleteMany({
    where: {
      pollId,
      authorId: userId,
    },
  });

  if (unlikes) {
    await db.notificationPollLike.deleteMany({
      where: {
        pollLike: {
          pollId,
          authorId: userId,
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

  if (poll?.anonymous) {
    poll.authorId = "Anon";
  }

  return poll;
}

export async function acknowledgePollLike({
  pollLikeId,
}: {
  pollLikeId: string;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const notifications = await db.notificationPollLike.deleteMany({
    where: {
      pollLikeId: pollLikeId,
      notifyeeId: userId,
    },
  });

  return notifications;
}
