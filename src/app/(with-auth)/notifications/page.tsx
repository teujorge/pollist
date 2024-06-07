"use client";

import { PopoverProvider } from "@/app/hooks/usePopover";
import { NotificationList } from "@/app/components/Header/NotificationsList";

export const dynamic = "force-static";

export default function NotificationsPage() {
  return (
    <main className="w-full">
      <PopoverProvider
        value={{
          isNotificationsOpen: true,
          setIsNotificationsOpen: undefined,
        }}
      >
        <NotificationList />
      </PopoverProvider>
    </main>
  );
}
