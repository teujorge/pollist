"use client";

import { Gear } from "@phosphor-icons/react";
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
        labelIcon={<Gear size={18} />}
        url="settings"
      >
        {settings}
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage label="account" />
      <UserButton.UserProfilePage label="security" />
    </UserButton>
  );
}
