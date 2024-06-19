import { useUser } from "@clerk/nextjs";
import { supabase } from "@/server/supabase";
import { useEffect, useRef } from "react";
import {
  getNotificationsPollCreatedRelation,
  getNotificationsPollLikeRelation,
  getNotificationsCommentRelation,
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
      payload: Record<string, unknown>;
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
      payload: Record<string, unknown>;
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
      payload: Record<string, unknown>;
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

      // notification subscription for subsequent changes
      notificationsSubscriptionRef.current = supabase
        ?.channel(`${user.id}-notifications`)
        // === NotificationPollCreated ===
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "NotificationPollCreated",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

            getNotificationsPollCreatedRelation(newPayload.id)
              .then((payloadRelations) => {
                if (isUserBlocked(payloadRelations?.poll?.author?.id ?? ""))
                  return;

                handleOnNotificationInsert({
                  type: "pollCreated",
                  payload: {
                    ...newPayload,
                    ...payloadRelations,
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationPollCreated relations:",
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
            table: "NotificationPollCreated",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

            getNotificationsPollCreatedRelation(newPayload.id)
              .then((payloadRelations) => {
                if (isUserBlocked(payloadRelations?.poll?.author?.id ?? ""))
                  return;

                handleOnNotificationUpdate({
                  type: "pollCreated",
                  payload: {
                    ...newPayload,
                    ...payloadRelations,
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Error getting NotificationPollCreated relations:",
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
            table: "NotificationPollCreated",
            filter: `notifyeeId=eq.${user.id}`,
          },
          (payload) => {
            handleOnNotificationDelete({
              type: "pollCreated",
              payload: payload.old,
            });
          },
        )

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
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

            getNotificationsPollLikeRelation(newPayload.id)
              .then((payloadRelations) => {
                if (isUserBlocked(payloadRelations?.pollLike?.author?.id ?? ""))
                  return;

                handleOnNotificationInsert({
                  type: "pollLikes",
                  payload: {
                    ...newPayload,
                    ...payloadRelations,
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
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

            getNotificationsPollLikeRelation(newPayload.id)
              .then((payloadRelations) => {
                if (isUserBlocked(payloadRelations?.pollLike?.author?.id ?? ""))
                  return;

                handleOnNotificationUpdate({
                  type: "pollLikes",
                  payload: {
                    ...newPayload,
                    ...payloadRelations,
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
            handleOnNotificationDelete({
              type: "pollLikes",
              payload: payload.old,
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
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

            getNotificationsCommentRelation(newPayload.id)
              .then((payloadRelations) => {
                if (isUserBlocked(payloadRelations?.comment?.author?.id ?? ""))
                  return;

                handleOnNotificationInsert({
                  type: "comments",
                  payload: {
                    ...newPayload,
                    ...payloadRelations,
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
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

            getNotificationsCommentRelation(newPayload.id)
              .then((payloadRelations) => {
                if (isUserBlocked(payloadRelations?.comment?.author?.id ?? ""))
                  return;

                handleOnNotificationUpdate({
                  type: "comments",
                  payload: {
                    ...newPayload,
                    ...payloadRelations,
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
            handleOnNotificationDelete({
              type: "comments",
              payload: payload.old,
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
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

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
                    ...payloadRelations,
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
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

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
                    ...payloadRelations,
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
            handleOnNotificationDelete({
              type: "commentLikes",
              payload: payload.old,
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
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

            getNotificationsFollowPendingRelation(newPayload.id)
              .then((payloadRelations) => {
                if (isUserBlocked(payloadRelations?.follow?.follower?.id ?? ""))
                  return;

                handleOnNotificationInsert({
                  type: "followsPending",
                  payload: {
                    ...newPayload,
                    ...payloadRelations,
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
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

            getNotificationsFollowPendingRelation(newPayload.id)
              .then((payloadRelations) => {
                if (isUserBlocked(payloadRelations?.follow?.follower?.id ?? ""))
                  return;

                handleOnNotificationUpdate({
                  type: "followsPending",
                  payload: {
                    ...newPayload,
                    ...payloadRelations,
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
            handleOnNotificationDelete({
              type: "followsPending",
              payload: payload.old,
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
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

            getNotificationsFollowAcceptedRelation(newPayload.id)
              .then((payloadRelations) => {
                if (isUserBlocked(payloadRelations?.follow?.followee?.id ?? ""))
                  return;

                handleOnNotificationInsert({
                  type: "followsAccepted",
                  payload: {
                    ...newPayload,
                    ...payloadRelations,
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
            const newPayload = payload.new;

            if (typeof newPayload.id !== "string") return;

            getNotificationsFollowAcceptedRelation(newPayload.id)
              .then((payloadRelations) => {
                if (isUserBlocked(payloadRelations?.follow?.followee?.id ?? ""))
                  return;

                handleOnNotificationUpdate({
                  type: "followsAccepted",
                  payload: {
                    ...newPayload,
                    ...payloadRelations,
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
            handleOnNotificationDelete({
              type: "followsAccepted",
              payload: payload.old,
            });
          },
        )

        .subscribe();
    }

    setNotifications({
      pollLikes: [],
      pollCreated: [],
      comments: [],
      commentLikes: [],
      followsPending: [],
      followsAccepted: [],
    });

    void handleInitNotifications();

    return () => void notificationsSubscriptionRef.current?.unsubscribe();
  }, [user]);
}
