"use client";

import { Input } from "@/app/components/Input";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchBar() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    console.log("SEARCH", debouncedSearch);
    router.push("?search=" + debouncedSearch);
  }, [debouncedSearch, router]);

  return (
    <Input
      inputProps={{
        type: "text",
        placeholder: "Search for a poll",
        onChange: (event) => setSearch(event.target.value),
      }}
    />
  );
}
