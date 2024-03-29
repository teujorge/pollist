"use client";

import {
  useState,
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export const tabs = ["votes", "polls", "private"] as const;

export type Tab = (typeof tabs)[number];

export function UserPageProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("votes");
  return (
    <UserContext.Provider value={{ tab, setTab }}>
      {children}
    </UserContext.Provider>
  );
}

type UserContextType = {
  tab: Tab;
  setTab: Dispatch<SetStateAction<Tab>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUserPage() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be use within the user provider");
  }
  return context;
}
