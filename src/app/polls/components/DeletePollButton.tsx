"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export function DeletePollButton({
  pollId,
  pollAuthorId,
}: {
  pollId: string;
  pollAuthorId: string;
}) {
  const { user } = useUser();

  if (user?.id !== pollAuthorId) return null;

  return (
    <Link
      href={`/polls/delete?id=${pollId}`}
      className="text-red-500 hovact:text-red-400"
    >
      Delete
    </Link>
  );
}
