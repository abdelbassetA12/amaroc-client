import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config/api";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ جلب المستخدم من السيرفر (cookie)
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/auth/me`,
        { withCredentials: true }
      );
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ login
  const login = async (form) => {

  try {

    await axios.post(
      `${API_BASE}/api/auth/login`,
      form,
      { withCredentials: true }
    );

    await fetchUser();

    return {
      success: true
    };

  } catch (err) {

    return {
      success: false,
      error: err.response?.data?.error,
      email: err.response?.data?.email
    };

  }

};


  // ✅ register
  const register = async (form) => {
    await axios.post(
      `${API_BASE}/api/auth/register`,
      form,
      { withCredentials: true }
    );
    await fetchUser();
  };

  // ✅ logout
  const logout = async () => {
    await axios.post(
      `${API_BASE}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook جاهز
export const useAuth = () => useContext(AuthContext);