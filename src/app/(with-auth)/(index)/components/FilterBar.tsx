"use client";

import { cn } from "@/lib/utils";
import { useFilter } from "../hooks/useFilter";
import { CATEGORIES } from "@/constants";
import { useEffect, useRef, useState } from "react";

export function FilterBar() {
  const filterRef = useRef<HTMLDivElement>(null);
  const initialScrollUpY = useRef<number | undefined>(undefined);
  const lastScrollY = useRef<number>(0);

  const { setSearch, setCategory } = useFilter();
  const [isVisible, setIsVisible] = useState(true);

  // listen to scroll event
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      if (filterRef.current === null) return;

      const currentScrollY = window.scrollY;

      // Close to the top of the page
      if (currentScrollY < 500) {
        initialScrollUpY.current = undefined;
        setIsVisible(true);
      }
      // Scrolling down
      else if (currentScrollY > lastScrollY.current) {
        initialScrollUpY.current = undefined;
        setIsVisible(false);
      }
      // Scrolling up
      else {
        // First time scrolling up
        if (!initialScrollUpY.current) {
          initialScrollUpY.current = currentScrollY;
        }

        // Scrolling up by a minimum amount
        if (initialScrollUpY.current - currentScrollY > 50) {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={filterRef}
      className={cn(
        "sticky top-9 z-20 flex w-full justify-center gap-2 bg-gradient-to-b from-black from-80% pt-6 transition-transform duration-300",
        {
          "translate-y-0": isVisible,
          "-translate-y-full": !isVisible,
        },
      )}
    >
      <div className="flex w-[calc(90%-90px)] max-w-fit flex-col items-center justify-center gap-2 sm:flex-row">
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
    </div>
  );
}
