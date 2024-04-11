"use client";

import { useApp } from "@/app/(with-auth)/app";
import { Bell } from "@phosphor-icons/react";
import { NotificationList } from "./NotificationsList";
import { createContext, useContext, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function NotificationsBell() {
  const { notifications } = useApp();

  const notificationsExist =
    notifications.pollLikes.length > 0 ||
    notifications.comments.length > 0 ||
    notifications.commentLikes.length > 0 ||
    notifications.followsPending.length > 0 ||
    notifications.followsAccepted.length > 0;

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const memoizedNotificationsList = useMemo(() => <NotificationList />, []);

  return (
    notificationsExist && (
      <NotificationsProvider
        value={{ isNotificationsOpen, setIsNotificationsOpen }}
      >
        <Popover
          open={isNotificationsOpen}
          onOpenChange={setIsNotificationsOpen}
        >
          <PopoverTrigger asChild>
            <button
              className="relative select-none outline-none
            [&>svg]:hovact:text-primary"
            >
              <Bell size={20} />
              <div className="absolute -right-0.5 -top-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-primary text-xs" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end">
            {memoizedNotificationsList}
          </PopoverContent>
        </Popover>
      </NotificationsProvider>
    )
  );
}

type NotificationsContextType = {
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }
  return context;
}

function NotificationsProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: NotificationsContextType;
}) {
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
