import { AllPolls } from "./components/AllPolls";
import { FilterBar } from "./components/FilterBar";
import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
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
      fetch(`/api/polls?search=${search}category=${category}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
  });

  return (
    <main className="flex w-full flex-col items-center gap-2">
      <h1 className="pt-6 text-5xl font-bold">Polls</h1>

      <FilterBar />

      <div className="h-2" />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <AllPolls query={{ search, category }} />
      </HydrationBoundary>
    </main>
  );
}
