"use server";

import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { PAGE_SIZE } from "@/constants";
import { censorPollAuthor, pollInclude } from "./utils";
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
  private: __private,
  anonymous,
  boostedId,
}: PollQuery & { cursor: string | undefined }) {
  const { userId } = auth();

  const _private = __private ?? false;
  const _anonymous = anonymous ?? false;

  const isTrending = category === "trending";
  const isControversial = category === "controversial";

  // const currentDate = new Date();
  // const recentDate = new Date(currentDate.setDate(currentDate.getDate() - 7)); // last 7 days

  // Determine if we should fetch a random boosted poll
  let boostedPoll = null;
  if (!cursor && !boostedId) {
    // only on the first page
    const boostedPollCount = await db.poll.count({
      where: { boostedById: { not: null } },
    });

    if (boostedPollCount > 0) {
      const randomIndex = Math.floor(Math.random() * boostedPollCount);
      boostedPoll = await db.poll.findFirst({
        where: { boostedById: { not: null } },
        skip: randomIndex,
        include: pollInclude(userId),
      });
    }
  }

  const polls = await db.poll.findMany({
    where: {
      title: search ? { contains: search, mode: "insensitive" } : undefined,
      authorId: authorId ? { contains: authorId } : undefined,
      ...(_private !== "both" ? { private: { equals: _private } } : {}),
      ...(_anonymous !== "both" ? { anonymous: { equals: _anonymous } } : {}),
      votes: {
        ...(voterId ? { some: { voterId: { contains: voterId } } } : {}),
        // // Filter by date -> temp disabled
        // ...(isTrending
        //   ? {
        //       some: {
        //         createdAt: {
        //           gte: recentDate,
        //         },
        //       },
        //     }
        //   : {}),
      },
      ...(isControversial ? { controversial: true } : {}),
      ...(boostedId ? { id: { not: boostedId } } : {}),
      ...(boostedPoll ? { id: { not: boostedPoll.id } } : {}),
    },
    orderBy: isTrending ? { votes: { _count: "desc" } } : { createdAt: "desc" },
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    take: boostedPoll ? PAGE_SIZE - 1 : PAGE_SIZE,
    include: pollInclude(userId),
  });

  if (boostedPoll) polls.unshift(boostedPoll);

  for (const poll of polls) {
    poll.likes ??= [];
    censorPollAuthor(poll, userId);
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
    include: pollInclude(userId),
  });

  if (poll) {
    poll.likes ??= [];
    censorPollAuthor(poll, userId);
  }

  return poll;
}
