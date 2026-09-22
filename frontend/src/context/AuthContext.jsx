import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const originalToken = localStorage.getItem("accessToken");

    if (!originalToken) {
      setLoading(false);
      return;
    }

    let mounted = true;

    authService
      .me()
      .then((data) => {
        const currentUser =
          data?.data?.user || data?.user || data;

        if (mounted) {
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (localStorage.getItem("accessToken") === originalToken) {
          localStorage.removeItem("accessToken");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = async ({ email, password }) => {
    const data = await authService.login({
      email,
      password,
    });

    const result = data?.data || data;

    if (result?.accessToken) {
      localStorage.setItem("accessToken", result.accessToken);
    }

    if (result?.refreshToken) {
      localStorage.setItem("refreshToken", result.refreshToken);
    }

    const currentUser =
      result?.user ||
      (await authService.me()).data?.user;

    setUser(currentUser);

    return currentUser;
  };

  const googleLogin = async (idToken) => {
    const data = await authService.googleLogin(idToken);

    const result = data?.data || data;

    if (result?.accessToken) {
      localStorage.setItem("accessToken", result.accessToken);
    }

    if (result?.refreshToken) {
      localStorage.setItem("refreshToken", result.refreshToken);
    }

    const currentUser = result?.user;

    setUser(currentUser);

    return currentUser;
  };

  const register = async ({ name, email, password }) => {
    const data = await authService.register({
      name,
      email,
      password,
    });

    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignore logout errors
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        googleLogin,
        logout,
        register,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return ctx;
}