import Link from "next/link";
import { IconSvg } from "../../svgs/IconSvg";
import { ProfileLink } from "./ProfileLink";
import { NotificationsBell } from "./NotificationsBell";
import { SignInButton, UserButton, auth } from "@clerk/nextjs";

export async function Header() {
  const { userId } = auth();

  return (
    <header className="sticky left-0 right-0 top-0 z-40 flex w-full justify-between bg-gradient-to-b from-black from-60% px-5 py-4">
      <div className="flex flex-row items-center gap-4">
        <Link
          href="/"
          scroll={false}
          className="h-8 w-8 [&>svg>path]:transition-all [&>svg>path]:hovact:fill-primary [&>svg>path]:hovact:stroke-primary"
        >
          <IconSvg className="h-full w-full" />
        </Link>
      </div>

      <div className="relative flex flex-row items-center gap-4 [&>a]:font-semibold">
        <Link href="/" scroll={false}>
          Home
        </Link>

        {userId ? (
          <Link href="/polls/create">Create</Link>
        ) : (
          <div className="flex h-8 w-fit items-center [&>button]:font-semibold [&>button]:transition-colors [&>button]:hovact:text-primary">
            <SignInButton mode="modal">Create</SignInButton>
          </div>
        )}

        {userId && (
          <>
            <ProfileLink />
            <NotificationsBell />
          </>
        )}

        {userId ? (
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-primary">
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex h-8 w-fit items-center [&>button]:font-semibold [&>button]:transition-colors [&>button]:hovact:text-primary">
            <SignInButton mode="modal" />
          </div>
        )}
      </div>
    </header>
  );
}
