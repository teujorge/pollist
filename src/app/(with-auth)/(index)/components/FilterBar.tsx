"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "@phosphor-icons/react";
import { useFilter } from "../hooks/useFilter";
import { CATEGORIES } from "@/constants";
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

  useEffect(() => {
    // Determine when to show or hide the button
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Near the top of the page
      if (currentScrollY < 500) {
        setIsVisible(true);
        setShowUpButton(false);
      }
      // Scrolling down
      else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
        setShowUpButton(false);
      }
      // Scrolling up
      else {
        if (!initialScrollUpY.current) {
          initialScrollUpY.current = currentScrollY;
        }

        // Show button when scrolled up significantly
        if (currentScrollY < initialScrollUpY.current - 50) {
          setIsVisible(true);
          setShowUpButton(true);
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

        {filterRef.current && (
          <Tooltip>
            <TooltipTrigger
              className={cn(
                "invisible absolute -bottom-2 translate-y-full scale-50 opacity-0 transition-all",
                showUpButton && "visible scale-100 opacity-100",
              )}
            >
              <Button
                size="sm"
                variant="outline"
                className="flex items-center justify-center gap-1 rounded-full"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Top <ArrowUp />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Back to top</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
