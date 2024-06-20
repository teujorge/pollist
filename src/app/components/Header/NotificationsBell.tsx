"use client";

import { cn } from "@/lib/utils";
import { Bell } from "@phosphor-icons/react";
import { useApp } from "@/app/(with-auth)/app";
import { useState } from "react";
import { DialogProvider } from "@/app/hooks/useDialog";
import { NotificationList } from "./NotificationsList";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  groupedPollCreated,
  groupedPollLikes,
  groupedComments,
  groupedCommentLikes,
  groupedFollowPending,
  groupedFollowAccepted,
} from "./utils";

export function NotificationsBell() {
  const { notifications } = useApp();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const notificationsCount =
    groupedPollCreated(notifications).length +
    groupedPollLikes(notifications).length +
    groupedComments(notifications).length +
    groupedCommentLikes(notifications).length +
    groupedFollowPending(notifications).length +
    groupedFollowAccepted(notifications).length;

  return (
    <DialogProvider
      value={{
        isNotificationsOpen: isDialogOpen,
        setIsNotificationsOpen: setIsDialogOpen,
      }}
    >
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger
          className={cn(
            "relative h-fit w-fit transition-colors hovact:text-primary",
            isDialogOpen && "text-primary",
          )}
        >
          <Bell className="hidden sm:block" size={24} />
          <Bell className="block sm:hidden" size={26} />
          {notificationsCount > 0 && (
            <div className="absolute -right-0.5 -top-0.5 flex h-4 w-4 select-none items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {notificationsCount > 9 ? "+" : notificationsCount}
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-0 p-0">
          <h3 className="border-b border-b-accent-dark px-6 pb-3 pt-6 text-xl font-semibold">
            Notifications
          </h3>
          <NotificationList />
        </DialogContent>
      </Dialog>
    </DialogProvider>
  );
}
