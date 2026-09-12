import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import adminAuth from "../services/adminAuth";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);

      const result =
        await adminAuth.getCurrentAdmin();

      if (result.success && result.admin) {
        setAdmin(result.admin);

        setIsAuthenticated(true);
      } else {
        setAdmin(null);

        setIsAuthenticated(false);
      }
    } catch (error) {
      setAdmin(null);

      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const result = await adminAuth.login({
      email,
      password,
    });

    if (result.success && result.admin) {
      setAdmin(result.admin);

      setIsAuthenticated(true);
    }

    return result;
  };

  const register = async (
    name,
    email,
    password,
    registerKey
  ) => {
    const result =
      await adminAuth.register({
        name,
        email,
        password,
        registerKey,
      });

    return result;
  };

  const logout = async () => {
    try {
      await adminAuth.logout();
    } finally {
      setAdmin(null);

      setIsAuthenticated(false);
    }
  };

  const value = {
    admin,

    loading,

    isAuthenticated,

    login,

    register,

    logout,

    checkAuth,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(
    AdminAuthContext
  );

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider"
    );
  }

  return context;
}