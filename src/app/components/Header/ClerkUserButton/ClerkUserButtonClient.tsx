"use client";

import { GearIcon } from "@radix-ui/react-icons";
import { UserButton } from "@clerk/nextjs";

export function ClerkUserButtonClient({
  settings,
}: {
  settings: React.ReactNode;
}) {
  return (
    <UserButton>
      <UserButton.UserProfilePage
        label="Settings"
        labelIcon={<GearIcon />}
        url="settings"
      >
        {settings}
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage label="account" />
      <UserButton.UserProfilePage label="security" />
    </UserButton>
  );
}
