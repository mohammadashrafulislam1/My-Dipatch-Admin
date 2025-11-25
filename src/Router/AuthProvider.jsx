import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { endPoint } from "../Components/ForAPIs"; // ⬅️ make sure this import exists

export const AdminAuthContext = createContext();

const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken") || null);
  const [loading, setLoading] = useState(true);

  // 🔥 Auto attach admin token
  axios.interceptors.request.use((config) => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      config.headers.Authorization = `Bearer ${savedToken}`;
    }
    return config;
  });

  // 🔥 Fetch current admin
  const fetchCurrentAdmin = async () => {
    const savedToken = localStorage.getItem("adminToken");

    if (!savedToken) {
      setAdmin(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${endPoint}/user/me/admin`);
      setAdmin(data.user);
      setToken(savedToken);
    } catch (err) {
      console.error("Admin fetch error:", err.response?.data || err.message);
      localStorage.removeItem("adminToken");
      setAdmin(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentAdmin();
  }, []);

  // ⭐ ADMIN SIGNUP (New)
  const signup = async (formData) => {
    setLoading(true);
    try {
      const { name, email, phone, password } = formData;
      const [firstName, ...rest] = name.split(" ");
      const lastName = rest.join(" ");

      const { data } = await axios.post(`${endPoint}/user/signup`, {
        firstName,
        lastName,
        email,
        phone,
        city: "N/A",
        password,
        role: "admin", // VERY IMPORTANT
      });

      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ADMIN LOGIN
  const login = async (formData) => {
    setLoading(true);

    try {
      const { data } = await axios.post(`${endPoint}/user/login`, {
        ...formData,
        role: "admin",
      });

      localStorage.setItem("adminToken", data.token);

      setToken(data.token);
      setAdmin(data.user);

      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ❌ ADMIN LOGOUT
  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
    setToken(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        loading,
        signup,   // ⬅️ added
        login,
        logout,
        fetchCurrentAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
