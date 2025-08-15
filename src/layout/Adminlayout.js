// src/layouts/AdminLayout.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css/animate.min.css';
import '../assets/css/style.css';
import '../assets/css/admin.css';
import '../App.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../admin/AuthContext';
import AdminSidebar from '../admin/components/AdminSidebar';
import AdminHeader from '../admin/components/AdminHeader';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, canAccessAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and has admin/agent role
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin/login');
        return;
      }
      
      if (!canAccessAdmin()) {
        navigate('/');
        return;
      }
    }
  }, [user, loading, canAccessAdmin, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <div className={`admin-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <AdminHeader 
          toggleSidebar={toggleSidebar} 
          user={user} 
          onLogout={handleLogout} 
        />
        
        <main className="admin-main p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;