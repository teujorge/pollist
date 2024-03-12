import { AllPolls } from "./components/AllPolls";
import { FilterBar } from "./components/FilterBar";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const search = searchParams?.search?.toString() ?? "";
  const category = searchParams?.category?.toString() ?? "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: () =>
      fetch(`/api/polls?page=${1}search=${search}category=${category}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
  });

  return (
    <main className="flex w-full flex-col items-center gap-2">
      <div className="sticky top-10 z-20 flex w-full flex-col items-center gap-2 bg-gradient-to-b from-black from-80% pt-6 sm:items-center">
        <h1 className="text-4xl font-bold">Polls</h1>
        <div className="flex-grow" />
        <FilterBar />
      </div>

      <div className="h-4" />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <AllPolls query={{ search, category }} />
      </HydrationBoundary>
    </main>
  );
}
