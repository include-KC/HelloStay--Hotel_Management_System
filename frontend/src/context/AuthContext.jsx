import { createContext, useContext, useMemo, useState } from "react";

import { loginRequest } from "../services/authService.js";

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "hellostay_access_token";

function readStoredToken() {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveToken(token) {
  try {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // If browser storage fails, React state will still hold the token for this session.
  }
}

function removeToken() {
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup failure.
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken());
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const isAuthenticated = Boolean(token);

  async function login(credentials) {
    setIsAuthenticating(true);

    try {
      const authData = await loginRequest(credentials);

      if (!authData?.access_token) {
        throw new Error("Login response did not include an access token.");
      }

      saveToken(authData.access_token);
      setToken(authData.access_token);

      return authData;
    } finally {
      setIsAuthenticating(false);
    }
  }

  function logout() {
    removeToken();
    setToken(null);
  }

  const value = useMemo(
    () => ({
      token,
      isAuthenticated,
      isAuthenticating,
      login,
      logout,
    }),
    [token, isAuthenticated, isAuthenticating]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}