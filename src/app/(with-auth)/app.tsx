"use client";

import Script from "next/script";
import GlobalLoading from "../loading";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { QueryProvider } from "./_providers/QueryProvider";
import { getUserSettings } from "./actions";
import { CSPostHogProvider } from "./_providers/PosthogProvider";
import { useCustomScrollbar } from "../hooks/useCustomScrollbar";
import { getNotificationsItems } from "../components/Header/actions";
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

type BlockedUser = NonNullable<
  Awaited<ReturnType<typeof getUserSettings>>
>["blockerUsers"][0]["blockee"];

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
  const { user } = useUser();

  const [key, setKey] = useState<string>(Math.random().toString());

  const [ads, setAds] = useState(true);

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

  const isUserBlocked = (userId: string) =>
    blockedUsers.some((user) => user.id === userId);

  const [notifications, setNotifications] = useState<Notifications>({
    pollLikes: [],
    comments: [],
    commentLikes: [],
    followsPending: [],
    followsAccepted: [],
  });

  useCustomScrollbar();
  useRealtimeNotifications({ setNotifications, isUserBlocked });

  // Init user
  useEffect(() => {
    async function init() {
      if (!user?.id) return;

      // Get user settings
      const userSettings = await getUserSettings(user.id);
      if (!userSettings) {
        toast.error("Failed to get user settings");
        return;
      }
      setBlockedUsers(userSettings.blockerUsers.map((u) => u.blockee));
      if (userSettings.tier === "FREE") setAds(true);
      else setAds(false);

      // Get notifications
      const notifications = await getNotificationsItems();
      if (notifications) {
        setNotifications({
          pollLikes: notifications.notificationsPollLike.filter(
            (notification) => !isUserBlocked(notification.pollLike.author.id),
          ),
          comments: notifications.notificationsComment.filter(
            (notification) => !isUserBlocked(notification.comment.author.id),
          ),
          commentLikes: notifications.notificationsCommentLike.filter(
            (notification) =>
              !isUserBlocked(notification.commentLike.author.id),
          ),
          followsPending: notifications.notificationsFollowPending.filter(
            (notification) => !isUserBlocked(notification.follow.follower.id),
          ),
          followsAccepted: notifications.notificationsFollowAccepted.filter(
            (notification) => !isUserBlocked(notification.follow.followee.id),
          ),
        });
      }
    }

    void init();
  }, [user, key]);

  // Remove blocked users from notifications
  useEffect(() => {
    // Check if notifications exist from blocked users
    const hasBlockedNotifications = (notifications: Notifications): boolean =>
      notifications.pollLikes.some((notification) =>
        isUserBlocked(notification.pollLike.author.id),
      ) ||
      notifications.comments.some((notification) =>
        isUserBlocked(notification.comment.author.id),
      ) ||
      notifications.commentLikes.some((notification) =>
        isUserBlocked(notification.commentLike.author.id),
      ) ||
      notifications.followsPending.some((notification) =>
        isUserBlocked(notification.follow.follower.id),
      ) ||
      notifications.followsAccepted.some((notification) =>
        isUserBlocked(notification.follow.followee.id),
      );

    if (!hasBlockedNotifications(notifications)) return;

    // Remove blocked users from notifications
    setNotifications((prev) => ({
      ...prev,
      pollLikes: prev.pollLikes.filter(
        (notification) => !isUserBlocked(notification.pollLike.author.id),
      ),
      comments: prev.comments.filter(
        (notification) => !isUserBlocked(notification.comment.author.id),
      ),
      commentLikes: prev.commentLikes.filter(
        (notification) => !isUserBlocked(notification.commentLike.author.id),
      ),
      followsPending: prev.followsPending.filter(
        (notification) => !isUserBlocked(notification.follow.follower.id),
      ),
      followsAccepted: prev.followsAccepted.filter(
        (notification) => !isUserBlocked(notification.follow.followee.id),
      ),
    }));
  }, [notifications, blockedUsers]);

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
            isUserBlocked,
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
