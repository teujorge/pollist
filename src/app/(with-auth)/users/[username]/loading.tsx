import { Stat } from "@/app/(with-auth)/users/components/Stat";
import { Loader } from "@/app/components/Loader";

export default function UserPageLoading() {
  return (
    <>
      <div className="flex w-full flex-row gap-8 px-3 py-3">
        <div className="shimmer max-h-[100px] min-h-[100px] min-w-[100px] max-w-[100px] !rounded-full" />

        <div className="flex flex-col justify-around gap-2">
          <div className="flex items-center gap-2">
            <h1 className="shimmer text-transparent">username</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Stat label="polls" count={9999} isShimmer />
            <Stat label="votes" count={9999} isShimmer />
            <Stat label="following" count={9999} isShimmer />
            <Stat label="followers" count={9999} isShimmer />
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center pt-8">
        <Loader />
      </div>
    </>
  );
}
