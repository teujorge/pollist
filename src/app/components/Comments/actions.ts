"use server";

import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { sendAPN } from "@/app/(with-auth)/actions";
import { currentUser } from "@clerk/nextjs/server";
import { commentSelect } from "../InfiniteComments/commentSelect";
import { defaultRatelimit } from "@/server/ratelimit";
import { handlePrismaError } from "@/server/error";

export async function createComment({
  pollId,
  parentId,
  atUsername,
  text,
}: {
  pollId: string;
  parentId: string | undefined;
  atUsername: string | undefined;
  text: string | undefined;
}) {
  if (!text) throw new Error("You must provide a comment");

  const user = await currentUser();

  if (!user?.id) throw new Error("You must be logged in to comment");

  await defaultRatelimit(user.id);

  try {
    const newComment = await db.comment.create({
      data: {
        pollId,
        parentId,
        text,
        at: atUsername,
        authorId: user.id,
      },
      select: commentSelect(user.id ?? undefined),
    });

    // Only a reply to a reply has an atUsername
    // Ignore if the user is replying to their own reply
    if (user.username === newComment.at) {
      console.log("User is replying to their own reply");
      return newComment;
    }
    // Comment on a poll or a reply to a comment
    else {
      // Ignore if the user is commenting on their own poll
      if (
        newComment.parentId === null &&
        user.id === newComment.poll.authorId
      ) {
        console.log("User is commenting to their own poll");
        return newComment;
      }

      // Ignore if the user is replying to their own comment
      if (newComment.at === null && user.id === newComment.parent?.authorId) {
        console.log("User is replying to their own comment");
        return newComment;
      }
    }

    let notifyeeId: string | undefined = undefined;

    // Reply to a reply
    if (newComment.at) {
      const replyingToUser = await db.user.findUnique({
        where: {
          username: newComment.at,
        },
        select: { id: true },
      });

      notifyeeId = replyingToUser?.id;
    }
    // Poll comment or reply to a comment
    else {
      // Comment on a poll
      if (newComment.parentId === null) {
        notifyeeId = newComment.poll.authorId;
      }
      // Reply to a comment
      else {
        notifyeeId = newComment.parent?.authorId;
      }
    }

    if (!notifyeeId) {
      console.error("Error finding user to notify", newComment.at);
      return newComment;
    }

    await db.notificationComment
      .create({
        data: {
          notifyeeId: notifyeeId,
          commentId: newComment.id,
        },
      })
      .then(async () => {
        await sendAPN({
          userId: notifyeeId,
          title: "New Comment on Your Poll 📝",
          body: `${user.username} left a comment on your poll.`,
        });
      })
      .catch((error) => {
        console.error("Error creating notification", error);
      });

    return newComment;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function acknowledgeCommentReply({
  commentId,
}: {
  commentId: string;
}) {
  const { userId } = auth();

  if (!userId) throw new Error("You must be logged in to acknowledge a reply");

  await defaultRatelimit(userId);

  try {
    const notification = await db.notificationComment.deleteMany({
      where: {
        commentId: commentId,
        notifyeeId: userId,
      },
    });

    return notification;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function acknowledgeCommentLike({
  commentId,
}: {
  commentId: string;
}) {
  const { userId } = auth();

  if (!userId) throw new Error("You must be logged in to acknowledge a like");

  await defaultRatelimit(userId);

  try {
    const notification = await db.notificationCommentLike.deleteMany({
      where: {
        commentLike: {
          commentId: commentId,
        },
        notifyeeId: userId,
      },
    });

    return notification;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function likeComment({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  await defaultRatelimit(userId);

  try {
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
      select: {
        id: true,
        createdAt: true,
        commentId: true,
        comment: {
          select: { authorId: true },
        },
        authorId: true,
        author: { select: { username: true } },
      },
    });

    if (like && like.comment.authorId !== userId) {
      await db.notificationCommentLike
        .create({
          data: {
            commentLikeId: like.id,
            notifyeeId: like.comment.authorId,
          },
        })
        .then(async () => {
          await sendAPN({
            userId: like.comment.authorId,
            title: "Your Comment was Liked! ❤️",
            body: `${like.author.username} liked your comment.`,
          });
        })
        .catch((error) => {
          console.error("Error creating notification", error);
        });
    }

    return like;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function unlikeComment({
  commentId,
  userId,
}: {
  commentId: string;
  userId: string;
}) {
  await defaultRatelimit(userId);

  try {
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
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function deleteComment({ commentId }: { commentId: string }) {
  const { userId } = auth();

  if (!userId) throw new Error("You must be logged in to delete a comment");

  await defaultRatelimit(userId);

  try {
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
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}
