import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { IconSvg } from "../../svgs/IconSvg";
import { ProfileLink } from "./ProfileLink";
import { SignInButton } from "@clerk/nextjs";
import { ClerkUserButton } from "./ClerkUserButton/ClerkUserButton";
import { NotificationsBell } from "./NotificationsBell";

import { StackPlus, House } from "@phosphor-icons/react/dist/ssr";
export function Header() {
  const { userId } = auth();

  const CreateButtonContent = (
    <>
      <span className="hidden sm:inline">Create</span>
      <span className="sm:hidden">
        <StackPlus size={20} />
      </span>
    </>
  );

  return (
    <header className="sticky left-0 right-0 top-0 z-40 flex w-full flex-row justify-between bg-gradient-to-b from-background from-60% px-5 py-4">
      <Link
        href="/"
        scroll={false}
        className="h-8 w-8 [&>*]:font-semibold [&>svg>path]:transition-all [&>svg>path]:hovact:fill-primary [&>svg>path]:hovact:stroke-primary"
      >
        <IconSvg className="h-full w-full" />
      </Link>

      <div className="flex flex-row items-center justify-end gap-4">
        <Link key="header-home" href="/" scroll={false}>
          <span className="hidden sm:inline">Home</span>
          <span className="sm:hidden">
            <House size={20} />
          </span>
        </Link>

        {userId ? (
          <Link href="/polls/create">{CreateButtonContent}</Link>
        ) : (
          <SignInButton mode="modal">
            <button className="transition-colors hovact:text-purple-500">
              {CreateButtonContent}
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
