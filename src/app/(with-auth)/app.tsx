"use client";

import Script from "next/script";
import GlobalLoading from "../loading";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { QueryProvider } from "./_providers/QueryProvider";
import { getUserSettings } from "./actions";
import { CSPostHogProvider } from "./_providers/PosthogProvider";
import { useCustomScrollbar } from "../hooks/useCustomScrollbar";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";
import {
  Suspense,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";
import type {
  NotificationCommentItem,
  NotificationPollLikeItem,
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

type BlockedUser = {
  id: string;
  username: string;
  imageUrl: string | null;
};

type AppProviderValue = {
  key: string;
  setKey: React.Dispatch<React.SetStateAction<string>>;

  ads: boolean;
  setAds: React.Dispatch<React.SetStateAction<boolean>>;

  blockedUsers: BlockedUser[];
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedUser[]>>;
  isUserBlocked: (userId: string) => boolean;

  notifications: Notifications;
  setNotifications: React.Dispatch<React.SetStateAction<Notifications>>;
};

export function App({ children }: { children: React.ReactNode }) {
  useCustomScrollbar();

  const { user } = useUser();

  const [key, setKey] = useState<string>(Math.random().toString());

  const [ads, setAds] = useState(true);

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

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

    void getUserSettings(user.id).then((user) => {
      if (!user) {
        toast.error("Failed to get user settings");
        return;
      }

      setBlockedUsers(user.blockerUsers.map((u) => u.blockee));

      if (user.tier === "FREE") setAds(true);
      else setAds(false);
    });
  }, [user, key]);

  return (
    <CSPostHogProvider>
      <QueryProvider>
        <AppProvider
          value={{
            key,
            setKey,
            ads,
            setAds,
            blockedUsers,
            setBlockedUsers,
            isUserBlocked: (userId) =>
              blockedUsers.some((user) => user.id === userId),
            notifications,
            setNotifications,
          }}
        >
          {ads && (
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
    </CSPostHogProvider>
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
