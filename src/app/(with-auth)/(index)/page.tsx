import { auth } from "@clerk/nextjs/server";
import { AllPolls } from "./components/AllPolls";
import { AllUsers } from "./components/AllUsers";
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      {infiniteContent}
    </HydrationBoundary>
  );
}
