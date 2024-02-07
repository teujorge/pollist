"use client";

import { useSearch } from "../hooks/useSearch";

export function SearchBar() {
  const { setSearch } = useSearch();

  return (
    <input
      type="text"
      placeholder="Search"
      className="w-[calc(90%-90px)] max-w-fit"
      onChange={(event) => setSearch(event.target.value)}
    />
  );
}
