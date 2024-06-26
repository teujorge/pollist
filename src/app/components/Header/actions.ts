"use server";

import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { handlePrismaError } from "@/server/error";
import { silentlyUpdateAPN } from "@/app/(with-auth)/actions";
import {
  notificationsPollCreatedSelect,
  notificationsPollLikeSelect,
  notificationsCommentSelect,
  notificationsCommentLikeSelect,
  notificationsFollowAcceptedSelect,
  notificationsFollowPendingSelect,
} from "./utils";

export type NotificationType =
  | "PollCreatedNotification"
  | "PollLikeNotification"
  | "CommentNotification"
  | "CommentLikeNotification"
  | "FollowPendingNotification"
  | "FollowAcceptedNotification";

type NotificationItems = NonNullable<
  Awaited<ReturnType<typeof getNotificationsItems>>
>;

export type NotificationPollCreatedItem =
  NotificationItems["notificationsPollCreated"][number];
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

export async function getNotificationsPollCreatedRelation(
  notificationId: string,
) {
  try {
    return await db.notificationPollCreated.findUnique({
      where: { id: notificationId },
      select: notificationsPollCreatedSelect,
    });
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}

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
      select: {
        notificationsPollCreated: {
          select: notificationsPollCreatedSelect,
        },
        notificationsPollLike: {
          select: notificationsPollLikeSelect,
        },
        notificationsComment: {
          select: notificationsCommentSelect,
        },
        notificationsCommentLike: {
          select: notificationsCommentLikeSelect,
        },
        notificationsFollowPending: {
          select: notificationsFollowPendingSelect,
        },
        notificationsFollowAccepted: {
          select: notificationsFollowAcceptedSelect,
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
    let batch;

    switch (type) {
      case "PollCreatedNotification":
        batch = await db.notificationPollCreated.deleteMany({
          where: { id: { in: ids } },
        });
        break;

      case "PollLikeNotification":
        batch = await db.notificationPollLike.deleteMany({
          where: { id: { in: ids } },
        });
        break;

      case "FollowPendingNotification":
        batch = await db.notificationFollowPending.deleteMany({
          where: { id: { in: ids } },
        });
        break;

      case "FollowAcceptedNotification":
        batch = await db.notificationFollowAccepted.deleteMany({
          where: { id: { in: ids } },
        });
        break;

      case "CommentNotification":
        batch = await db.notificationComment.deleteMany({
          where: { id: { in: ids } },
        });
        break;

      case "CommentLikeNotification":
        batch = await db.notificationCommentLike.deleteMany({
          where: { id: { in: ids } },
        });
        break;

      default:
        throw new Error("Unknown notification type");
    }
    await silentlyUpdateAPN();
    return batch;
  } catch (error) {
    throw new Error(handlePrismaError(error));
  }
}
