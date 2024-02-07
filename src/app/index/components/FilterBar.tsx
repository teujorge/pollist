"use client";

import { CATEGORIES } from "@/constants";
import { useFilter } from "../hooks/useFilter";

export function FilterBar() {
  const { setSearch, setCategory } = useFilter();

  return (
    <>
      <input
        type="text"
        placeholder="Search"
        className="w-[calc(90%-90px)] max-w-fit"
        onChange={(event) => setSearch(event.target.value)}
      />
      <select
        className="w-[calc(90%-90px)] max-w-fit"
        onChange={(event) => setCategory(event.target.value)}
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </>
  );
}
