"use client";

import { NotificationSvg } from "../../svgs/NotificationSvg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "./NotificationsList";
import { useApp } from "@/app/app";

export function NotificationsBell() {
  const { notifications } = useApp();

  return (
    notifications.length > 0 && (
      <Popover>
        <PopoverTrigger asChild>
          <button className="relative">
            <NotificationSvg className="fill-white transition-colors hovact:fill-purple-500" />
            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs">
              {notifications.length}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <NotificationList />
        </PopoverContent>
      </Popover>
    )
  );
}
