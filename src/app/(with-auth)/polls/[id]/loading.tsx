import { Loader } from "@/app/components/Loader";

export default function PollPageLoading() {
  return (
    <main className="flex min-h-[calc(100dvh-64px)] w-full flex-col">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="shimmer text-3xl text-transparent">-title-</h1>
          <h2 className="shimmer text-transparent">-description-</h2>
          <span className="shimmer text-transparent">
            Created by -username-
          </span>
        </div>
        <div className="shimmer flex flex-row gap-2 text-sm text-transparent">
          Created on -date-
        </div>
      </div>

      <div className="flex h-32 w-full items-center justify-center">
        <Loader />
      </div>

      <div className="flex-grow" />

      <div className="shimmer flex h-64 w-full items-center justify-center rounded-lg bg-neutral-900 p-2" />
    </main>
  );
}
