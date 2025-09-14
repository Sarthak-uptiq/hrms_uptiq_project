// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { login, verifyToken, logout as apiLogout } from "../api/auth"; //

type User = {
  id: string; // or user_id, based on your backend response
  email: string;
  role: "HR" | "EMPLOYEE";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginUser: (email: string, password: string, role: "HR" | "EMPLOYEE") => Promise<void>;
  logout: () => Promise<void>; 
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start as true

  useEffect(() => {
    // This function runs on app mount to check for an existing session cookie
    const checkSession = async () => {
      try {
        const data = await verifyToken(); //
        // If verifyToken succeeds, the cookie was valid
        setUser({ 
          id: data.user.id, 
          email: data.user.email, 
          role: data.user.role 
        });
      } catch (err) {
        // Any error means no valid session
        console.error("Session check failed, user is not logged in.", err);
        setUser(null);
      } finally {
        // THIS IS THE FIX: This block *always* runs after try/catch
        // This stops the infinite "Loading Application..." screen
        setLoading(false);
      }
    };

    checkSession();
  }, []); // Empty array ensures this runs only ONCE on mount

  const loginUser = async (email: string, password: string, role: "HR" | "EMPLOYEE") => {
    // Call the API client
    const data = await login(email, password, role); //
    
    // The cookie is set automatically by the browser (from the backend response)
    // We just need to set the user state in React from the JSON response
    setUser({ 
      id: data.user.user_id, // Match the response object from your controller
      email: data.user.email, 
      role: data.user.role 
    });
  };

  const logout = async () => {
    try {
      await apiLogout(); // Call backend to clear the HTTPOnly cookie
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      // Always clear the user state in the frontend
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// This is the custom hook components will use to access the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};