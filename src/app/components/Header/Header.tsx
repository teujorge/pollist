import Link from "next/link";
import { IconSvg } from "../../svgs/IconSvg";
import { NotificationsBell } from "./NotificationsBell";
import { SignInButton, UserButton, auth } from "@clerk/nextjs";

export function Header() {
  const { userId } = auth();

  return (
    <header className="sticky left-0 right-0 top-0 z-40 flex w-full justify-between bg-gradient-to-b from-black from-60% px-5 py-4">
      <div className="flex flex-row items-center gap-4">
        <Link
          href="/"
          className="[&>svg>path]:hovact:fill-primary [&>svg>path]:hovact:stroke-primary h-8 w-8 [&>svg>path]:transition-all"
        >
          <IconSvg className="h-full w-full" />
        </Link>
      </div>

      <div className="relative flex flex-row items-center gap-4">
        <Link href="/">Home</Link>

        {userId ? (
          <Link href="/polls/create">Create</Link>
        ) : (
          <div className="[&>button]:hovact:text-primary flex h-8 w-fit items-center [&>button]:transition-colors">
            <SignInButton mode="modal">Create</SignInButton>
          </div>
        )}

        {userId && (
          <>
            <Link href={`/users/${userId}`}>Me</Link>
            <NotificationsBell />
          </>
        )}

        {userId ? (
          <div className="to-primary h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500">
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="[&>button]:hovact:text-primary flex h-8 w-fit items-center [&>button]:transition-colors">
            <SignInButton mode="modal" />
          </div>
        )}
      </div>
    </header>
  );
}
