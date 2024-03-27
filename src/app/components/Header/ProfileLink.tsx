"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Suspense } from "react";

function _ProfileLink() {
  const { user } = useUser();
  if (!user?.username) return null;
  return <Link href={`/users/${user.username}`}>Profile</Link>;
}

export function ProfileLink() {
  return (
    <Suspense>
      <_ProfileLink />
    </Suspense>
  );
}
