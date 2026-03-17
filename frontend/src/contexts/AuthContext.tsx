import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api, { authAPI } from "../services/api";

// Types for the auth system
export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  rollNumber?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  rollNumber: string;
  department: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await authAPI.getProfile();
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch profile", error);
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // FastAPI OAuth2PasswordRequestForm expects FormData
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await api.post("/api/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    
    const { access_token } = res.data;
    localStorage.setItem("token", access_token);
    setToken(access_token);
    
    // Fetch user profile
    const profileRes = await authAPI.getProfile();
    const userData = profileRes.data;
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    const res = await authAPI.register({
      name: data.name,
      email: data.email,
      password: data.password,
      roll_number: data.rollNumber,
      department: data.department,
      role: "student"
    });
    
    // After registration, log them in or just use the data
    const loginRes = await login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
