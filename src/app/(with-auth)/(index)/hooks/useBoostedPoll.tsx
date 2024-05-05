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
  const [boostedPollId, _setBoostedPollId] = useState<string | null>(null);

  function setBoostedPollId(pollId: string) {
    const ogId = sessionStorage.getItem("boostedPollId");
    if (ogId) return;
    _setBoostedPollId(pollId);
    sessionStorage.setItem("boostedPollId", pollId);
  }

  return (
    <BoostedPollContext.Provider
      value={{
        boostedPollId,
        setBoostedPollId,
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
