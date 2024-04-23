"use client";

import * as Sentry from "@sentry/nextjs";
import ErrorComponent from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: unknown }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex h-[calc(100dvh-64px)] w-full items-center justify-center">
      <div className="flex w-fit flex-col items-center justify-center gap-2">
        <ErrorComponent
          statusCode={500}
          title={"An unexpected error has occurred"}
        />
      </div>
    </main>
  );
}
