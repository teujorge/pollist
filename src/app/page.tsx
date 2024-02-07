import { SearchBar } from "./index/components/SearchBar";
import { InfinitePolls } from "./components/InfinitePolls/InfinitePolls";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const search = searchParams?.search?.toString() ?? "";

  return (
    <main className="flex flex-col items-center gap-4 pt-0">
      <div className="h-4" />
      <div className="sticky top-10 z-10 flex w-full flex-row items-center justify-between border-b border-neutral-800 bg-black py-1 pt-6">
        <h1 className="text-4xl font-bold">Polls</h1>
        <SearchBar />
      </div>

      <InfinitePolls query={search} />
    </main>
  );
}
