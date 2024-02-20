import { Stat } from "./components/Stat";

export default function UserPageLoading() {
  return (
    <>
      <div className="flex w-full flex-row gap-8 rounded-xl border border-neutral-800 px-3 py-3">
        <div className="flex flex-col gap-2">
          <div className="shimmer h-[100px] w-[100px] !rounded-full" />
        </div>

        <div className="flex flex-col justify-around">
          <div className="flex items-center gap-2">
            <h1 className="shimmer text-transparent">username</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Stat label="polls" count={100} isShimmer />
            <Stat label="votes" count={100} isShimmer />
            <Stat label="following" count={100} isShimmer />
            <Stat label="followers" count={100} isShimmer />
          </div>
        </div>
      </div>
      <div className="shimmer h-10 w-full md:hidden" />
    </>
  );
}
