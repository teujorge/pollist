"use server";

import { db } from "@/database/prisma";
import { auth } from "@clerk/nextjs";
import { PAGE_SIZE } from "@/constants";
import type { PollQuery } from "@/constants";

export type PollsDetails = NonNullable<
  Awaited<ReturnType<typeof getInfinitePolls>>
>;

export async function getInfinitePolls({
  cursor,
  search,
  category,
  authorId,
  voterId,
  private: _private,
  anonymous,
}: PollQuery & { cursor: string | undefined }) {
  const { userId } = auth();

  const isTrending = category === "trending";
  const isControversial = category === "controversial";

  const currentDate = new Date();
  const recentDate = new Date(currentDate.setDate(currentDate.getDate() - 7)); // last 7 days

  const polls = await db.poll.findMany({
    where: {
      title: search ? { contains: search, mode: "insensitive" } : undefined,
      authorId: authorId ? { contains: authorId } : undefined,
      private: { equals: _private ?? false },
      anonymous: anonymous ? undefined : { equals: false },
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

    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : undefined,
    take: PAGE_SIZE,
    include: {
      author: { select: { username: true, imageUrl: true } },
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

    if (poll.anonymous) {
      poll.authorId = "Anon";
      poll.author.imageUrl = "Anon";
      poll.author.username = "Anon";
    }
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
      author: { select: { username: true, imageUrl: true } },
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

  if (poll?.anonymous) {
    poll.authorId = "Anon";
    poll.author.imageUrl = "Anon";
    poll.author.username = "Anon";
  }

  return poll;
}
