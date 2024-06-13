import GlobalLoading from "../loading";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { AllPolls } from "./components/AllPolls";
import { AllUsers } from "./components/AllUsers";
import { FilterBar } from "./components/FilterBar";
import { CATEGORIES } from "@/constants";
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

  let infiniteContent: React.ReactNode;

  // Infinite users
  if (category.toLocaleLowerCase() === CATEGORIES[3]?.toLocaleLowerCase()) {
    await queryClient.prefetchQuery({
      queryKey: ["all-users"],
      queryFn: () =>
        fetch(`/api/users?search=${search}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
    });

    infiniteContent = <AllUsers query={{ username: search }} userId={userId} />;
  }

  // Infinite polls
  else {
    await queryClient.prefetchQuery({
      queryKey: ["all-posts"],
      queryFn: () =>
        fetch(`/api/polls?search=${search}category=${category}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
    });

    infiniteContent = (
      <AllPolls
        query={{
          search,
          category: category,
        }}
        userId={userId}
      />
    );
  }

  return (
    <main className="flex w-full flex-col items-center gap-2">
      <h1 className="pt-6 text-5xl font-bold">Polls</h1>
      <FilterBar />
      <div className="h-2" />
      <Suspense fallback={<GlobalLoading />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          {infiniteContent}
        </HydrationBoundary>
      </Suspense>
    </main>
  );
}
