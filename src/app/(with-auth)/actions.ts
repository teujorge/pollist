"use server";

import apn from "apn";
import { db } from "@/server/prisma";
import { auth } from "@clerk/nextjs/server";
import { handlePrismaError } from "@/server/error";
import {
  groupedCommentLikes,
  groupedComments,
  groupedFollowAccepted,
  groupedFollowPending,
  groupedPollLikes,
  notificationsCommentLikeSelect,
  notificationsCommentSelect,
  notificationsFollowAcceptedSelect,
  notificationsFollowPendingSelect,
  notificationsPollLikeSelect,
} from "../components/Header/utils";
import type { SubTier } from "@prisma/client";
import type { Notifications } from "./app";

export async function getUserSettings() {
  const { userId: myId } = auth();

  if (!myId) {
    return {
      ads: true,
      tier: "FREE" as SubTier,
      private: false,
      viewSensitive: false,
      deviceToken: null,
      blockerUsers: [],
      appleTransaction: null,
    };
  }

  try {
    return await db.user.findUnique({
      where: { id: myId },
      select: {
        ads: true,
        tier: true,
        private: true,
        viewSensitive: true,
        deviceToken: true,
        blockerUsers: {
          select: {
            blockee: {
              select: { id: true, username: true, imageUrl: true },
            },
          },
        },
        appleTransaction: true,
      },
    });
  } catch (e) {
    throw new Error(handlePrismaError(e));
  }
}

export async function updateUserDeviceToken(
  userId: string,
  deviceToken: string,
) {
  const { userId: myId } = auth();
  if (!myId || myId !== userId) throw new Error("Unauthorized");

  try {
    return await db.user.update({
      where: { id: userId },
      data: { deviceToken },
    });
  } catch (e) {
    throw new Error(handlePrismaError(e));
  }
}

export async function sendAPN({
  userId,
  title,
  body,
}: {
  userId: string;
  title: string;
  body: string;
}) {
  const { userId: myId } = auth();
  if (!myId) throw new Error("Unauthorized");

  const apnProvider = new apn.Provider({
    token: {
      key: Buffer.from(process.env.APNS_KEY!, "base64").toString("ascii"),
      keyId: process.env.APNS_KEY_ID!,
      teamId: process.env.APNS_TEAM_ID!,
    },
    production: process.env.NODE_ENV === "production",
  });

  try {
    const recipientUser = await db.user.findUnique({
      where: { id: userId },
      select: {
        deviceToken: true,
        blockerUsers: { where: { blockeeId: myId } },
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

    if (!recipientUser?.deviceToken) return;
    if (recipientUser.blockerUsers.length > 0) return;

    const _notifications: Notifications = {
      pollLikes: recipientUser.notificationsPollLike,
      comments: recipientUser.notificationsComment,
      commentLikes: recipientUser.notificationsCommentLike,
      followsPending: recipientUser.notificationsFollowPending,
      followsAccepted: recipientUser.notificationsFollowAccepted,
    };

    const notificationCount =
      groupedPollLikes(_notifications).length +
      groupedComments(_notifications).length +
      groupedCommentLikes(_notifications).length +
      groupedFollowPending(_notifications).length +
      groupedFollowAccepted(_notifications).length;

    const notification = new apn.Notification();
    notification.alert = { title, body };
    notification.sound = "default";
    notification.badge = notificationCount;
    notification.topic = process.env.APNS_BUNDLE_ID!;

    await apnProvider.send(notification, recipientUser.deviceToken);
  } catch (e) {
    console.error("Error sending APN notification:", e);
  }

  apnProvider.shutdown();
}

export async function silentlyUpdateAPN() {
  // const { userId: myId } = auth();
  // if (!myId) throw new Error("Unauthorized");
  // try {
  //   const user = await db.user.findUnique({
  //     where: { id: myId },
  //     select: {
  //       deviceToken: true,
  //       _count: {
  //         select: {
  //           notificationsComment: true,
  //           notificationsCommentLike: true,
  //           notificationsFollowAccepted: true,
  //           notificationsFollowPending: true,
  //           notificationsPollLike: true,
  //         },
  //       },
  //     },
  //   });
  //   if (!user?.deviceToken) return;
  //   const notificationCount = Object.values(user._count).reduce(
  //     (acc, count) => acc + count,
  //     0,
  //   );
  //   const silentNotification = new apn.Notification();
  //   silentNotification.aps["content-available"] = 1;
  //   silentNotification.badge = notificationCount;
  //   silentNotification.topic = process.env.APNS_BUNDLE_ID!;
  //   console.log("silentNotification", silentNotification);
  //   const apnProvider = new apn.Provider({
  //     token: {
  //       key: Buffer.from(process.env.APNS_KEY!, "base64").toString("ascii"),
  //       keyId: process.env.APNS_KEY_ID!,
  //       teamId: process.env.APNS_TEAM_ID!,
  //     },
  //     production: process.env.NODE_ENV === "production",
  //   });
  //   await apnProvider.send(silentNotification, user.deviceToken);
  //   apnProvider.shutdown();
  // } catch (e) {
  //   console.error("Error sending silent APN notification:", e);
  // }
}
