import Link from "next/link";
import { ProfileLink } from "./ProfileLink";
import { SignInButton } from "@clerk/nextjs";

export function DesktopHeader({ userId }: { userId: string | null }) {
  return (
    <nav className="hidden flex-row items-center justify-end gap-3 sm:flex">
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
    </nav>
  );
}
