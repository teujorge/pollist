"use client";

import { Input } from "@/app/components/Input";
import { ArrowSvg } from "@/app/svgs/ArrowSvg";
import { usePagination } from "../hooks/usePagination";

export function SearchBar({ hasNext }: { hasNext: boolean }) {
  const { page, setPage, setSearch } = usePagination();

  return (
    <div className="flex w-fit flex-row items-center justify-center gap-1">
      <Input
        wrapperProps={{ className: "p-1" }}
        inputProps={{
          type: "text",
          placeholder: "Search for a poll",
          onChange: (event) => setSearch(event.target.value),
        }}
      />
      <button
        className={`h-8 w-8 rotate-180 rounded-md p-2 transition-colors hover:bg-neutral-800
          ${page <= 1 && "pointer-events-none cursor-default opacity-50"}
        `}
        onClick={() => setPage((prev) => prev - 1)}
      >
        <ArrowSvg className="h-full w-full fill-neutral-200" />
      </button>
      <button
        className={`h-8 w-8 rounded-md p-2 transition-colors hover:bg-neutral-800
          ${!hasNext && "pointer-events-none cursor-default opacity-50"}
        `}
        onClick={() => setPage((prev) => prev + 1)}
      >
        <ArrowSvg className="h-full w-full fill-neutral-200" />
      </button>
    </div>
  );
}
