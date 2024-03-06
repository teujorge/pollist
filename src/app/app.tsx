"use client";

import Script from "next/script";
import { Header } from "./components/Header/Header";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/database/dbRealtime";
import { Analytics } from "@vercel/analytics/react";
import {
  getNotificationsItems,
  getNotificationsPollLikeRelation,
  getNotificationsCommentRelation,
  getNotificationsCommentLikeRelation,
  getNotificationsFollowAcceptedRelation,
  getNotificationsFollowPendingRelation,
} from "./components/Header/actions";
import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type {
  NotificationPollLikeItem,
  NotificationCommentItem,
  NotificationCommentLikeItem,
  NotificationFollowPendingItem,
  NotificationFollowAcceptedItem,
} from "./components/Header/actions";

type Notifications = {
  pollLikes: NotificationPollLikeItem[];
  comments: NotificationCommentItem[];
  commentLikes: NotificationCommentLikeItem[];
  followsPending: NotificationFollowPendingItem[];
  followsAccepted: NotificationFollowAcceptedItem[];
};

type AppProviderValue = {
  notifications: Notifications;
  setNotifications: (notifications: Notifications) => void;
};

export function App({ children }: { children: React.ReactNode }) {
  useCustomScrollbar();

  const notificationsSubscriptionRef = useRef<RealtimeChannel>();

  const { user } = useUser();

  const [notifications, setNotifications] = useState<Notifications>({
    pollLikes: [],
    comments: [],
    commentLikes: [],
    followsPending: [],
    followsAccepted: [],
  });

  useEffect(() => {
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
  }, [user]);

  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <AppProvider
      value={{
        notifications,
        setNotifications,
      }}
    >
      {(user?.id !== undefined || true) && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6132246468312218"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}
      <Analytics />
      <Header userId={user?.id} />
      {memoizedChildren}
    </AppProvider>
  );
}

const AppContext = createContext<AppProviderValue | undefined>(undefined);

type AppProviderProps = {
  value: AppProviderValue;
  children: React.ReactNode;
};

function AppProvider({ value, children }: AppProviderProps) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

function useCustomScrollbar() {
  useEffect(() => {
    const isSafariMac = /Macintosh.*Safari/.test(navigator.userAgent);
    if (isSafariMac) return;

    const css = `
      ::-webkit-scrollbar {
        width: 9px;
      }

      ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 10px 10px transparent;
        border-radius: 2rem;
      }

      ::-webkit-scrollbar-thumb {
        min-height: 1.5rem;
        border-radius: 1.5rem;
        box-shadow: inset 0 0 10px 10px #444;
        border: 3px solid transparent;
        transition: all 150ms ease;
      }

      ::-webkit-scrollbar-thumb:hover {
        box-shadow: inset 0 0 10px 10px #666;
        border: 2px solid transparent;
      }

      ::-webkit-scrollbar-button {
        display: none;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    return () => {
      // Cleanup the style element on unmount
      document.head.removeChild(styleSheet);
    };
  }, []);
}
