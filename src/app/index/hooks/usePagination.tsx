import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function usePagination() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [page, setPage] = useState(1);
  const debouncedPage = useDebounce(page, 100);

  useEffect(() => {
    router.push(
      `?page=${debouncedPage}${debouncedSearch !== "" ? `&search=${debouncedSearch}` : ""}`,
    );
  }, [debouncedSearch, debouncedPage, router]);

  return {
    page,
    setPage,
    search,
    setSearch,
  };
}
