"use client";

import GlobalLoading from "./loading";
import { Header } from "./components/Header/Header";
import { supabase } from "@/database/dbRealtime";
import { getAnonUser } from "./api/anon/actions";
import { getNotifications } from "./users/actions";
import { useUser } from "@clerk/nextjs";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Notification } from "@prisma/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

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
        ?.channel(`${user.id}-notifications`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "Notification",
            filter: `userId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload: Record<string, string> = payload.new;

            const newNotification = {
              ...newPayload,
              createdAt: new Date(newPayload.createdAt ?? ""),
            } as Notification;

            console.log("Notification inserted:", newNotification);
            setUserStatus((prev) => ({
              ...prev,
              notifications: [...prev.notifications, newNotification],
            }));
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "Notification",
            filter: `userId=eq.${user.id}`,
          },
          (payload) => {
            const newPayload: Record<string, string> = payload.new;

            const newNotification = {
              ...newPayload,
              createdAt: new Date(newPayload.createdAt ?? ""),
            } as Notification;

            setUserStatus((prev) => ({
              ...prev,
              notifications: prev.notifications.map((n) =>
                n.id === newNotification.id ? newNotification : n,
              ),
            }));
          },
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "Notification",
            filter: `userId=eq.${user.id}`,
          },
          (payload) => {
            const oldPayload: Record<string, string> = payload.old;

            const notificationId = oldPayload.id;
            if (!notificationId) return;

            console.log("Notification deleted:", oldPayload);
            setUserStatus((prev) => ({
              ...prev,
              notifications: prev.notifications.filter(
                (n) => n.id !== notificationId,
              ),
            }));
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
