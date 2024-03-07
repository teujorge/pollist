"use client";

import Link from "next/link";
import { IconSvg } from "../../svgs/IconSvg";
import { NotificationsBell } from "./NotificationsBell";
import { useRealtimeNotifications } from "@/app/hooks/useRealtimeNotifications";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export function Header() {
  useRealtimeNotifications();

  const { user } = useUser();

  return (
    <header className="sticky left-0 right-0 top-0 z-40 flex w-full justify-between bg-gradient-to-b from-black from-60% px-5 py-4">
      <div className="flex flex-row items-center gap-4">
        <Link
          href="/"
          className="h-8 w-8 [&>svg>path]:transition-all [&>svg>path]:hovact:fill-purple-500 [&>svg>path]:hovact:stroke-purple-500"
        >
          <IconSvg className="h-full w-full" />
        </Link>
      </div>

      <div className="relative flex flex-row items-center gap-4">
        <Link href="/">Home</Link>

        {user?.id ? (
          <Link href="/polls/create">Create</Link>
        ) : (
          <div className="flex h-8 w-fit items-center [&>button]:transition-colors [&>button]:hovact:text-purple-500">
            <SignInButton mode="modal">Create</SignInButton>
          </div>
        )}

        {user?.id && (
          <>
            <Link href={`/users/${user.id}`}>Me</Link>
            <NotificationsBell />
          </>
        )}

        {user?.id ? (
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex h-8 w-fit items-center [&>button]:transition-colors [&>button]:hovact:text-purple-500">
            <SignInButton mode="modal" />
          </div>
        )}
      </div>
    </header>
  );
}
