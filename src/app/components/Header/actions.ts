"use server";

import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { handlePrismaError } from "@/server/error";

export type NotificationType =
  | "PollLikeNotification"
  | "CommentNotification"
  | "CommentLikeNotification"
  | "FollowPendingNotification"
  | "FollowAcceptedNotification";

type NotificationItems = NonNullable<
  Awaited<ReturnType<typeof getNotificationsItems>>
>;

export type NotificationPollLikeItem =
  NotificationItems["notificationsPollLike"][number];
export type NotificationCommentItem =
  NotificationItems["notificationsComment"][number];
export type NotificationCommentLikeItem =
  NotificationItems["notificationsCommentLike"][number];
export type NotificationFollowPendingItem =
  NotificationItems["notificationsFollowPending"][number];
export type NotificationFollowAcceptedItem =
  NotificationItems["notificationsFollowAccepted"][number];

const notificationsPollLikeSelect = {
  pollLike: {
    select: {
      poll: { select: { id: true, title: true } },
      author: { select: { id: true, username: true } },
    },
  },
};

export async function getNotificationsPollLikeRelation(notificationId: string) {
  try {
    return await db.notificationPollLike.findUnique({
      where: { id: notificationId },
      select: notificationsPollLikeSelect,
    });
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

const notificationsCommentSelect = {
  comment: {
    select: {
      author: { select: { id: true, username: true } },
      parent: { select: { id: true, text: true } },
      poll: { select: { id: true, title: true } },
    },
  },
};

export async function getNotificationsCommentRelation(notificationId: string) {
  try {
    return await db.notificationComment.findUnique({
      where: { id: notificationId },
      select: notificationsCommentSelect,
    });
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

const notificationsCommentLikeSelect = {
  commentLike: {
    select: {
      author: { select: { id: true, username: true } },
      comment: {
        select: {
          id: true,
          text: true,
          poll: { select: { id: true, title: true } },
        },
      },
    },
  },
};

export async function getNotificationsCommentLikeRelation(
  notificationId: string,
) {
  try {
    return await db.notificationCommentLike.findUnique({
      where: { id: notificationId },
      select: notificationsCommentLikeSelect,
    });
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

const notificationsFollowPendingSelect = {
  follow: {
    select: {
      follower: {
        select: { id: true, username: true, imageUrl: true },
      },
    },
  },
};

export async function getNotificationsFollowPendingRelation(
  notificationId: string,
) {
  try {
    return await db.notificationFollowPending.findUnique({
      where: { id: notificationId },
      select: notificationsFollowPendingSelect,
    });
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

const notificationsFollowAcceptedSelect = {
  follow: {
    select: {
      followee: {
        select: { id: true, username: true, imageUrl: true },
      },
    },
  },
};

export async function getNotificationsFollowAcceptedRelation(
  notificationId: string,
) {
  try {
    return await db.notificationFollowAccepted.findUnique({
      where: { id: notificationId },
      select: notificationsFollowAcceptedSelect,
    });
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function getNotificationsItems() {
  const { userId } = auth();
  if (!userId) return null;

  try {
    const userNotifications = await db.user.findUnique({
      where: { id: userId },
      include: {
        notificationsPollLike: {
          include: notificationsPollLikeSelect,
        },
        notificationsComment: {
          include: notificationsCommentSelect,
        },
        notificationsCommentLike: {
          include: notificationsCommentLikeSelect,
        },
        notificationsFollowPending: {
          include: notificationsFollowPendingSelect,
        },
        notificationsFollowAccepted: {
          include: notificationsFollowAcceptedSelect,
        },
      },
    });

    if (!userNotifications) return null;

    return userNotifications;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

export async function removeNotifications({
  ids,
  type,
}: {
  ids: string[];
  type: NotificationType;
}) {
  try {
    switch (type) {
      case "PollLikeNotification":
        return await db.notificationPollLike.deleteMany({
          where: { id: { in: ids } },
        });

      case "FollowPendingNotification":
        return await db.notificationFollowPending.deleteMany({
          where: { id: { in: ids } },
        });

      case "FollowAcceptedNotification":
        return await db.notificationFollowAccepted.deleteMany({
          where: { id: { in: ids } },
        });

      case "CommentNotification":
        return await db.notificationComment.deleteMany({
          where: { id: { in: ids } },
        });

      case "CommentLikeNotification":
        return await db.notificationCommentLike.deleteMany({
          where: { id: { in: ids } },
        });

      default:
        throw new Error("Unknown notification type");
    }
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}
