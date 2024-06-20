import Link from "next/link";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { IconSvg } from "../../svgs/IconSvg";
import { HomeItem } from "./HomeItem";
import { CreateItem } from "./CreateItem";
import { SignInButton } from "@clerk/nextjs";
import { ClerkUserButton } from "./ClerkUserButton/ClerkUserButton";
import { NotificationsBell } from "./NotificationsBell";

export function Header() {
  const { userId } = auth();

  return (
    <div
      className={cn(
        "left-0 right-0 z-40 flex h-fit w-full items-center justify-center transition-all",
        "fixed bottom-0 border-t border-accent bg-background/70 backdrop-blur-lg",
        "sm:sticky sm:top-0 sm:border-0 sm:bg-transparent sm:bg-gradient-to-b sm:from-background sm:from-60% sm:backdrop-blur-none",
      )}
    >
      <header className="flex w-full flex-row items-center justify-between px-5 py-4">
        <Link
          href="/"
          scroll={false}
          className="hidden h-8 w-8 sm:block [&>*]:font-semibold [&>svg>path]:transition-all [&>svg>path]:hovact:fill-primary [&>svg>path]:hovact:stroke-primary"
        >
          <IconSvg className="h-full w-full" />
        </Link>

        <div className="flex w-full flex-row items-center justify-around gap-4 sm:w-fit sm:justify-end">
          <HomeItem />
          <CreateItem userId={userId} />

          {userId && <NotificationsBell />}

          {userId ? (
            <ClerkUserButton />
          ) : (
            <SignInButton mode="modal">
              <button
                id="header-sign-in-button"
                className="transition-colors hovact:text-purple-500"
              >
                Sign in
              </button>
            </SignInButton>
          )}
        </div>
      </header>
    </div>
  );
}
