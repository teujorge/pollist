import { FilterBar } from "./index/components/FilterBar";
import { InfinitePolls } from "./components/InfinitePolls/InfinitePolls";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const search = searchParams?.search?.toString() ?? "";
  const category = searchParams?.category?.toString() ?? "";

  return (
    <main className="flex flex-col items-center gap-4 pt-0">
      <div className="h-4" />

      <div className="sticky top-10 z-20 flex w-full flex-col items-start justify-center gap-2 border-b border-neutral-800 bg-black py-1 pt-6 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Polls</h1>
        <div className="flex-grow" />
        <FilterBar />
      </div>

      <InfinitePolls search={search} category={category} />
    </main>
  );
}
