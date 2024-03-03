"use server";

import { db } from "@/database/db";
import { auth } from "@clerk/nextjs";

export type NotificationType =
  | "CommentNotification"
  | "CommentLikeNotification"
  | "FollowPendingNotification"
  | "FollowAcceptedNotification";

type NotificationItems = NonNullable<
  Awaited<ReturnType<typeof getNotificationsItems>>
>;

export type NotificationCommentItem =
  NotificationItems["notificationsComment"][number];
export type NotificationCommentLikeItem =
  NotificationItems["notificationsCommentLike"][number];
export type NotificationFollowPendingItem =
  NotificationItems["notificationsFollowPending"][number];
export type NotificationFollowAcceptedItem =
  NotificationItems["notificationsFollowAccepted"][number];

export async function getNotificationsItems() {
  const { userId } = auth();

  if (!userId) return null;

  const userNotifications = await db.user.findUnique({
    where: { id: userId },
    include: {
      notificationsComment: {
        include: {
          comment: {
            include: { author: true },
          },
        },
      },
      notificationsCommentLike: {
        include: {
          commentLike: {
            include: {
              author: true,
              comment: { select: { pollId: true } },
            },
          },
        },
      },
      notificationsFollowPending: {
        include: {
          follow: {
            include: { follower: true },
          },
        },
      },
      notificationsFollowAccepted: {
        include: {
          follow: {
            include: { followed: true },
          },
        },
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
