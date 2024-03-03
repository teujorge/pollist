"use client";

import Script from "next/script";
import GlobalLoading from "./loading";
import { Header } from "./components/Header/Header";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/database/dbRealtime";
import { Analytics } from "@vercel/analytics/react";
import { getAnonUser } from "./api/anon/actions";
import { getNotificationsItems } from "./components/Header/actions";
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
  NotificationCommentItem,
  NotificationCommentLikeItem,
  NotificationFollowPendingItem,
  NotificationFollowAcceptedItem,
} from "./components/Header/actions";

type UserData = {
  userId: string | undefined;
  isAnon: boolean;
  loading: boolean;
  notifications: {
    comments: NotificationCommentItem[];
    commentLikes: NotificationCommentLikeItem[];
    followsPending: NotificationFollowPendingItem[];
    followsAccepted: NotificationFollowAcceptedItem[];
  };
};

type AppProviderValue = UserData & {
  setHasNotifications: (hasNotification: boolean) => void;
};

export function App({ children }: { children: React.ReactNode }) {
  useCustomScrollbar();

  const notificationsSubscriptionRef = useRef<RealtimeChannel>();

  const { user } = useUser();

  const [userId, setUserId] = useState<string | undefined>();

  const [userData, setUserStatus] = useState<UserData>({
    userId: undefined,
    isAnon: true,
    loading: true,
    notifications: {
      comments: [],
      commentLikes: [],
      followsPending: [],
      followsAccepted: [],
    },
  });

  useEffect(() => {
    async function initUserId() {
      const id = (await getAnonUser())?.id;
      if (id) setUserId(id);
    }
    void initUserId();
  }, []);

  useEffect(() => {
    function handleOnNotificationInsert({
      type,
      payload,
    }: {
      type: keyof UserData["notifications"];
      payload: Record<string, string>;
    }) {
      console.log("Notification inserted:", type, payload);
      setUserStatus((prev) => {
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            [type]: [
              ...(prev.notifications[type] ?? []),
              { ...payload, createdAt: new Date() },
            ],
          },
        };
      });
    }

    function handleOnNotificationUpdate({
      type,
      payload,
    }: {
      type: keyof UserData["notifications"];
      payload: Record<string, string>;
    }) {
      console.log("Notification updated:", type, payload);
      setUserStatus((prev) => {
        const updatedNotifications = prev.notifications[type].map(
          (notification) =>
            notification.id === payload.id
              ? { ...notification, ...payload }
              : notification,
        );
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            [type]: updatedNotifications,
          },
        };
      });
    }

    function handleOnNotificationDelete({
      type,
      payload,
    }: {
      type: keyof UserData["notifications"];
      payload: Record<string, string>;
    }) {
      console.log("Notification deleted:", type, payload);
      setUserStatus((prev) => {
        const updatedNotifications = prev.notifications[type].filter(
          (notification) => notification.id !== payload.id,
        );
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            [type]: updatedNotifications,
          },
        };
      });
    }

    async function handleInitNotifications() {
      if (!user) return;

      // get initial notifications
      const notifications = await getNotificationsItems();
      console.log("Initial notifications:", notifications);

      if (notifications) {
        setUserStatus((prev) => ({
          ...prev,
          notifications: {
            comments: notifications.notificationsComment,
            commentLikes: notifications.notificationsCommentLike,
            followsPending: notifications.notificationsFollowPending,
            followsAccepted: notifications.notificationsFollowAccepted,
          },
        }));
      }

      // notification subscription for subsequent changes
      notificationsSubscriptionRef.current = supabase
        ?.channel(`${user.id}-notifications`)
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

            handleOnNotificationInsert({
              type: "comments",
              payload: newPayload,
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

            handleOnNotificationUpdate({
              type: "comments",
              payload: newPayload,
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

            handleOnNotificationInsert({
              type: "commentLikes",
              payload: newPayload,
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

            handleOnNotificationUpdate({
              type: "commentLikes",
              payload: newPayload,
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

            handleOnNotificationInsert({
              type: "followsPending",
              payload: newPayload,
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

            handleOnNotificationUpdate({
              type: "followsPending",
              payload: newPayload,
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

            handleOnNotificationInsert({
              type: "followsAccepted",
              payload: newPayload,
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

            handleOnNotificationUpdate({
              type: "followsAccepted",
              payload: newPayload,
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

    if (user) {
      console.log("setting user:", user);
      setUserStatus({
        userId: user.id,
        isAnon: false,
        loading: false,
        notifications: {
          comments: [],
          commentLikes: [],
          followsPending: [],
          followsAccepted: [],
        },
      });
    } else {
      console.log("setting anon user");
      setUserStatus({
        userId: userId,
        isAnon: true,
        loading: false,
        notifications: {
          comments: [],
          commentLikes: [],
          followsPending: [],
          followsAccepted: [],
        },
      });
    }

    void handleInitNotifications();

    return () => void notificationsSubscriptionRef.current?.unsubscribe();
  }, [user, userId]);

  useEffect(() => {
    console.log("notifications changed", userData.notifications);
  }, [userData.notifications]);

  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <AppProvider
      value={{
        ...userData,
        setHasNotifications: (hasNotifications: boolean) =>
          setUserStatus((prev) => ({ ...prev, hasNotifications })),
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
      <Header userId={userData.userId} />
      {userData.loading ? <GlobalLoading /> : memoizedChildren}
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
