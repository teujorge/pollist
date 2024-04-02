import GlobalLoading from "../loading";
import { Suspense } from "react";
import { FilterBar } from "./components/FilterBar";
import { FeaturedPoll } from "./components/FeaturedPoll";
import { FeaturedPollProvider } from "./hooks/useFeaturedPoll";

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex w-full flex-col items-center gap-2">
      <h1 className="pt-6 text-5xl font-bold">Polls</h1>
      <FilterBar />
      <div className="h-2" />
      <FeaturedPollProvider>
        <FeaturedPoll />
        <Suspense fallback={<GlobalLoading />}>{children}</Suspense>
      </FeaturedPollProvider>
    </main>
  );
}
