import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "user" | "admin" | null;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: "user" | "admin") => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Demo credentials
const DEMO_CREDENTIALS = {
  user: [
    { email: "user@fitmate.com", password: "user123", id: "USER001", name: "John Doe" },
    { email: "jane@fitmate.com", password: "jane123", id: "USER002", name: "Jane Smith" },
  ],
  admin: [
    { email: "admin@fitmate.com", password: "admin123", id: "ADMIN001", name: "Admin" },
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem("fitmate_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    // Save to localStorage whenever user changes
    if (user) {
      localStorage.setItem("fitmate_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("fitmate_user");
    }
  }, [user]);

  const login = (email: string, password: string, role: "user" | "admin"): boolean => {
    const credentials = DEMO_CREDENTIALS[role];
    const foundUser = credentials.find(
      (cred) => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
    );

    if (foundUser) {
      setUser({
        id: foundUser.id,
        email: foundUser.email,
        role,
        name: foundUser.name,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fitmate_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

