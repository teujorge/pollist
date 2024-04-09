"use client";

import Script from "next/script";
import GlobalLoading from "../loading";
import { useUser } from "@clerk/nextjs";
import { getUserTier } from "./actions";
import { QueryProvider } from "./QueryProvider";
import { useCustomScrollbar } from "../hooks/useCustomScrollbar";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";
import {
  useState,
  useContext,
  createContext,
  useEffect,
  Suspense,
} from "react";
import type {
  NotificationPollLikeItem,
  NotificationCommentItem,
  NotificationCommentLikeItem,
  NotificationFollowPendingItem,
  NotificationFollowAcceptedItem,
} from "@/app/components/Header/actions";

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

  const [showAds, setShowAds] = useState(true);

  const [notifications, setNotifications] = useState<Notifications>({
    pollLikes: [],
    comments: [],
    commentLikes: [],
    followsPending: [],
    followsAccepted: [],
  });

  useRealtimeNotifications({ setNotifications });

  useEffect(() => {
    if (!user?.id) return;

    void getUserTier(user.id).then((tier) => {
      if (tier === "FREE") setShowAds(true);
      else setShowAds(false);
    });
  }, [user]);

  return (
    <QueryProvider>
      <AppProvider value={{ notifications, setNotifications }}>
        {showAds && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6132246468312218"
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
        <Suspense fallback={<GlobalLoading />}>{children}</Suspense>
      </AppProvider>
    </QueryProvider>
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
