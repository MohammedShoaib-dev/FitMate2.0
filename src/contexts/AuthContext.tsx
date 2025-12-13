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
  login: (email: string, password: string, role: "user" | "admin") => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple and fast session check - localStorage only
    const checkSession = () => {
      try {
        const stored = localStorage.getItem("fitmate_user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error checking stored session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Run immediately for fast loading
    checkSession();
  }, []);

  const login = async (email: string, password: string, role: "user" | "admin"): Promise<boolean> => {
    // Check demo credentials first (synchronous and instant)
    const credentials = DEMO_CREDENTIALS[role];
    const foundDemoUser = credentials.find(
      (cred) => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
    );

    if (foundDemoUser) {
      const userData = {
        id: foundDemoUser.id,
        email: foundDemoUser.email,
        role,
        name: foundDemoUser.name,
      };
      setUser(userData);
      localStorage.setItem("fitmate_user", JSON.stringify(userData));
      return true;
    }

    // Check for demo user created during signup
    try {
      const demoUser = localStorage.getItem("fitmate_demo_user");
      if (demoUser) {
        const parsedDemoUser = JSON.parse(demoUser);
        if (parsedDemoUser.email.toLowerCase() === email.toLowerCase() && role === parsedDemoUser.role) {
          setUser(parsedDemoUser);
          localStorage.setItem("fitmate_user", JSON.stringify(parsedDemoUser));
          return true;
        }
      }
    } catch (error) {
      console.error('Error checking demo user:', error);
    }

    // Only try Supabase for non-demo emails (with short timeout)
    if (!email.includes('fitmate.com')) {
      try {
        const { supabase } = await import("@/lib/supabase");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        clearTimeout(timeoutId);

        if (error) throw error;

        if (data.user && data.user.email) {
          const userData = {
            id: data.user.id,
            email: data.user.email,
            role: role,
            name: data.user.user_metadata?.name || data.user.email.split('@')[0],
          };
          setUser(userData);
          localStorage.setItem("fitmate_user", JSON.stringify(userData));
          return true;
        }
      } catch (error) {
        console.error('Supabase login failed:', error);
      }
    }

    return false;
  };

  const logout = async (): Promise<void> => {
    // For demo mode, just clear local state
    setUser(null);
    localStorage.removeItem("fitmate_user");
    localStorage.removeItem("fitmate_demo_user");
    
    // Only try Supabase signout if user might be a real Supabase user
    if (user && !user.id.startsWith('USER') && !user.id.startsWith('ADMIN')) {
      try {
        const { supabase } = await import("@/lib/supabase");
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error signing out from Supabase:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

