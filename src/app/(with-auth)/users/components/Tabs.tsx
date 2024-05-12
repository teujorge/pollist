"use client";

import { tabs, useUserPage } from "../context";
import { cn, uppercaseFirstLetter } from "@/lib/utils";

export function Tabs({ showPrivate }: { showPrivate: boolean }) {
  const { tab, setTab } = useUserPage();

  return (
    <div className="sticky top-20 flex h-10 w-full flex-row justify-center">
      {tabs.map(
        (tabName) =>
          ((tabName === "private" && showPrivate) || tabName !== "private") && (
            <button
              key={tabName}
              className={`z-10 w-40 rounded-lg p-2 transition-colors
                      ${tab === tabName ? "cursor-default font-bold text-foreground" : "text-accent-foreground hovact:bg-accent-dark"}
                    `}
              onClick={() => setTab(tabName)}
            >
              {uppercaseFirstLetter(tabName)}
            </button>
          ),
      )}

      <div
        className={cn(
          "absolute bottom-0 left-1/2 z-0 hidden h-0.5 w-40 rounded-full bg-accent transition-all sm:flex",

          showPrivate && tab === "votes" ? "-translate-x-60" : "",
          showPrivate && tab === "polls" ? "-translate-x-20" : "",
          showPrivate && tab === "private" ? "translate-x-20" : "",

          !showPrivate && tab === "votes" ? "-translate-x-40" : "",
          !showPrivate && tab === "polls" ? "translate-x-0" : "",
        )}
      />
    </div>
  );
}
