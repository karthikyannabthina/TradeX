import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, if an access token exists, attempt to fetch the current user
    const originalToken = localStorage.getItem("accessToken");
    if (!originalToken) {
      setLoading(false);
      return;
    }

    let mounted = true;
    authService
      .me()
      .then((data) => {
        const currentUser = data?.data?.user || data?.user || data;
        if (mounted) setUser(currentUser);
      })
      .catch(() => {
        // Only remove the token from storage if the current access token is
        // STILL the same one that this /auth/me request was made with. If a
        // login has already stored a new, valid token in the meantime, we
        // must not delete it — that would trigger the exact 401 race we are
        // fixing here.
        if (localStorage.getItem("accessToken") === originalToken) {
          localStorage.removeItem("accessToken");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, []);

  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password });
    const result = data?.data || data;

    if (result?.accessToken) {
      localStorage.setItem("accessToken", result.accessToken);
    }
    const currentUser = result.user || (await authService.me()).data?.user;
    setUser(currentUser);
    return currentUser;
  };

  const register = async ({ name, email, password }) => {
    const data = await authService.register({ name, email, password });
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // ignore errors
    }
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
