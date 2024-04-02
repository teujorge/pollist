"use client";

import { createContext, useContext, useState } from "react";

type FeaturedPollContextType = {
  featuredPollId: string | null;
  setFeaturedPollId: (pollId: string) => void;
};

const FeaturedPollContext = createContext<FeaturedPollContextType | undefined>(
  undefined,
);

export function FeaturedPollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [featuredPollId, setFeaturedPollId] = useState<string | null>(null);

  return (
    <FeaturedPollContext.Provider value={{ featuredPollId, setFeaturedPollId }}>
      {children}
    </FeaturedPollContext.Provider>
  );
}

export function useFeaturedPoll() {
  const context = useContext(FeaturedPollContext);
  if (context === undefined) {
    throw new Error(
      "useFeaturedPoll must be used within a FeaturedPollProvider",
    );
  }
  return context;
}
