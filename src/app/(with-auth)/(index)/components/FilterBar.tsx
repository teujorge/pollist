"use client";

import { cn } from "@/lib/utils";
import { ArrowUp } from "@phosphor-icons/react";
import { useFilter } from "../hooks/useFilter";
import { CATEGORIES } from "@/constants";
import { buttonVariants } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export function FilterBar() {
  const params = useSearchParams();

  const filterRef = useRef<HTMLDivElement>(null);
  const initialScrollUpY = useRef<number | undefined>(undefined);
  const lastScrollY = useRef<number>(0);

  const { setSearch, setCategory } = useFilter();
  const [isVisible, setIsVisible] = useState(true);
  const [showUpButton, setShowUpButton] = useState(false);

  // save the source param ->
  useEffect(() => {
    for (const [key, value] of params.entries()) {
      if (key === "source" && value === "iosWebView") {
        localStorage.setItem("source", value);
      }
    }
  }, [params]);

  // listen to scroll event
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
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
        setShowUpButton(false);
      }
      // Scrolling up
      else {
        initialScrollUpY.current ??= currentScrollY;

        // Scrolling up by a minimum amount
        if (initialScrollUpY.current - currentScrollY > 50) {
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
                buttonVariants({ size: "sm", variant: "outline" }),
                "invisible absolute -bottom-2 flex translate-y-full scale-50 items-center justify-center gap-1 rounded-full opacity-0 transition-all",
                showUpButton && "visible scale-100 opacity-100",
              )}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Top <ArrowUp />
            </TooltipTrigger>
            <TooltipContent side="bottom">Back to top</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
