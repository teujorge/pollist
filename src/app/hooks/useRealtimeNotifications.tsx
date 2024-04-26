import { useUser } from "@clerk/nextjs";
import { supabase } from "@/server/supabase";
import { useEffect, useRef } from "react";
import {
  getNotificationsItems,
  getNotificationsCommentRelation,
  getNotificationsPollLikeRelation,
  getNotificationsCommentLikeRelation,
  getNotificationsFollowPendingRelation,
  getNotificationsFollowAcceptedRelation,
} from "../components/Header/actions";
import type { Notifications } from "../(with-auth)/app";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function useRealtimeNotifications({
  isUserBlocked,
  setNotifications,
}: {
  isUserBlocked: (userId: string) => boolean;
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
                if (isUserBlocked(payloadRelations?.pollLike?.author?.id ?? ""))
                  return;

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
                if (isUserBlocked(payloadRelations?.pollLike?.author?.id ?? ""))
                  return;

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
            const newPayload: Record<string, string> = payload.new;

            if (!newPayload.id) return;

            getNotificationsCommentRelation(newPayload.id)
              .then((payloadRelations) => {
                if (isUserBlocked(payloadRelations?.comment?.author?.id ?? ""))
                  return;

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
                if (isUserBlocked(payloadRelations?.comment?.author?.id ?? ""))
                  return;

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
                if (
                  isUserBlocked(payloadRelations?.commentLike?.author?.id ?? "")
                )
                  return;

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
                if (
                  isUserBlocked(payloadRelations?.commentLike?.author?.id ?? "")
                )
                  return;

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
                if (isUserBlocked(payloadRelations?.follow?.follower?.id ?? ""))
                  return;

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
                if (isUserBlocked(payloadRelations?.follow?.follower?.id ?? ""))
                  return;

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
                if (isUserBlocked(payloadRelations?.follow?.followee?.id ?? ""))
                  return;

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
                if (isUserBlocked(payloadRelations?.follow?.followee?.id ?? ""))
                  return;

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

        .subscribe();
    }

    setNotifications({
      pollLikes: [],
      comments: [],
      commentLikes: [],
      followsPending: [],
      followsAccepted: [],
    });

    void handleInitNotifications();

    return () => void notificationsSubscriptionRef.current?.unsubscribe();
  }, [user]);
}
