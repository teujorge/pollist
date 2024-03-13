"use server";

import { db } from "@/database/db";
import { type PollQuery, PAGE_SIZE } from "@/constants";
import { auth } from "@clerk/nextjs";

export type PollsDetails = NonNullable<
  Awaited<ReturnType<typeof getPaginatedPolls>>
>;

export async function getPaginatedPolls({
  page = 1,
  search,
  category,
  authorId,
  voterId,
}: PollQuery & { page: number }) {
  const { userId } = auth();

  const isTrending = category === "trending";
  const isControversial = category === "controversial";

  const currentDate = new Date();
  const recentDate = new Date(currentDate.setDate(currentDate.getDate() - 7)); // last 7 days

  const polls = await db.poll.findMany({
    where: {
      title: search ? { contains: search } : undefined,
      authorId: authorId ? { contains: authorId } : undefined,
      votes: {
        // Filter by voterId
        ...(voterId
          ? {
              some: {
                voterId: { contains: voterId },
              },
            }
          : {}),

        // Filter by date
        ...(isTrending
          ? {
              some: {
                createdAt: {
                  gte: recentDate,
                },
              },
            }
          : {}),
      },
      ...(isControversial ? { controversial: true } : {}),
    },
    orderBy: isTrending
      ? {
          votes: {
            _count: "desc",
          },
        }
      : { createdAt: "desc" },

    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      author: true,
      votes: true,
      options: true,
      likes: userId
        ? {
            where: {
              authorId: userId,
            },
          }
        : false,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  for (const poll of polls) {
    poll.likes ??= [];
  }

  return polls;
}

export async function getSinglePoll({
  pollId,
}: {
  pollId: string;
}): Promise<PollsDetails[number] | null> {
  const { userId } = auth();

  const poll = await db.poll.findUnique({
    where: { id: pollId },
    include: {
      author: true,
      votes: true,
      options: true,
      likes: userId
        ? {
            where: {
              authorId: userId,
            },
          }
        : false,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (poll) {
    poll.likes ??= [];
  }

  return poll;
}
