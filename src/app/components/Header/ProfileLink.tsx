"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Suspense } from "react";
import { User } from "@phosphor-icons/react";

function _ProfileLink() {
  const { user } = useUser();
  if (!user?.username) return null;
  return (
    <Link href={`/users/${user.username}`}>
      <span className="hidden sm:inline">Profile</span>
      <span className="sm:hidden">
        <User size={20} />
      </span>
    </Link>
  );
}

export function ProfileLink() {
  return (
    <Suspense>
      <_ProfileLink />
    </Suspense>
  );
}
