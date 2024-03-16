import { AllPolls } from "./components/AllPolls";
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AllPolls query={{ search, category }} />
    </HydrationBoundary>
  );
}
