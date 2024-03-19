"use client";

import { useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export function HeaderMobile({
  homeLink,
  createLink,
  userLink,
  notifications,
}: {
  homeLink: JSX.Element | undefined;
  createLink: JSX.Element | undefined;
  userLink: JSX.Element | undefined;
  notifications: JSX.Element | undefined;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Drawer
      direction="right"
      shouldScaleBackground
      open={drawerOpen}
      onOpenChange={(isOpen) => setDrawerOpen(isOpen)}
    >
      <DrawerTrigger asChild>
        <button aria-label="Open navigation" className="rounded-full">
          <HamburgerMenuIcon />
        </button>
      </DrawerTrigger>
      <DrawerContent className="fixed inset-y-0 left-auto right-0 flex h-dvh w-36 min-w-fit max-w-[90%] select-none flex-col items-end gap-2 rounded-l-[10px] rounded-r-none p-4 [&>*]:text-lg [&>*]:font-semibold">
        <div className="h-2" />
        {homeLink && <div onClick={() => setDrawerOpen(false)}>{homeLink}</div>}
        {createLink && (
          <div onClick={() => setDrawerOpen(false)}>{createLink}</div>
        )}
        {userLink && <div onClick={() => setDrawerOpen(false)}>{userLink}</div>}
        {notifications && notifications}
      </DrawerContent>
    </Drawer>
  );
}
