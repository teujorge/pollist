"use server";

import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { defaultRatelimit } from "@/server/ratelimit";
import { handlePrismaError } from "@/server/error";
import { sendNotification, silentlyUpdateAPN } from "@/app/(with-auth)/actions";

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
  await defaultRatelimit(userId);

  try {
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
  } catch (error) {
    throw new Error(handlePrismaError(error));
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

  if (!userId) throw new Error("User not found");

  await defaultRatelimit(userId);

  try {
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
      select: {
        id: true,
        author: { select: { username: true } },
      },
    });

    if (pollLike) {
      if (userId === pollAuthorId) {
        return;
      }

      await db.notificationPollLike
        .create({
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
        })
        .then(async () => {
          await sendNotification({
            userId: pollAuthorId,
            title: "Your Poll Got a Like! 👍",
            body: `${pollLike.author.username} liked your poll.`,
          });
        });
    }
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function handleUnlikePoll({ pollId }: { pollId: string }) {
  const { userId } = auth();

  if (!userId) throw new Error("User not found");

  await defaultRatelimit(userId);

  try {
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
      await silentlyUpdateAPN();
    }
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function getPoll(pollId: string) {
  try {
    const { userId } = auth();

    const poll = await db.poll.findUnique({
      where: { id: pollId },
      include: { votes: true },
    });

    if (poll?.anonymous && poll.authorId !== userId) {
      poll.authorId = "Anon";
    }

    return poll;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function acknowledgePollLike({
  pollLikeId,
}: {
  pollLikeId: string;
}) {
  const { userId } = auth();

  if (!userId) throw new Error("User not found");

  await defaultRatelimit(userId);

  try {
    const notifications = await db.notificationPollLike.deleteMany({
      where: {
        pollLikeId: pollLikeId,
        notifyeeId: userId,
      },
    });

    await silentlyUpdateAPN();

    return notifications;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}
