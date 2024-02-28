"use client";

import Link from "next/link";
import GlobalLoading from "./loading";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getAnonUser } from "./api/anon/actions";
import { IconSvg } from "./svgs/IconSvg";
import { supabase } from "@/database/dbRealtime";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Notification } from "@prisma/client";
import { getNotifications } from "./users/actions";

type UserData = {
  userId: string | undefined;
  isAnon: boolean;
  loading: boolean;
  notifications: Notification[];
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
    notifications: [],
  });

  useEffect(() => {
    async function initUserId() {
      const id = (await getAnonUser())?.id;
      if (id) setUserId(id);
    }
    void initUserId();
  }, []);

  useEffect(() => {
    async function handleInitNotifications() {
      if (!user) return;

      // get initial notifications
      const notifications = await getNotifications();
      console.log("Initial notifications:", notifications);

      if (notifications) {
        setUserStatus((prev) => ({ ...prev, notifications }));
      }

      // notification subscription for subsequent changes
      notificationsSubscriptionRef.current = supabase
        ?.channel(`notifications-db-changes`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Notification",
            filter: `userId=eq.${user.id}`,
          },
          (payload) => {
            console.log("Notification received:", payload);

            const oldPayload: Record<string, string> = payload.old;
            const newPayload: Record<string, string> = payload.new;

            const notificationId = oldPayload.id ?? newPayload.id;
            if (!notificationId) return;

            const newNotification =
              Object.keys(newPayload).length > 0
                ? ({
                    ...newPayload,
                    createdAt: new Date(newPayload.createdAt ?? ""),
                  } as Notification)
                : undefined;

            // new payload exists, so inserted or updated row
            if (newNotification) {
              // old payload id exists, so it's an update
              if (oldPayload.id) {
                console.log("Notification updated:", newNotification);
                setUserStatus((prev) => ({
                  ...prev,
                  notifications: prev.notifications.map((n) =>
                    n.id === notificationId ? newNotification : n,
                  ),
                }));
              }
              // old payload id doesn't exist, so it's an insert
              else {
                console.log("Notification inserted:", newNotification);
                setUserStatus((prev) => ({
                  ...prev,
                  notifications: [...prev.notifications, newNotification],
                }));
              }
            }

            // no new payload, so it's a delete
            else {
              console.log("Notification deleted:", oldPayload);
              setUserStatus((prev) => ({
                ...prev,
                notifications: prev.notifications.filter(
                  (n) => n.id !== notificationId,
                ),
              }));
            }
          },
        )
        .subscribe();
    }

    if (user) {
      // Set the user status
      setUserStatus({
        userId: user.id,
        isAnon: false,
        loading: false,
        notifications: [],
      });
    } else {
      setUserStatus({
        userId: userId,
        isAnon: true,
        loading: false,
        notifications: [],
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

function Header({ userId }: { userId?: string }) {
  const { notifications } = useApp();

  return (
    <header className="sticky left-0 right-0 top-0 z-40 flex w-full justify-between bg-gradient-to-b from-black from-60% px-5 py-4">
      <div className="flex flex-row items-center gap-4">
        <Link
          href="/"
          className="h-8 w-8 [&>svg>path]:transition-all [&>svg>path]:hovact:fill-purple-500 [&>svg>path]:hovact:stroke-purple-500"
        >
          <IconSvg className="h-full w-full" />
        </Link>
      </div>

      <div className="flex flex-row items-center gap-4">
        <Link href="/">Home</Link>

        <Link href="/polls/create">Create</Link>

        {userId && (
          <Link href={`/users/${userId}`} className="relative">
            Me
            {notifications.length > 0 && (
              <div className="absolute -right-1 top-0 h-3 w-3 rounded-full bg-red-500 text-xs">
                {notifications.length}
              </div>
            )}
          </Link>
        )}

        <SignedIn>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex h-8 w-fit items-center [&>button]:transition-colors [&>button]:hovact:text-purple-500">
            <SignInButton mode="modal" />
          </div>
        </SignedOut>
      </div>
    </header>
  );
}
