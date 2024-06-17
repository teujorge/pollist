"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import { Loader } from "../Loader";
import { useInfiniteScroll } from "./useInfiniteScroll";

export function InfinitelyMoreItems<
  TItem extends { id: string },
  TQuery,
>(props: {
  idPrefix: string;
  ItemComponent: React.ComponentType<TItem>;
  query: TQuery;
  initialCursor: string | undefined;
  getter: (params: TQuery & { cursor: string | undefined }) => Promise<TItem[]>;
  loaderClassName?: string;
}) {
  const loaderRef = useRef<HTMLDivElement>(null);

  const data = useInfiniteScroll<TItem, TQuery>({
    query: props.query,
    loaderRef: loaderRef,
    getter: props.getter,
    initialCursor: props.initialCursor,
  });

  return (
    <>
      {data.items.map((item) => (
        <props.ItemComponent
          key={`${props.idPrefix}-item-${item.id}`}
          {...item}
        />
      ))}
      <div
        ref={loaderRef}
        className="flex min-h-12 w-full items-center justify-center"
      >
        {data.hasMore ? (
          <Loader className={cn("h-8 w-8", props.loaderClassName)} />
        ) : (
          <p className="text-sm text-accent-foreground underline decoration-accent-foreground underline-offset-4">
            Nothing more to show...
          </p>
        )}
      </div>
    </>
  );
}
