import Link from "next/link";
import { IconSvg } from "../../svgs/IconSvg";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { NotificationsBell } from "./NotificationsBell";

export function Header({ userId }: { userId?: string }) {
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

        <Link href="/polls/create">Create</Link>

        {userId && (
          <>
            <Link href={`/users/${userId}`}>Me</Link>
            <NotificationsBell />
          </>
        )}

        <SignedIn>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex h-8 w-fit items-center [&>button]:transition-colors [&>button]:hovact:text-purple-500">
            <SignInButton mode="modal" />
          </div>
        </SignedOut>
      </div>
    </header>
  );
}