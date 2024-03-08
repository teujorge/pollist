"use client";

import { useApp } from "@/app/app";
import { BellIcon } from "@radix-ui/react-icons";
import { NotificationList } from "./NotificationsList";
import { createContext, useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function NotificationsBell() {
  const { notifications } = useApp();

  const notificationList = [
    ...notifications.pollLikes,
    ...notifications.comments,
    ...notifications.commentLikes,
    ...notifications.followsPending,
    ...notifications.followsAccepted,
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    notificationList.length > 0 && (
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
            [&>svg]:hovact:text-purple-500"
            >
              <BellIcon className="text-white transition-colors" />
              <div className="absolute -right-0.5 -top-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-purple-500 text-xs" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <NotificationList />
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
