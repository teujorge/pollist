"use client";

import { type Tab, useUserPage } from "../context";

export function TabManagement({
  tabKey,
  children,
}: {
  tabKey: Tab;
  children: React.ReactNode;
}) {
  const { tab } = useUserPage();

  return (
    <div
      className={`w-full flex-grow flex-col gap-2 md:w-1/2
        ${tab === tabKey ? "flex" : "hidden"}
      `}
    >
      <div className="flex flex-col gap-2 overflow-y-auto rounded-xl border border-neutral-700 p-2">
        {children}
      </div>
    </div>
  );
}
