"use client";

import { useApp } from "@/app/app";
import Link from "next/link";

export function DeletePollButton({
  pollId,
  pollAuthorId,
}: {
  pollId: string;
  pollAuthorId: string;
}) {
  const { userId } = useApp();

  if (userId !== pollAuthorId) return null;

  return (
    <Link
      href={`/polls/delete?id=${pollId}`}
      className="text-red-500 hovact:text-red-400"
    >
      Delete
    </Link>
  );
}
