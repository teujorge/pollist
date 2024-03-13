"use client";

import { useUser } from "@clerk/nextjs";
import { supabase } from "@/database/supabase";
import { useEffect, useRef } from "react";
import {
  getNotificationsCommentLikeRelation,
  getNotificationsCommentRelation,
  getNotificationsFollowAcceptedRelation,
  getNotificationsFollowPendingRelation,
  getNotificationsItems,
  getNotificationsPollLikeRelation,
} from "../components/Header/actions";
import type { Notifications } from "../(with-auth)/app";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function useRealtimeNotifications({
  setNotifications,
}: {
  setNotifications: React.Dispatch<React.SetStateAction<Notifications>>;
}) {
  const { user } = useUser();
  const notificationsSubscriptionRef = useRef<RealtimeChannel>();

  useEffect(() => {
    if (!user) return;

    function handleOnNotificationInsert({
      type,
      payload,
    }: {
      type: keyof Notifications;
      payload: Record<string, string>;
    }) {
      console.log("Notification inserted:", type, payload);
      setNotifications((prev) => {
        return {
          ...prev,
          [type]: [...prev[type], payload],
        };
      });
    }

    function handleOnNotificationUpdate({
      type,
      payload,
    }: {
      type: keyof Notifications;
      payload: Record<string, string>;
    }) {
      console.log("Notification updated:", type, payload);
      setNotifications((prev) => {
        const updatedNotifications = prev[type].map((notification) =>
          notification.id === payload.id
            ? { ...notification, ...payload }
            : notification,
        );
        return {
          ...prev,
          [type]: updatedNotifications,
        };
      });
    }

    function handleOnNotificationDelete({
      type,
      payload,
    }: {
      type: keyof Notifications;
      payload: Record<string, string>;
    }) {
      console.log("Notification deleted:", type, payload);
      setNotifications((prev) => {
        const updatedNotifications = prev[type].filter(
          (notification) => notification.id !== payload.id,
        );
        return {
          ...prev,
          [type]: updatedNotifications,
        };
      });
    }

    async function handleInitNotifications() {
      if (!user) return;

      // get initial notifications
      const notifications = await getNotificationsItems();
      console.log("Initial notifications:", notifications);

      if (notifications) {
        setNotifications({
          pollLikes: notifications.notificationsPollLike,
          comments: notifications.notificationsComment,
          commentLikes: notifications.notificationsCommentLike,
          followsPending: notifications.notificationsFollowPending,
          followsAccepted: notifications.notificationsFollowAccepted,
        });
      }

      // notification subscription for subsequent changes
      notificationsSubscriptionRef.current = supabase
        ?.channel(`${user.id}-notifications`)
        // === NotificationPollLike ===
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "NotificationPollLike",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload: Record<string, string> = payload.new;

            if (!newPayload.id) return;

            getNotificationsPollLikeRelation(newPayload.id)
              .then((payloadRelations) => {
                handleOnNotificationInsert({
                  type: "pollLikes",
                  payload: {
                    ...newPayload,
                    ...(payloadRelations as unknown as Record<string, string>),
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationPollLike relations:",
                  error,
                );
              });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "NotificationPollLike",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload: Record<string, string> = payload.new;

            if (!newPayload.id) return;

            getNotificationsPollLikeRelation(newPayload.id)
              .then((payloadRelations) => {
                handleOnNotificationUpdate({
                  type: "pollLikes",
                  payload: {
                    ...newPayload,
                    ...(payloadRelations as unknown as Record<string, string>),
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationPollLike relations:",
                  error,
                );
              });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "NotificationPollLike",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const oldPayload: Record<string, string> = payload.old;

            handleOnNotificationDelete({
              type: "pollLikes",
              payload: oldPayload,
            });
          },
        )

        // === NotificationComment ===
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "NotificationComment",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            console.log("NotificationComment inserted:", payload);
            const newPayload: Record<string, string> = payload.new;

            if (!newPayload.id) return;

            getNotificationsCommentRelation(newPayload.id)
              .then((payloadRelations) => {
                handleOnNotificationInsert({
                  type: "comments",
                  payload: {
                    ...newPayload,
                    ...(payloadRelations as unknown as Record<string, string>),
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationComment relations:",
                  error,
                );
              });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "NotificationComment",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload: Record<string, string> = payload.new;

            if (!newPayload.id) return;

            getNotificationsCommentRelation(newPayload.id)
              .then((payloadRelations) => {
                handleOnNotificationUpdate({
                  type: "comments",
                  payload: {
                    ...newPayload,
                    ...(payloadRelations as unknown as Record<string, string>),
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationComment relations:",
                  error,
                );
              });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "NotificationComment",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const oldPayload: Record<string, string> = payload.old;

            handleOnNotificationDelete({
              type: "comments",
              payload: oldPayload,
            });
          },
        )

        // === NotificationCommentLike ===
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "NotificationCommentLike",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload: Record<string, string> = payload.new;

            if (!newPayload.id) return;

            getNotificationsCommentLikeRelation(newPayload.id)
              .then((payloadRelations) => {
                handleOnNotificationInsert({
                  type: "commentLikes",
                  payload: {
                    ...newPayload,
                    ...(payloadRelations as unknown as Record<string, string>),
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationCommentLike relations:",
                  error,
                );
              });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "NotificationCommentLike",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload: Record<string, string> = payload.new;

            if (!newPayload.id) return;

            getNotificationsCommentLikeRelation(newPayload.id)
              .then((payloadRelations) => {
                handleOnNotificationUpdate({
                  type: "commentLikes",
                  payload: {
                    ...newPayload,
                    ...(payloadRelations as unknown as Record<string, string>),
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationCommentLike relations:",
                  error,
                );
              });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "NotificationCommentLike",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const oldPayload: Record<string, string> = payload.old;

            handleOnNotificationDelete({
              type: "commentLikes",
              payload: oldPayload,
            });
          },
        )

        // === NotificationFollowPending ===
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "NotificationFollowPending",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload: Record<string, string> = payload.new;

            if (!newPayload.id) return;

            getNotificationsFollowPendingRelation(newPayload.id)
              .then((payloadRelations) => {
                handleOnNotificationInsert({
                  type: "followsPending",
                  payload: {
                    ...newPayload,
                    ...(payloadRelations as unknown as Record<string, string>),
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationFollowPending relations:",
                  error,
                );
              });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "NotificationFollowPending",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload: Record<string, string> = payload.new;

            if (!newPayload.id) return;

            getNotificationsFollowPendingRelation(newPayload.id)
              .then((payloadRelations) => {
                handleOnNotificationUpdate({
                  type: "followsPending",
                  payload: {
                    ...newPayload,
                    ...(payloadRelations as unknown as Record<string, string>),
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationFollowPending relations:",
                  error,
                );
              });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "NotificationFollowPending",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const oldPayload: Record<string, string> = payload.old;

            handleOnNotificationDelete({
              type: "followsPending",
              payload: oldPayload,
            });
          },
        )

        // === NotificationFollowAccepted ===
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "NotificationFollowAccepted",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload: Record<string, string> = payload.new;

            if (!newPayload.id) return;

            getNotificationsFollowAcceptedRelation(newPayload.id)
              .then((payloadRelations) => {
                handleOnNotificationInsert({
                  type: "followsAccepted",
                  payload: {
                    ...newPayload,
                    ...(payloadRelations as unknown as Record<string, string>),
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationFollowAccepted relations:",
                  error,
                );
              });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "NotificationFollowAccepted",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload: Record<string, string> = payload.new;

            if (!newPayload.id) return;

            getNotificationsFollowAcceptedRelation(newPayload.id)
              .then((payloadRelations) => {
                handleOnNotificationUpdate({
                  type: "followsAccepted",
                  payload: {
                    ...newPayload,
                    ...(payloadRelations as unknown as Record<string, string>),
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationFollowAccepted relations:",
                  error,
                );
              });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "NotificationFollowAccepted",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const oldPayload: Record<string, string> = payload.old;

            handleOnNotificationDelete({
              type: "followsAccepted",
              payload: oldPayload,
            });
          },
        )

        .subscribe((status, error) => {
          console.log("notifications subscription status:", status, error);
        });
    }

    console.log("resetting user:", user);
    setNotifications({
      pollLikes: [],
      comments: [],
      commentLikes: [],
      followsPending: [],
      followsAccepted: [],
    });

    void handleInitNotifications();

    return () => void notificationsSubscriptionRef.current?.unsubscribe();
  }, [setNotifications, user]);
}
