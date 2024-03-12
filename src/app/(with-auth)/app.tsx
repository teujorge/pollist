"use client";

import Script from "next/script";
import { useUser } from "@clerk/nextjs";
import { useCustomScrollbar } from "../hooks/useCustomScrollbar";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState, useContext, createContext } from "react";
import type {
  NotificationPollLikeItem,
  NotificationCommentItem,
  NotificationCommentLikeItem,
  NotificationFollowPendingItem,
  NotificationFollowAcceptedItem,
} from "../components/Header/actions";

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

  useRealtimeNotifications({ setNotifications });

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
      {memoizedChildren}
    </AppProvider>
  );
}

const AppContext = createContext<AppProviderValue | undefined>(undefined);

type AppProviderProps = {
  value: AppProviderValue;
  children: React.ReactNode;
};

const queryClient = new QueryClient();

function AppProvider({ value, children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </QueryClientProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
