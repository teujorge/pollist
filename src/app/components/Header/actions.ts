"use server";

import { db } from "@/database/db";
import type { Notification, NotificationType } from "@prisma/client";

export type NotificationItem = {
  type: NotificationType;
  data:
    | FollowPendingNotification
    | FollowAcceptedNotification
    | CommentNotification
    | CommentLikeNotification;
};

export async function getNotificationsItems(
  notifications: Notification[],
): Promise<NotificationItem[]> {
  const groupedNotifications = notifications.reduce<{
    [key in NotificationType]?: string[];
  }>((acc, notification) => {
    const { type, referenceId } = notification;
    if (!acc[type]) acc[type] = [];
    acc[type]?.push(referenceId);
    return acc;
  }, {});
  console.log("Grouped notifications:", groupedNotifications);

  // Construct an array of promises for each notification type and its IDs
  const promises = Object.entries(groupedNotifications).flatMap(([type, ids]) =>
    fetchContentForType(type as NotificationType, ids),
  );

  const content = await Promise.all(promises);
  console.log("Content:", content);

  return content
    .flat()
    .sort(
      (a, b) =>
        new Date(a.data.createdAt).getTime() -
        new Date(b.data.createdAt).getTime(),
    );
}

function fetchContentForType(type: NotificationType, ids: string[]) {
  console.log("Fetching content for type:", type, "with IDs:", ids);

  switch (type) {
    case "FOLLOW_PENDING":
      return wrapWithType(type, findManyFollowPending(ids));

    case "FOLLOW_ACCEPTED":
      return wrapWithType(type, findManyFollowAccepted(ids));

    case "COMMENT_REPLY":
      return wrapWithType(type, findManyCommentReply(ids));

    case "COMMENT_LIKE":
      return wrapWithType(type, findManyCommentLike(ids));
  }
}

async function wrapWithType(
  type: NotificationType,
  promise: Promise<NotificationItem["data"][]>,
): Promise<NotificationItem[]> {
  const data = await promise;
  return data.map((item) => ({
    type,
    data: item,
  }));
}

export type FollowPendingNotification = Awaited<
  ReturnType<typeof findManyFollowPending>
>[number];

export type FollowAcceptedNotification = Awaited<
  ReturnType<typeof findManyFollowAccepted>
>[number];

export type CommentNotification = Awaited<
  ReturnType<typeof findManyCommentReply>
>[number];

export type CommentLikeNotification = Awaited<
  ReturnType<typeof findManyCommentLike>
>[number];

const findManyFollowPending = (ids: string[]) =>
  db.follow.findMany({
    where: { id: { in: ids } },
    include: {
      follower: true,
    },
  });

const findManyFollowAccepted = (ids: string[]) =>
  db.follow.findMany({
    where: { id: { in: ids } },
    include: {
      followed: true,
    },
  });

const findManyCommentReply = (ids: string[]) =>
  db.comment.findMany({
    where: { id: { in: ids } },
    include: {
      author: true,
    },
  });

const findManyCommentLike = (ids: string[]) =>
  db.commentLike.findMany({
    where: { id: { in: ids } },
    include: {
      author: {
        select: {
          imageUrl: true,
          username: true,
        },
      },
      comment: {
        select: {
          pollId: true,
        },
      },
    },
  });
