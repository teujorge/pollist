"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { PersonIcon } from "@radix-ui/react-icons";

export function ProfileLink({ onClick }: { onClick?: () => void }) {
  const { user } = useUser();
  if (!user?.username) return null;

  return (
    <Link
      href={`/users/${user.username}`}
      className="flex flex-row items-center justify-center gap-3"
      onClick={onClick}
    >
      Profile <PersonIcon className="flex h-5 w-5 sm:hidden" />
    </Link>
  );
}
