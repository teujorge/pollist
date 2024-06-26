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
  notificationsPollCreatedSelect,
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

export async function sendNotification({
  userId,
  title,
  body,
  payload,
}: {
  userId: string;
  title: string;
  body: string;
  payload: Record<string, string> | undefined;
}) {
  try {
    const { userId: myId } = auth();
    if (!myId) throw new Error("Unauthorized");

    const recipientUser = await db.user.findUnique({
      where: { id: userId },
      select: {
        deviceToken: true,
        blockerUsers: { where: { blockeeId: myId } },
        notificationsPollLike: {
          select: notificationsPollLikeSelect,
        },
        notificationsPollCreated: {
          select: notificationsPollCreatedSelect,
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
      pollCreated: recipientUser.notificationsPollCreated,
      comments: recipientUser.notificationsComment,
      commentLikes: recipientUser.notificationsCommentLike,
      followsPending: recipientUser.notificationsFollowPending,
      followsAccepted: recipientUser.notificationsFollowAccepted,
    };

    // Basic check based on typical token length and character set
    if (
      recipientUser.deviceToken.length === 64 &&
      /^[0-9a-fA-F]+$/.test(recipientUser.deviceToken)
    ) {
      // APNs token
      await sendAPN({
        title: title,
        body: body,
        notifications: _notifications,
        deviceToken: recipientUser.deviceToken,
        payload: payload,
      });
    } else if (
      recipientUser.deviceToken.length > 64 &&
      /^[0-9a-zA-Z\-_]+$/.test(recipientUser.deviceToken)
    ) {
      // FCM token
      await sendFCM({
        title,
        body,
        payload,
        deviceToken: recipientUser.deviceToken,
      });
    } else {
      // Invalid token ??
      console.log("Invalid device token", recipientUser.deviceToken);

      // try to send to both...
      await sendAPN({
        title,
        body,
        payload,
        notifications: _notifications,
        deviceToken: recipientUser.deviceToken,
      });
      await sendFCM({
        title,
        body,
        payload,
        deviceToken: recipientUser.deviceToken,
      });
    }
  } catch (e) {
    console.error("Error sending notification:", e);
  }
}

async function sendAPN({
  title,
  body,
  notifications,
  deviceToken,
  payload,
}: {
  title: string;
  body: string;
  notifications: Notifications;
  deviceToken: string;
  payload: Record<string, string> | undefined;
}) {
  const apnProvider = new apn.Provider({
    token: {
      key: Buffer.from(process.env.APNS_KEY!, "base64").toString("ascii"),
      keyId: process.env.APNS_KEY_ID!,
      teamId: process.env.APNS_TEAM_ID!,
    },
    production: process.env.NODE_ENV === "production",
  });

  const notificationCount =
    groupedPollLikes(notifications).length +
    groupedComments(notifications).length +
    groupedCommentLikes(notifications).length +
    groupedFollowPending(notifications).length +
    groupedFollowAccepted(notifications).length;

  const notification = new apn.Notification();
  notification.alert = { title, body };
  notification.sound = "default";
  notification.badge = notificationCount;
  notification.topic = process.env.APNS_BUNDLE_ID!;
  notification.payload = payload;

  try {
    await apnProvider.send(notification, deviceToken);
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

import admin from "firebase-admin";

if (!admin.apps.length) {
  // This check prevents initializing the app multiple times.
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Ensure new lines are correctly interpreted
    }),
  });
}

async function sendFCM({
  title,
  body,
  deviceToken,
  payload,
}: {
  title: string;
  body: string;
  deviceToken: string;
  payload: Record<string, string> | undefined;
}) {
  const message = {
    token: deviceToken,
    notification: {
      title,
      body,
    },
    data: payload,
    android: {
      notification: { sound: "default" },
    },
  };

  console.log("message", message);

  try {
    await admin.messaging().send(message);
  } catch (e) {
    console.error("Error sending FCM notification:", e);
  }
}
