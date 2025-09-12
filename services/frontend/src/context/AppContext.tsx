import React, { createContext, useContext, useState } from "react";

export type User = {
  userId: string; // backend user id
  email: string;
  role: "employee" | "hr";
  token: string;
};

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const logout = () => setUser(null);
  return (
    <AppContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx)
    throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
}
