"use client";

import { useApp } from "@/app/app";
import { createContext, useContext, useState } from "react";
import { NotificationList } from "./NotificationsList";
import { NotificationSvg } from "../../svgs/NotificationSvg";
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
            <button className="relative select-none outline-none">
              <NotificationSvg className="fill-white transition-colors hovact:fill-purple-500" />
              <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs">
                {notificationList.length}
              </div>
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
