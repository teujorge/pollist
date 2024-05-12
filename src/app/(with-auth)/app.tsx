"use client";

import Script from "next/script";
import GlobalLoading from "../loading";
import { toast } from "sonner";
import { QueryProvider } from "./_providers/QueryProvider";
import { CSPostHogProvider } from "./_providers/PosthogProvider";
import { useCustomScrollbar } from "../hooks/useCustomScrollbar";
import { getNotificationsItems } from "../components/Header/actions";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";
import { ClerkLoaded, ClerkLoading, useUser } from "@clerk/nextjs";
import { getUserSettings, updateUserDeviceToken } from "./actions";
import {
  Suspense,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";
import type { AppleTransaction, SubTier } from "@prisma/client";
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

type UserSettings = {
  ads: boolean;
  tier: SubTier;
  private: boolean;
  viewSensitive: boolean;
  blockedUsers: BlockedUser[];
  appleTransaction?: AppleTransaction;
};

type AppProviderValue = {
  // re-render app
  key: string;
  setKey: React.Dispatch<React.SetStateAction<string>>;

  // user settings
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  // helpers
  setAds: React.Dispatch<React.SetStateAction<boolean>>;
  setTier: React.Dispatch<React.SetStateAction<SubTier>>;
  setPrivate: React.Dispatch<React.SetStateAction<boolean>>;
  setViewSensitive: React.Dispatch<React.SetStateAction<boolean>>;
  setBlockedUsers: React.Dispatch<React.SetStateAction<BlockedUser[]>>;
  isUserBlocked: (userId: string) => boolean;

  // notifications
  notifications: Notifications;
  setNotifications: React.Dispatch<React.SetStateAction<Notifications>>;
};

export function App({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  const [key, setKey] = useState<string>(Math.random().toString());

  const [notifications, setNotifications] = useState<Notifications>({
    pollLikes: [],
    comments: [],
    commentLikes: [],
    followsPending: [],
    followsAccepted: [],
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    ads: true,
    tier: "FREE",
    private: false,
    viewSensitive: false,
    blockedUsers: [],
    appleTransaction: undefined,
  });

  const setAds = (update: boolean | ((prevAds: boolean) => boolean)) =>
    setUserSettings((prev) => ({
      ...prev,
      ads: typeof update === "function" ? update(prev.ads) : update,
    }));

  const setTier = (update: SubTier | ((prevTier: SubTier) => SubTier)) =>
    setUserSettings((prev) => ({
      ...prev,
      tier: typeof update === "function" ? update(prev.tier) : update,
    }));

  const setPrivate = (update: boolean | ((prevPrivate: boolean) => boolean)) =>
    setUserSettings((prev) => ({
      ...prev,
      private: typeof update === "function" ? update(prev.private) : update,
    }));

  const setViewSensitive = (
    update: boolean | ((prevViewSensitive: boolean) => boolean),
  ) =>
    setUserSettings((prev) => ({
      ...prev,
      viewSensitive:
        typeof update === "function" ? update(prev.viewSensitive) : update,
    }));

  const setBlockedUsers = (
    update:
      | BlockedUser[]
      | ((prevBlockedUsers: BlockedUser[]) => BlockedUser[]),
  ) =>
    setUserSettings((prev) => ({
      ...prev,
      blockedUsers:
        typeof update === "function" ? update(prev.blockedUsers) : update,
    }));

  const isUserBlocked = useCallback(
    (userId: string) =>
      userSettings.blockedUsers.some((user) => user.id === userId),
    [userSettings.blockedUsers],
  );

  useCustomScrollbar();
  useRealtimeNotifications({ setNotifications, isUserBlocked });

  // Init user
  useEffect(() => {
    console.log("useEffect -> init user");

    async function init() {
      console.log("Init user");
      if (!user) return;
      console.log("Init user:", user);

      // Get user settings
      const settings = await getUserSettings();
      console.log("Init user settings:", settings);
      if (!settings) {
        toast.error("Failed to get user settings");
        return;
      }

      // Set user settings
      setUserSettings({
        ads: settings.ads,
        tier: settings.tier,
        private: settings.private,
        viewSensitive: settings.viewSensitive,
        blockedUsers: settings.blockerUsers.map((u) => u.blockee),
        appleTransaction: settings.appleTransaction ?? undefined,
      });

      // Get notifications
      const notifications = await getNotificationsItems();
      console.log("Init user notifications:", notifications);
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

      // Ensure deviceToken is up to date
      const currentDeviceToken = localStorage.getItem("deviceToken");
      if (
        currentDeviceToken !== null &&
        currentDeviceToken !== settings.deviceToken
      ) {
        updateUserDeviceToken(user.id, currentDeviceToken)
          .then((user) => {
            console.log("Device token updated:", user);
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }

    init().catch((e) => {
      console.error(e);
      toast.error("Failed to initialize app");
    });
  }, [user, key]);

  // Remove blocked users from notifications
  useEffect(() => {
    console.log("useEffect -> blocked users from notifications");

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

    const hasBlockedUsersInNotifications =
      hasBlockedNotifications(notifications);
    console.log(
      "Init user hasBlockedUsersInNotifications",
      hasBlockedUsersInNotifications,
    );

    if (!hasBlockedUsersInNotifications) return;

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
  }, [notifications, userSettings.blockedUsers]);

  return (
    <CSPostHogProvider>
      <QueryProvider>
        <AppProvider
          value={{
            key,
            setKey,

            userSettings,
            setUserSettings,
            setAds,
            setTier,
            setPrivate,
            setViewSensitive,
            setBlockedUsers,
            isUserBlocked,

            notifications,
            setNotifications,
          }}
        >
          {userSettings.ads && (
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6132246468312218"
              crossOrigin="anonymous"
              strategy="lazyOnload"
            />
          )}
          <Suspense fallback={<GlobalLoading />}>
            <ClerkLoading>
              <GlobalLoading />
            </ClerkLoading>
            <ClerkLoaded>{children}</ClerkLoaded>
          </Suspense>
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
