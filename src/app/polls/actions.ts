"use server";

import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export async function createComment({
  pollId,
  text,
}: {
  pollId: string;
  text: string | undefined;
}) {
  if (!text) {
    throw new Error("You must provide a comment");
  }

  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be logged in to comment");
  }

  const newComment = await db.comment.create({
    data: {
      pollId,
      text,
      authorId: userId,
    },
  });

  revalidatePath(`/polls/${pollId}/comments`);

  return newComment;
}