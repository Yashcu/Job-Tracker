// src/features/auth/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "../../lib/axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch the user's data after a successful login/initial load
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      // Clear token if user fetch fails (e.g., token expired)
      localStorage.removeItem("accessToken");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (credentials: any) => {
    const res = await api.post("/auth/login", credentials);
    const { accessToken } = res.data;
    localStorage.setItem("accessToken", accessToken);
    setToken(accessToken);
  };

  const register = async (userData: any) => {
    await api.post("/auth/register", userData);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  const value = { user, token, isLoading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};