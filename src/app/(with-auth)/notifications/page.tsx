"use client";

import { PopoverProvider } from "@/app/hooks/usePopover";
import { NotificationList } from "@/app/components/Header/NotificationsList";

export const dynamic = "force-static";

export default function NotificationsPage() {
  return (
    <main className="w-full">
      <h1 className="p-1 text-2xl font-semibold">Notifications</h1>
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
