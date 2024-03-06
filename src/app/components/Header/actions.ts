"use server";

import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";

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

const notificationsPollLikeInclude = {
  pollLike: {
    include: {
      poll: { select: { id: true } },
      author: { select: { imageUrl: true, username: true } },
    },
  },
};

export async function getNotificationsPollLikeRelation(notificationId: string) {
  return await db.notificationPollLike.findUnique({
    where: { id: notificationId },
    include: notificationsPollLikeInclude,
  });
}

const notificationsCommentInclude = {
  comment: {
    include: { author: true },
  },
};

export async function getNotificationsCommentRelation(notificationId: string) {
  return await db.notificationComment.findUnique({
    where: { id: notificationId },
    include: notificationsCommentInclude,
  });
}

const notificationsCommentLikeInclude = {
  commentLike: {
    include: {
      author: true,
      comment: { select: { id: true, pollId: true } },
    },
  },
};

export async function getNotificationsCommentLikeRelation(
  notificationId: string,
) {
  return await db.notificationCommentLike.findUnique({
    where: { id: notificationId },
    include: notificationsCommentLikeInclude,
  });
}

const notificationsFollowPendingInclude = {
  follow: {
    include: { follower: true },
  },
};

export async function getNotificationsFollowPendingRelation(
  notificationId: string,
) {
  return await db.notificationFollowPending.findUnique({
    where: { id: notificationId },
    include: notificationsFollowPendingInclude,
  });
}

const notificationsFollowAcceptedInclude = {
  follow: {
    include: { followed: true },
  },
};

export async function getNotificationsFollowAcceptedRelation(
  notificationId: string,
) {
  return await db.notificationFollowAccepted.findUnique({
    where: { id: notificationId },
    include: notificationsFollowAcceptedInclude,
  });
}

export async function getNotificationsItems() {
  const { userId } = auth();

  if (!userId) return null;

  const userNotifications = await db.user.findUnique({
    where: { id: userId },
    include: {
      notificationsPollLike: {
        include: notificationsPollLikeInclude,
      },
      notificationsComment: {
        include: notificationsCommentInclude,
      },
      notificationsCommentLike: {
        include: notificationsCommentLikeInclude,
      },
      notificationsFollowPending: {
        include: notificationsFollowPendingInclude,
      },
      notificationsFollowAccepted: {
        include: notificationsFollowAcceptedInclude,
      },
    },
  });

  if (!userNotifications) return null;

  return userNotifications;
}

export async function removeNotification({
  id,
  type,
}: {
  id: string;
  type: NotificationType;
}) {
  switch (type) {
    case "PollLikeNotification":
      return await db.notificationPollLike.deleteMany({
        where: { id },
      });

    case "FollowPendingNotification":
      return await db.notificationFollowPending.deleteMany({
        where: { id },
      });

    case "FollowAcceptedNotification":
      return await db.notificationFollowAccepted.deleteMany({
        where: { id },
      });

    case "CommentNotification":
      return await db.notificationComment.deleteMany({
        where: { id },
      });

    case "CommentLikeNotification":
      return await db.notificationCommentLike.deleteMany({
        where: { id },
      });

    default:
      throw new Error("Unknown notification type");
  }
}
