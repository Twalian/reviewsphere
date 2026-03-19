import { createContext, useEffect, useState } from "react";
import { getCurrentUser, logout as apiLogout } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      apiLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  function loginUser(userData, access, refresh) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setUser(userData);
  }

  function logoutUser() {
    apiLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
        setUser,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}