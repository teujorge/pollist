"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ScrollToComments() {
  const params = useSearchParams();

  useEffect(() => {
    const allCommentsTitle = document.getElementById("all-comments-title");
    if (!allCommentsTitle) return;
    if (params.get("comments") !== "true") return;

    allCommentsTitle.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [params]);

  return null;
}
