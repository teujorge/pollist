"use server";

import { db } from "@/database/db";
import { type PollQuery, PAGE_SIZE } from "@/constants";

export type PollsDetails = NonNullable<
  Awaited<ReturnType<typeof getInfinitePolls>>
>;

export async function getInfinitePolls({
  page = 1,
  search,
  category,
  authorId,
  voterId,
}: PollQuery & { page: number }) {
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
    },
  });

  return polls;
}
