import { createContext, useState, useEffect, useContext } from "react";
import { getUserInfo, logoutUser } from "@/services/userService";
import { refreshToken } from "@/utils/token";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUserInfo();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async () => {
    const data = await getUserInfo();
    setUser(data);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    window.location.href = "/login"; // جایگزین Navigate
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
