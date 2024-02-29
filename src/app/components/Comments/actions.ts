"use server";

import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";
import type { Comment } from "../InfiniteComments/actions";

export async function createComment({
  pollId,
  parentId,
  text,
}: {
  pollId: string;
  parentId: string | undefined;
  text: string | undefined;
}): Promise<Comment> {
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
    },
    select: {
      id: true,
      pollId: true,
      parentId: true,
      text: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,

      author: true,
      parent: {
        select: {
          authorId: true,
        },
      },
      poll: {
        select: {
          authorId: true,
        },
      },
      likes: {
        where: {
          authorId: userId ?? undefined,
        },
      },
      _count: {
        select: { likes: true, replies: true },
      },
    },
  });

  if (newComment?.parent?.authorId) {
    if (userId === newComment.parent.authorId) {
      return newComment;
    }
    await db.notification
      .create({
        data: {
          type: "COMMENT_REPLY",
          referenceId: newComment.id,
          userId: newComment.parent.authorId,
        },
      })
      .catch((error) => {
        console.error("Error creating notification", error);
      });
  }

  return newComment;
}

export async function acknowledgeReply({ commentId }: { commentId: string }) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be logged in to acknowledge a reply");
  }

  console.log("acknowledgeReply", commentId);

  const notification = await db.notification.deleteMany({
    where: {
      type: "COMMENT_REPLY",
      referenceId: commentId,
      userId,
    },
  });

  console.log("DONE acknowledgeReply", commentId);

  return notification;
}

export async function likeComment({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  return await db.commentLike.create({
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
  return await db.commentLike.delete({
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

  const deletedComment = await db.comment.delete({
    where: {
      id: commentId,
      authorId: userId,
    },
  });

  if (deletedComment) {
    await db.notification
      .deleteMany({
        where: {
          type: "COMMENT_REPLY",
          referenceId: commentId,
        },
      })
      .catch((error) => {
        console.error("Error deleting COMMENT_REPLY notifications", error);
      });
  }

  return deletedComment;
}
