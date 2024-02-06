"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-[calc(100dvh-64px)] w-full items-center justify-center">
      <div className="flex w-fit flex-col items-center justify-center gap-2">
        <h2 className="text-2xl">Oops, something went wrong!</h2>

        <p>
          {error.name}: {error.message}
        </p>

        <button
          className="hovact:bg-neutral-800 rounded-lg px-2 py-1"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
