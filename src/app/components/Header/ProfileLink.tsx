"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export async function ProfileLink() {
  const { user } = useUser();
  if (!user?.username) return null;
  return <Link href={`/users/${user.username}`}>Profile</Link>;
}
