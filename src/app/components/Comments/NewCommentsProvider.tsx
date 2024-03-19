"use client";

import { createContext, useContext, useState } from "react";
import type { Comment } from "../InfiniteComments/actions";

// Type definition remains the same
type NewCommentsContextType = {
  newReplies: Comment[];
  setNewReplies: React.Dispatch<React.SetStateAction<Comment[]>>;
};

// Create the context outside of the provider function
const NewCommentsContext = createContext<NewCommentsContextType | undefined>(
  undefined,
);

// Provider function
function NewCommentsProvider({ children }: { children: React.ReactNode }) {
  const [newReplies, setNewReplies] = useState<Comment[]>([]);

  return (
    <NewCommentsContext.Provider
      value={{
        newReplies,
        setNewReplies,
      }}
    >
      {children}
    </NewCommentsContext.Provider>
  );
}

// Custom hook to use the context
function useNewComments() {
  const context = useContext(NewCommentsContext);
  if (context === undefined) {
    throw new Error("useNewComments must be used within a NewCommentsProvider");
  }
  return context;
}

export { NewCommentsProvider, useNewComments };
