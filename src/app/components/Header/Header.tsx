import Link from "next/link";
import { IconSvg } from "../../svgs/IconSvg";
import { Suspense } from "react";
import { ProfileLink } from "./ProfileLink";
import { NotificationsBell } from "./NotificationsBell";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { SignInButton, UserButton, auth } from "@clerk/nextjs";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export function Header() {
  const { userId } = auth();

  const headerLinks = (
    <>
      <Link href="/" scroll={false}>
        Home
      </Link>
      {userId ? (
        <Link href="/polls/create">Create</Link>
      ) : (
        <SignInButton mode="modal">Create</SignInButton>
      )}
      {userId && (
        <>
          <Suspense>
            <ProfileLink />
          </Suspense>
          <NotificationsBell />
        </>
      )}
      {userId ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <SignInButton mode="modal" />
      )}
    </>
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
      <div className="hidden flex-row items-center gap-4 sm:flex [&>a]:font-semibold">
        {headerLinks}
      </div>

      {/* Mobile Popover */}
      <div className="flex items-center sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <button aria-label="Open navigation" className="rounded-full">
              <HamburgerMenuIcon />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            className="flex w-32 min-w-fit flex-col items-end gap-2 p-4 [&>a]:text-lg [&>a]:font-semibold"
          >
            {headerLinks}
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
