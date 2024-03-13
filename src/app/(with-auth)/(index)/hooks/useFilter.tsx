"use client";

import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/constants";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export function useFilter() {
  const router = useRouter();

  // query search
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // option category
  const [category, setCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch.length > 0) {
      params.append("search", debouncedSearch);
    }

    if (category && category !== CATEGORIES[0]) {
      params.append("category", category.toLowerCase());
    }

    const queryString = params.toString();

    router.push(`/?${queryString}`, { scroll: false });
  }, [debouncedSearch, category, router]);

  return {
    search,
    setSearch,
    category,
    setCategory,
  };
}
