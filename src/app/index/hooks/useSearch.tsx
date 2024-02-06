import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useSearch() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    router.push(`?search=${debouncedSearch}`);
  }, [debouncedSearch, router]);

  return {
    search,
    setSearch,
  };
}
