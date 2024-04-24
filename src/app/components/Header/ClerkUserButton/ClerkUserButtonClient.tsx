"use client";

import { UserGear, UserList } from "@phosphor-icons/react";
import { UserButton, useUser } from "@clerk/nextjs";

export function ClerkUserButtonClient({
  settings,
}: {
  settings: React.ReactNode;
}) {
  const user = useUser();

  return (
    <UserButton>
      <UserButton.UserProfilePage
        label="Settings"
        labelIcon={<UserGear size={16} />}
        url="settings"
      >
        {settings}
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage label="account" />
      <UserButton.UserProfilePage label="security" />
      <UserButton.UserProfileLink
        label="Visit Profile"
        labelIcon={<UserList size={16} />}
        url={"/users/" + user.user?.username}
      />
    </UserButton>
  );
}
