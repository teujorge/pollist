"use client";

import { createContext, useContext, useState } from "react";

type BoostedPollContextType = {
  boostedPollId: string | null;
  setBoostedPollId: (pollId: string) => void;
};

const BoostedPollContext = createContext<BoostedPollContextType | undefined>(
  undefined,
);

export function BoostedPollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [boostedPollId, setBoostedPollId] = useState<string | null>(null);

  return (
    <BoostedPollContext.Provider
      value={{ boostedPollId, setBoostedPollId: setBoostedPollId }}
    >
      {children}
    </BoostedPollContext.Provider>
  );
}

export function useBoostedPoll() {
  const context = useContext(BoostedPollContext);
  if (context === undefined) {
    throw new Error("useBoostedPoll must be used within a BoostedPollProvider");
  }
  return context;
}
