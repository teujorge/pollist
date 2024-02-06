import { Input } from "./components/Input";

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
        </div>
      </div>
    </main>
  );
}
