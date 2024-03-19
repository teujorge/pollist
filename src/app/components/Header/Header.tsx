import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { IconSvg } from "../../svgs/IconSvg";
import { Suspense } from "react";
import { ProfileLink } from "./ProfileLink";
import { HeaderMobile } from "./HeaderMobile";
import { NotificationsBell } from "./NotificationsBell";
import { SignInButton, UserButton } from "@clerk/nextjs";

export function Header() {
  const { userId } = auth();

  const homeLink = (
    <Link key="header-home" href="/" scroll={false}>
      Home
    </Link>
  );

  const createLink = userId ? (
    <Link href="/polls/create">Create</Link>
  ) : (
    <SignInButton mode="modal">
      <button className="hovact:text-purple-500">Create</button>
    </SignInButton>
  );

  const userLink = userId ? (
    <Suspense>
      <ProfileLink />
    </Suspense>
  ) : undefined;

  const notifications = userId ? <NotificationsBell /> : undefined;

  const clerkUserButton = userId ? (
    <UserButton afterSignOutUrl="/" />
  ) : (
    <SignInButton mode="modal">
      <button className="hovact:text-purple-500">Sign in</button>
    </SignInButton>
  );

  return (
    <header className="sticky left-0 right-0 top-0 z-40 flex w-full justify-between bg-gradient-to-b from-background from-60% px-5 py-4">
      {/* App Icon for all sizes */}
      <Link
        href="/"
        scroll={false}
        className="h-8 w-8 [&>svg>path]:transition-all [&>svg>path]:hovact:fill-primary [&>svg>path]:hovact:stroke-primary"
      >
        <IconSvg className="h-full w-full" />
      </Link>

      {/* Desktop Links */}
      <div className="hidden flex-row items-center gap-4 sm:flex [&>*]:font-semibold">
        {homeLink}
        {createLink}
        {userLink}
        {notifications}
        {clerkUserButton}
      </div>

      {/* Mobile Popover */}
      <div className="flex items-center gap-4 sm:hidden [&>*]:font-semibold">
        {clerkUserButton}
        <HeaderMobile
          homeLink={homeLink}
          createLink={createLink}
          userLink={userLink}
          notifications={notifications}
        />
      </div>
    </header>
  );
}
