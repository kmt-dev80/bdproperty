import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
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

// Create separate instance for file uploads
const uploadApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Accept": "application/json"
  }
});

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup axios interceptors
  const setupAxiosInterceptors = useCallback(() => {
    // Request interceptor
    api.interceptors.request.use(config => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor - simplified without refresh logic
    api.interceptors.response.use(
      response => response,
      error => {
        // If token is invalid (401), redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          setUser(null);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Setup uploadApi interceptors
    uploadApi.interceptors.request.use(config => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    uploadApi.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          setUser(null);
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/users/logout.php');
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, []);

  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await api.get('/users/get_user.php');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        await logout();
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      await logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    setupAxiosInterceptors();
    
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          await fetchUserInfo();
        } catch (error) {
          console.error("Initialization error:", error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, [fetchUserInfo, setupAxiosInterceptors]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/users/login.php', { email, password });
      if (res.data.success) {
        localStorage.setItem('authToken', res.data.token);
        await fetchUserInfo();
        return { 
          success: true, 
          user: res.data.user  // Include user data in the response
        };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'An error occurred during login' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/users/register.php', userData);
      return res.data;
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'An error occurred during registration' 
      };
    }
  };

  const uploadFile = async (endpoint, formData) => {
    try {
      const res = await uploadApi.post(endpoint, formData);
      return res.data;
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'An error occurred during file upload' 
      };
    }
  };

  // Generic API methods
  const get = async (endpoint) => {
    try {
      const res = await api.get(endpoint);
      return res.data;
    } catch (err) {
      throw err.response?.data || { success: false, message: 'An error occurred' };
    }
  };

  const post = async (endpoint, data) => {
    try {
      const res = await api.post(endpoint, data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { success: false, message: 'An error occurred' };
    }
  };

  const put = async (endpoint, data) => {
    try {
      const res = await api.put(endpoint, data);
      return res.data;
    } catch (err) {
      throw err.response?.data || { success: false, message: 'An error occurred' };
    }
  };

  const del = async (endpoint) => {
    try {
      const res = await api.delete(endpoint);
      return res.data;
    } catch (err) {
      throw err.response?.data || { success: false, message: 'An error occurred' };
    }
  };

  // Role checks
  const isLoggedIn = !!user;
  const isAdmin = () => user?.user_type === 'admin';
  const isAgent = () => user?.user_type === 'agent';
  const isLandlord = () => user?.user_type === 'landlord';
  const canAccessAdmin = () => isAdmin() || isAgent();

  // Route guards
  const requireAdmin = (element) => {
    if (loading) return null;
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
    isLoggedIn,
    register,
    logout,
    uploadFile,
    get,
    post,
    put,
    del,
    isAdmin,
    isAgent,
    isLandlord,
    canAccessAdmin,
    requireAdmin,
    requireNoUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};