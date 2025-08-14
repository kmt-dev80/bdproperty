import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
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
  const refreshIntervalRef = useRef(null);

  // Stable functions that don't change between renders
  const setupAxiosInterceptors = useCallback(() => {
    // Request interceptor
    api.interceptors.request.use(config => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor
   api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post('/auth/refresh.php');
        if (refreshResponse.data.success) {
          localStorage.setItem('authToken', refreshResponse.data.token);
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          return api(originalRequest);
        } else {
          // If refresh fails, redirect to login
          window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login on refresh failure
        window.location.href = '/login';
      }
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
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
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

 // In AuthProvider.js
const startTokenRefresh = useCallback(() => {
  if (refreshIntervalRef.current) {
    clearInterval(refreshIntervalRef.current);
  }

  refreshIntervalRef.current = setInterval(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const refreshResponse = await api.post('/auth/refresh.php');
        if (refreshResponse.data.success) {
          localStorage.setItem('authToken', refreshResponse.data.token);
        } else {
          // If refresh fails, clear interval and force re-login
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
          await logout();
        }
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      // Clear interval on error to prevent infinite loops
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, process.env.REACT_APP_TOKEN_REFRESH_INTERVAL ? parseInt(process.env.REACT_APP_TOKEN_REFRESH_INTERVAL) : 300000);

  return () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
  };
}, []);

  useEffect(() => {
  setupAxiosInterceptors();
  
  const initializeAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await fetchUserInfo();
        startTokenRefresh();
      } catch (error) {
        console.error("Initialization error:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  initializeAuth();

  return () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
  };
}, [fetchUserInfo, startTokenRefresh, setupAxiosInterceptors]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/users/login.php', { email, password });
      if (res.data.success) {
        localStorage.setItem('authToken', res.data.token);
        await fetchUserInfo();
        startTokenRefresh();
        return { success: true };
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