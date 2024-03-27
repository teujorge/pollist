import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { IconSvg } from "../../svgs/IconSvg";
import { ProfileLink } from "./ProfileLink";
import { SignInButton } from "@clerk/nextjs";
import { NotificationsBell } from "./NotificationsBell";
import { ClerkUserButton } from "./ClerkUserButton/ClerkUserButton";

export function Header() {
  const { userId } = auth();

  return (
    <header className="sticky left-0 right-0 top-0 z-40 flex w-full flex-row justify-between bg-gradient-to-b from-background from-60% px-5 py-4">
      {/* App Icon for all sizes */}
      <Link
        href="/"
        scroll={false}
        className="h-8 w-8 [&>*]:font-semibold [&>svg>path]:transition-all [&>svg>path]:hovact:fill-primary [&>svg>path]:hovact:stroke-primary"
      >
        <IconSvg className="h-full w-full" />
      </Link>

      <div className="flex flex-row items-center justify-end gap-3 sm:gap-4">
        <Link key="header-home" href="/" scroll={false}>
          Home
        </Link>

        {userId ? (
          <Link href="/polls/create">Create</Link>
        ) : (
          <SignInButton mode="modal">
            <button className="transition-colors hovact:text-purple-500">
              Create
            </button>
          </SignInButton>
        )}

        <ProfileLink />

        {userId && <NotificationsBell />}

        {userId ? (
          <ClerkUserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="transition-colors hovact:text-purple-500">
              Sign in
            </button>
          </SignInButton>
        )}
      </div>
    </header>
  );
}
