export default function UserPageLoading() {
  return (
    <div className="flex h-full w-full flex-row    justify-between gap-2 rounded-xl border border-neutral-800 px-3 py-2">
      <div className="flex flex-col gap-2">
        <div className="shimmer h-[100px] w-[100px] !rounded-full" />

        <h1 className="shimmer flex items-center justify-center text-transparent">
          username
        </h1>
      </div>
      <div className="flex min-h-full  flex-col justify-between gap-4">
        <div className="flex  h-full flex-row gap-4">
          <div className="shimmer w-20 text-transparent"></div>
        </div>
      </div>
    </div>
  );
}
