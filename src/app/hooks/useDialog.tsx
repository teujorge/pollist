import { createContext, useContext } from "react";

type DialogContextType = {
  isNotificationsOpen: boolean;
  setIsNotificationsOpen:
    | React.Dispatch<React.SetStateAction<boolean>>
    | undefined;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

export function DialogProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: DialogContextType;
}) {
  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}
