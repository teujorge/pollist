import { Loader } from "@/app/components/Loader";

export default function PollPageLoading() {
  return (
    <main className="relative flex min-h-[calc(100dvh-64px)] w-full flex-col gap-1">
      <div className="flex flex-col items-start justify-start gap-1 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="shimmer text-3xl text-transparent">-poll title-</h1>
        </div>
        <span className="shimmer text-sm text-transparent">
          -Month Day, Year-
        </span>
      </div>

      <div className="flex w-full items-center justify-center pt-8">
        <Loader />
      </div>
    </main>
  );
}
