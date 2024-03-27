import Link from "next/link";
import { IconSvg } from "../../svgs/IconSvg";
import { MobileHeader } from "./HeaderMobile";
import { DesktopHeader } from "./HeaderDesktop";
import { ClerkUserButton } from "./ClerkUserButton/ClerkUserButton";
import { NotificationsBell } from "./NotificationsBell";
import { auth, SignInButton } from "@clerk/nextjs";

export function Header() {
  const { userId } = auth();

  return (
    <header className="sticky left-0 right-0 top-0 z-40 flex w-full flex-row justify-between bg-gradient-to-b from-background from-60% px-5 py-4 text-lg font-semibold">
      <Link
        href="/"
        scroll={false}
        className="h-8 w-8 [&>*]:font-semibold [&>svg>path]:transition-all [&>svg>path]:hovact:fill-primary [&>svg>path]:hovact:stroke-primary"
      >
        <IconSvg className="h-full w-full" />
      </Link>

      <nav className="flex flex-row gap-4">
        <DesktopHeader userId={userId} />

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

        <MobileHeader userId={userId} />
      </nav>
    </header>
  );
}
