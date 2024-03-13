"use client";

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
        className="flex h-12 w-full items-center justify-center"
      >
        {data.hasMore ? (
          <Loader />
        ) : (
          <p className="text-sm text-neutral-400 underline decoration-neutral-400 underline-offset-4">
            Nothing more to show...
          </p>
        )}
      </div>
    </>
  );
}
