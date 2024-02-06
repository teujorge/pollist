"use client";

import { Input } from "@/app/components/Input";
import { useSearch } from "../hooks/useSearch";

export function SearchBar() {
  const { setSearch } = useSearch();

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
    </div>
  );
}
