// src/admin/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Create separate instance for file uploads
const uploadApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Accept": "application/json"
  }
});

// Add request interceptor for auth token to upload API
uploadApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserInfo(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      // Use the api instance instead of fetch
      const res = await api.get('/users/get_user.php');
      const data = res.data;
      
      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Use the api instance instead of fetch
      const res = await api.post('/users/login.php', { email, password });
      const data = res.data;
      
      if (data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const register = async (userData) => {
    try {
      // Use the api instance instead of fetch
      const res = await api.post('/users/register.php', userData);
      return res.data;
    } catch (err) {
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  // Add a method for file uploads
  const uploadFile = async (endpoint, formData) => {
    try {
      const res = await uploadApi.post(endpoint, formData);
      return res.data;
    } catch (err) {
      return { success: false, message: 'An error occurred during file upload' };
    }
  };

  // Generic API request methods
  const get = async (endpoint) => {
    try {
      const res = await api.get(endpoint);
      return res.data;
    } catch (err) {
      return { success: false, message: 'An error occurred' };
    }
  };

  const post = async (endpoint, data) => {
    try {
      const res = await api.post(endpoint, data);
      return res.data;
    } catch (err) {
      return { success: false, message: 'An error occurred' };
    }
  };

  const put = async (endpoint, data) => {
    try {
      const res = await api.put(endpoint, data);
      return res.data;
    } catch (err) {
      return { success: false, message: 'An error occurred' };
    }
  };

  const del = async (endpoint) => {
    try {
      const res = await api.delete(endpoint);
      return res.data;
    } catch (err) {
      return { success: false, message: 'An error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const isAdmin = () => user && user.user_type === 'admin';
  const isAgent = () => user && user.user_type === 'agent';
  const isLandlord = () => user && user.user_type === 'landlord';
  const canAccessAdmin = () => user && (user.user_type === 'admin' || user.user_type === 'agent');

  // Route guards
  const requireAdmin = (element) => {
    if (loading) return null; // Wait until we know
    return isAdmin() ? element : <Navigate to="/admin/login" />;
  };

  const requireNoUser = (element) => {
    if (loading) return null;
    return !user ? element : <Navigate to="/" />;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    uploadFile,
    // Generic API methods
    get,
    post,
    put,
    del,
    // Role checks
    isAdmin,
    isAgent,
    isLandlord,
    canAccessAdmin,
    // Route guards
    requireAdmin,
    requireNoUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};