"use client";

import { CATEGORIES } from "@/constants";
import { useFilter } from "../hooks/useFilter";

export function FilterBar() {
  const { setSearch, setCategory } = useFilter();

  return (
    <div className="flex w-[calc(90%-90px)] max-w-fit flex-col gap-2 sm:flex-row">
      <input
        type="text"
        placeholder="Search"
        className="w-full sm:w-fit"
        onChange={(event) => setSearch(event.target.value)}
      />
      <select
        className="w-full sm:w-fit"
        onChange={(event) => setCategory(event.target.value)}
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
