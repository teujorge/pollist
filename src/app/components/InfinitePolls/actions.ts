"use server";

import { PAGE_SIZE } from "@/constants";
import { db } from "@/database/db";

export async function getPolls({
  page = 1,
  search = "",
}: {
  page?: number;
  search?: string;
}) {
  const polls = await db.poll.findMany({
    where: { title: { contains: search } },
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
