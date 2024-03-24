import { Suspense } from "react";
import { FilterBar } from "./components/FilterBar";
import GlobalLoading from "../loading";

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
      <Suspense fallback={<GlobalLoading />}>{children}</Suspense>
    </main>
  );
}
