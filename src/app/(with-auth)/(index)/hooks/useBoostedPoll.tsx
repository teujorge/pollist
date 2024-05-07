"use client";

import { createContext, useContext, useState } from "react";
import type { PollsDetails } from "@/app/components/InfinitePolls/actions";

type BoostedPollContextType = {
  boostedPoll: PollsDetails[number] | undefined;
  setBoostedPoll: (poll: PollsDetails[number]) => void;
};

const BoostedPollContext = createContext<BoostedPollContextType | undefined>(
  undefined,
);

export function BoostedPollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [boostedPoll, setBoostedPoll] = useState<PollsDetails[number]>();

  return (
    <BoostedPollContext.Provider
      value={{
        boostedPoll,
        setBoostedPoll,
      }}
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
