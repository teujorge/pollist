import { Input } from "./components/Input";
import { ArrowSvg } from "./svgs/ArrowSvg";

export default function HomePageLoading() {
  return (
    <main className="flex flex-col items-center gap-4 pt-0">
      <div className="h-4" />
      <div className="sticky top-10 z-10 flex w-full flex-row items-end justify-between border-b border-neutral-800 bg-black py-1 pt-6">
        <h1 className="text-4xl font-bold">Polls</h1>
        <div className="flex w-fit flex-row items-center justify-center gap-1">
          <Input
            wrapperProps={{ className: "p-1" }}
            inputProps={{
              disabled: true,
              placeholder: "Search for a poll",
            }}
          />
          <button className="pointer-events-none h-8 w-8 rotate-180 cursor-default rounded-md p-2 opacity-50 transition-colors hover:bg-neutral-800">
            <ArrowSvg className="h-full w-full fill-neutral-200" />
          </button>
          <button className="pointer-events-none h-8 w-8 cursor-default rounded-md p-2 opacity-50 transition-colors hover:bg-neutral-800">
            <ArrowSvg className="h-full w-full fill-neutral-200" />
          </button>
        </div>
      </div>
      <>LOADING SPINNER HERE</>
    </main>
  );
}
