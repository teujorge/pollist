"use server";

import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";

export async function createComment({
  pollId,
  parentId,
  text,
}: {
  pollId: string;
  parentId: string | undefined;
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
      parentId,
      text,
      authorId: userId,
      acknowledgedByParent: parentId ? false : true,
    },
  });

  return newComment;
}

export async function acknowledgeReply({ commentId }: { commentId: string }) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be logged in to acknowledge a reply");
  }

  console.log("acknowledgeReply", commentId);

  await db.comment.update({
    where: {
      id: commentId,
      parent: { authorId: userId },
    },
    data: {
      acknowledgedByParent: true,
    },
  });

  console.log("DONE acknowledgeReply", commentId);
}

export async function likeComment({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  await db.commentLike.create({
    data: {
      author: {
        connect: {
          id: userId,
        },
      },
      comment: {
        connect: {
          id: commentId,
        },
      },
    },
  });
}

export async function unlikeComment({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  await db.commentLike.delete({
    where: {
      authorId_commentId: {
        authorId: userId,
        commentId: commentId,
      },
    },
  });
}

export async function deleteComment({ commentId }: { commentId: string }) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be logged in to delete a comment");
  }

  await db.comment.delete({
    where: {
      id: commentId,
      authorId: userId,
    },
  });
}
