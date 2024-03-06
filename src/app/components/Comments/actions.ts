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
    const notification = await db.notificationComment
      .create({
        data: {
          notifyeeId: newComment.parent.authorId,
          commentId: newComment.id,
        },
      })
      .catch((error) => {
        console.error("Error creating notification", error);
      });

    console.log("notification", notification);
  }

  return newComment;
}

export async function acknowledgeCommentReply({
  commentId,
}: {
  commentId: string;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be logged in to acknowledge a reply");
  }

  console.log("acknowledgeReply", commentId);

  const notification = await db.notificationComment.deleteMany({
    where: {
      commentId: commentId,
      notifyeeId: userId,
    },
  });

  console.log("DONE acknowledgeReply", commentId);

  return notification;
}

export async function acknowledgeCommentLike({
  commentId,
}: {
  commentId: string;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be logged in to acknowledge a like");
  }

  const notification = await db.notificationCommentLike.deleteMany({
    where: {
      commentLike: {
        commentId: commentId,
      },
      notifyeeId: userId,
    },
  });

  return notification;
}

export async function likeComment({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  const like = await db.commentLike.create({
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
    include: {
      comment: {
        select: { authorId: true },
      },
    },
  });

  if (like && like.comment.authorId !== userId) {
    const notification = await db.notificationCommentLike
      .create({
        data: {
          commentLikeId: like.id,
          notifyeeId: like.comment.authorId,
        },
      })
      .catch((error) => {
        console.error("Error creating notification", error);
      });

    console.log("notification", notification);
  }

  return like;
}

export async function unlikeComment({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  const unlike = await db.commentLike.delete({
    where: {
      authorId_commentId: {
        authorId: userId,
        commentId: commentId,
      },
    },
  });

  if (unlike) {
    await db.notificationCommentLike
      .deleteMany({
        where: { commentLikeId: unlike.id },
      })
      .catch((error) => {
        console.error("Error deleting notification", error);
      });
  }

  return unlike;
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
    await db.notificationComment
      .deleteMany({
        where: { commentId: commentId },
      })
      .catch((error) => {
        console.error("Error deleting COMMENT_REPLY notifications", error);
      });
  }

  return deletedComment;
}
