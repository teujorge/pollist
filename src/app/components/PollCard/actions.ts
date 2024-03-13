"use server";

import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";

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
  console.log("poll like", pollLike);

  if (pollLike) {
    if (userId === pollAuthorId) {
      return;
    }

    const notification = await db.notificationPollLike.create({
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
    console.log("poll like notification", notification);
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
  console.log("poll unlikes", unlikes);

  if (unlikes) {
    const unlikesNotifications = await db.notificationPollLike.deleteMany({
      where: {
        pollLike: {
          pollId,
          authorId: userId,
        },
      },
    });
    console.log("poll unlikes notifications", unlikesNotifications);
  }
}

export async function getPoll(pollId: string) {
  const poll = await db.poll.findUnique({
    where: { id: pollId },
    include: { votes: true },
  });

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

  console.log("acknowledgePollLike", notifications);

  return notifications;
}
