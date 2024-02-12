"use server";

import { db } from "@/database/db";
import { type Category, type PollQuery, PAGE_SIZE } from "@/constants";

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
  const polls = await db.poll.findMany({
    where: {
      title: search ? { contains: search } : undefined,
      authorId: authorId ? { contains: authorId } : undefined,
      votes: voterId
        ? {
            some: {
              voterId: { contains: voterId },
            },
          }
        : undefined,
      ...trendingConditions(category),
      ...controversialConditions(category),
    },
    orderBy: { createdAt: "desc" },
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

function trendingConditions(category?: Category) {
  if (category !== "trending") return {};

  const currentDate = new Date();
  const recentDate = new Date(currentDate.setDate(currentDate.getDate() - 7)); // last 7 days

  return {
    votes: {
      some: {
        createdAt: {
          gte: recentDate,
        },
      },
    },
  };
}

function controversialConditions(category?: Category) {
  if (category !== "controversial") return {};

  return {
    controversial: true,
  };
}
