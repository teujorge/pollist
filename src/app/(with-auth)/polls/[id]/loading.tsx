import { Loader } from "@/app/components/Loader";

export default function PollPageLoading() {
  return (
    <main className="relative flex min-h-[calc(100dvh-64px)] w-full flex-col gap-1">
      {/* header */}
      <div className="flex flex-col items-start justify-start gap-1">
        {/* author profile link */}
        <div className="flex w-fit flex-row items-center gap-2 rounded-lg !bg-opacity-25 p-2 pl-0 transition-all">
          <div className="rounded-full border-[3px] border-background transition-colors">
            <div
              className="shimmer !rounded-full"
              style={{
                width: 38,
                minWidth: 38,
                maxWidth: 38,
                height: 38,
                minHeight: 38,
                maxHeight: 38,
              }}
            />
          </div>

          <div className="flex flex-col justify-center gap-0.5 border-0">
            <p className="shimmer hyphens-auto break-words text-foreground transition-colors">
              poll author username
            </p>
            <span className="shimmer text-xs text-accent-foreground transition-colors">
              Month Day, Year
            </span>
          </div>
        </div>

        {/* title & description */}
        <h1 className="shimmer hyphens-auto break-words text-2xl font-semibold">
          uppercaseFirstLetterOfEachSentence poll.title
        </h1>

        <h2 className="shimmer hyphens-auto break-words text-accent-foreground">
          uppercaseFirstLetterOfEachSentence poll.description
        </h2>
      </div>

      <div className="flex w-full items-center justify-center pt-8">
        <Loader />
      </div>
    </main>
  );
}
