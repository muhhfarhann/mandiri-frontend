import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

type User = {
  username: string;
  role: "admin" | "user";
  id?: number;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  loginUser: (email: string, password: string) => Promise<void>; // Khusus User
  loginAdmin: (username: string, password: string) => Promise<void>; // Khusus Admin
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Cek Session saat pertama kali load (Refresh halaman)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.post("/auth/check");
        if (res.data.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2. Fungsi Login User (Email)
  const loginUser = async (email: string, password: string) => {
    try {
      const res = await api.post("/login-user", { email, password });
      const userData = {
        username: res.data.username,
        role: res.data.role || "user",
        id: res.data.id,
      };
      setUser(userData as User);
      setIsAuthenticated(true);
      navigate("/profile");
    } catch (error: any) {
      throw error;
    }
  };

  // 3. Fungsi Login Admin (Username) - BARU
  const loginAdmin = async (username: string, password: string) => {
    try {
      const res = await api.post("/admin/login", { username, password });
      const userData = {
        username: res.data.username,
        role: "admin" as const,
        // id biasanya tidak diekspos di respon admin login sederhana, tapi ada di session
      };
      setUser(userData);
      setIsAuthenticated(true);
      navigate("/admin/dashboard");
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/admin/logout"); // Logout endpoint (bisa dipakai user/admin)
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login"); // Default redirect ke user login
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        loginUser,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth error");
  return context;
};
