"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFilter } from "../hooks/useFilter";
import { CATEGORIES } from "@/constants";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export function FilterBar() {
  const filterRef = useRef<HTMLDivElement>(null);
  const initialScrollUpY = useRef<number | undefined>(undefined);
  const lastScrollY = useRef<number>(0);

  const { setSearch, setCategory } = useFilter();
  const [isVisible, setIsVisible] = useState(true);
  const [showUpButton, setShowUpButton] = useState(false);

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
        setShowUpButton(false);
      }
      // Scrolling down
      else if (currentScrollY > lastScrollY.current) {
        initialScrollUpY.current = undefined;
        setIsVisible(false);
      }
      // Scrolling up
      else {
        setShowUpButton(true);

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
        "sticky top-9 z-20 flex w-full justify-center gap-2 bg-gradient-to-b from-background from-80% pt-6 transition-transform duration-300",
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
        <Tooltip>
          <TooltipTrigger className={cn(!showUpButton && "hidden")}>
            <Button
              size="sm"
              variant="outline"
              className="flex h-8 w-8 items-center justify-center rounded-full p-0"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Back to top</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
