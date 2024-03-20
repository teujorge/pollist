"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex h-[calc(100dvh-64px)] w-full items-center justify-center">
      <div className="flex w-fit flex-col items-center justify-center gap-2">
        <h2 className="text-2xl">Oops, something went wrong!</h2>

        <p>
          {error.name}: {error.message}
        </p>

        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </main>
  );
}
