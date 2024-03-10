"use client";

import Script from "next/script";
import dynamic from "next/dynamic";
import { useUser } from "@clerk/nextjs";
import { useCustomScrollbar } from "../hooks/useCustomScrollbar";
import { useMemo, useState, useContext, createContext } from "react";
import type {
  NotificationPollLikeItem,
  NotificationCommentItem,
  NotificationCommentLikeItem,
  NotificationFollowPendingItem,
  NotificationFollowAcceptedItem,
} from "../components/Header/actions";

const NotificationsHandler = dynamic(
  () =>
    import("@/app/components/Header/NotificationsHandler").then(
      (mod) => mod.NotificationsHandler,
    ),
  { ssr: false },
);

export type Notifications = {
  pollLikes: NotificationPollLikeItem[];
  comments: NotificationCommentItem[];
  commentLikes: NotificationCommentLikeItem[];
  followsPending: NotificationFollowPendingItem[];
  followsAccepted: NotificationFollowAcceptedItem[];
};

type AppProviderValue = {
  notifications: Notifications;
  setNotifications: React.Dispatch<React.SetStateAction<Notifications>>;
};

export function App({ children }: { children: React.ReactNode }) {
  useCustomScrollbar();

  const { user } = useUser();

  const [notifications, setNotifications] = useState<Notifications>({
    pollLikes: [],
    comments: [],
    commentLikes: [],
    followsPending: [],
    followsAccepted: [],
  });

  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <AppProvider value={{ notifications, setNotifications }}>
      {(user?.id !== undefined || true) && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6132246468312218"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}
      {user?.id !== undefined && <NotificationsHandler />}
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
