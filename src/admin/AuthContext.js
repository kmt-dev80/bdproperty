// src/admin/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';

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
      const res = await fetch('http://localhost/api/users/get_user.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
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
      const res = await fetch('http://localhost/api/users/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
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
      const res = await fetch('http://localhost/api/users/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: 'An error occurred during registration' };
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
    isAdmin,
    isAgent,
    isLandlord,
    canAccessAdmin,
    requireAdmin,
    requireNoUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
