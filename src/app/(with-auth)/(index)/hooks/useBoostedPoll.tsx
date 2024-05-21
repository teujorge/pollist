"use client";

import { createContext, useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    const savedBoostedPoll = sessionStorage.getItem("boostedPoll");
    if (savedBoostedPoll) {
      setBoostedPoll(JSON.parse(savedBoostedPoll) as PollsDetails[number]);
    }
  }, []);

  function _setBoostedPoll(poll: PollsDetails[number]) {
    const savedBoostedPoll = sessionStorage.getItem("boostedPoll");

    if (!savedBoostedPoll) {
      setBoostedPoll(poll);
      sessionStorage.setItem("boostedPoll", JSON.stringify(poll));
    }
  }

  return (
    <BoostedPollContext.Provider
      value={{
        boostedPoll,
        setBoostedPoll: _setBoostedPoll,
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
