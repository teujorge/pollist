"use client";

import Link from "next/link";
import { Bell } from "@phosphor-icons/react";
import { useApp } from "@/app/(with-auth)/app";
import { PopoverProvider } from "@/app/hooks/usePopover";
import { NotificationList } from "./NotificationsList";
import { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function NotificationsBell() {
  const { notifications } = useApp();

  const notificationsCount =
    notifications.pollLikes.length +
    notifications.comments.length +
    notifications.commentLikes.length +
    notifications.followsPending.length +
    notifications.followsAccepted.length;

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const memoizedNotificationsList = useMemo(() => <NotificationList />, []);

  return (
    <PopoverProvider value={{ isNotificationsOpen, setIsNotificationsOpen }}>
      {/* mobile */}
      <Link
        href="/notifications"
        className="relative block h-fit w-fit sm:hidden"
      >
        <Bell size={26} />
        {notificationsCount > 0 && (
          <div className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs">
            {notificationsCount > 9 ? "+" : notificationsCount}
          </div>
        )}
      </Link>
      {/* desktop */}
      <div className="hidden h-fit w-fit sm:block">
        <Popover
          open={isNotificationsOpen}
          onOpenChange={setIsNotificationsOpen}
        >
          <PopoverTrigger asChild>
            <button
              className="relative select-none outline-none
            [&>svg]:hovact:text-primary"
            >
              <Bell size={22} />
              {notificationsCount > 0 && (
                <div className="absolute -right-0.5 -top-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-primary text-xs" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end">
            {memoizedNotificationsList}
          </PopoverContent>
        </Popover>
      </div>
    </PopoverProvider>
  );
}
