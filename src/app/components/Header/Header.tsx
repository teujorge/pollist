import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { IconSvg } from "../../svgs/IconSvg";
import { SignInButton } from "@clerk/nextjs";
import { ClerkUserButton } from "./ClerkUserButton/ClerkUserButton";
import { StackPlus, House } from "@phosphor-icons/react/dist/ssr";
import { NotificationsBell } from "./NotificationsBell";

export function Header() {
  const { userId } = auth();

  const CreateButtonContent = (
    <>
      <span className="hidden sm:inline">Create</span>
      <span className="sm:hidden">
        <StackPlus size={26} />
      </span>
    </>
  );

  return (
    <header className="flex w-full flex-row items-center justify-between px-5 py-4">
      <Link
        href="/"
        scroll={false}
        className="hidden h-8 w-8 sm:block [&>*]:font-semibold [&>svg>path]:transition-all [&>svg>path]:hovact:fill-primary [&>svg>path]:hovact:stroke-primary"
      >
        <IconSvg className="h-full w-full" />
      </Link>

      <div className="flex w-full flex-row items-center justify-around gap-4 sm:w-fit sm:justify-end">
        <Link key="header-home" href="/" scroll={false}>
          <span className="hidden sm:inline">Home</span>
          <span className="sm:hidden">
            <House size={26} />
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
  );
}
