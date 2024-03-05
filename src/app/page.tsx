import dynamic from "next/dynamic";
import { Loader } from "./components/Loader";
import { FilterBar } from "./index/components/FilterBar";

const InfinitePolls = dynamic(
  () =>
    import("./components/InfinitePolls/InfinitePolls").then(
      (mod) => mod.InfinitePolls,
    ),
  {
    loading: () => <Loader />,
  },
);

export default function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const search = searchParams?.search?.toString() ?? "";
  const category = searchParams?.category?.toString() ?? "";

  return (
    <main className="flex w-full flex-col items-center gap-2">
      <div className="sticky top-10 z-20 flex w-full flex-row items-end justify-center gap-2 bg-gradient-to-b from-black from-80% pt-6 sm:items-center">
        <h1 className="text-4xl font-bold">Polls</h1>
        <div className="flex-grow" />
        <FilterBar />
      </div>

      <div className="h-4" />

      <div
        key={`${search}-${category}`}
        className="flex h-fit w-full flex-col items-center"
      >
        <InfinitePolls
          query={{ search, category }}
          idPrefix="home-page-polls"
        />
      </div>
    </main>
  );
}

// import { Loader } from "./components/Loader";
// import { Suspense } from "react";
// import { FilterBar } from "./index/components/FilterBar";
// import { InfinitePolls } from "./components/InfinitePolls/InfinitePolls";

// export default function HomePage({
//   searchParams,
// }: {
//   searchParams: Record<string, string | string[] | undefined>;
// }) {
//   const search = searchParams?.search?.toString() ?? "";
//   const category = searchParams?.category?.toString() ?? "";

//   return (
//     <main className="flex flex-col items-center gap-2">
//       <div className="sticky top-10 z-20 flex w-full flex-row items-end justify-center gap-2 bg-gradient-to-b from-black from-80% pt-6 sm:items-center">
//         <h1 className="text-4xl font-bold">Polls</h1>
//         <div className="flex-grow" />
//         <FilterBar />
//       </div>

//       <div className="h-4" />

//       <Suspense key={`${search}-${category}`} fallback={<Loader />}>
//         <InfinitePolls
//           search={search}
//           category={category}
//           idPrefix="home-page-polls"
//         />
//       </Suspense>
//     </main>
//   );
// }
