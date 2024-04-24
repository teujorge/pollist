import { auth } from "@clerk/nextjs/server";
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
  const { userId } = auth();

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
      <AllPolls query={{ search, category }} userId={userId} />
    </HydrationBoundary>
  );
}
