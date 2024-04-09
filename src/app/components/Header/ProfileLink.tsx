"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { PersonIcon } from "@radix-ui/react-icons";

export function ProfileLink({ label }: { label: string }) {
  const { user } = useUser();
  if (!user?.username) return null;
  return (
    <Link href={`/users/${user.username}`}>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">
        <PersonIcon className="h-6 w-6" />
      </span>
    </Link>
  );
}
