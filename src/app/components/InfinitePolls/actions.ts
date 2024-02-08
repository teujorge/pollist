"use server";

import { db } from "@/database/db";
import { type Category, PAGE_SIZE } from "@/constants";

export type PollsDetails = NonNullable<Awaited<ReturnType<typeof getPolls>>>;

export async function getPolls({
  page = 1,
  search = "",
  category = "",
}: {
  page?: number;
  search?: string;
  category?: Category;
}) {
  const polls = await db.poll.findMany({
    where: {
      title: { contains: search },
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

function trendingConditions(category: Category) {
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

function controversialConditions(category: Category) {
  if (category !== "controversial") return {};

  return {
    controversial: true,
  };
}
