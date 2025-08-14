// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Weblayout from './layout/Weblayout';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/Prodetails';
import Services from './pages/Services';
import Agents from './pages/Agents';
import Contact from './pages/Contact';
import Profile from './pages/Profile';

// Admin Layout
import AdminLayout from './layout/Adminlayout';
import { AuthProvider, useAuth } from './admin/AuthContext';
import AdminLogin from './admin/Login';
import AdminRegister from './admin/Register';
import Dashboard from './admin/Dashboard';
import AdminProperties from './admin/pages/Properties';
import AddProperty from './admin/pages/AddProperty';
import EditProperty from './admin/pages/EditProperty';
import Users from './admin/pages/Users';
import { ModalProvider } from './context/ModalContext';
import ModalContainer from './components/ModalContainer';

function AppRoutes() {
  const { requireAdmin } = useAuth();

  return (
    <Routes>
      {/* Public Frontend */}
      <Route path="/" element={<Weblayout><Home /></Weblayout>} />
      <Route path="/properties" element={<Weblayout><Properties /></Weblayout>} />
      <Route path="/property/:id" element={<Weblayout><PropertyDetails /></Weblayout>} />
      <Route path="/services" element={<Weblayout><Services /></Weblayout>} />
      <Route path="/agents" element={<Weblayout><Agents /></Weblayout>} />
      <Route path="/contact" element={<Weblayout><Contact /></Weblayout>} />
      <Route path="/profile" element={<Weblayout><Profile /></Weblayout>} />

      {/* Admin auth pages */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={requireAdmin(<AdminRegister />)} />

      {/* Admin dashboard */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="add-property" element={<AddProperty />} />
        <Route path="edit-property/:id" element={<EditProperty />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <AppRoutes />
        <ModalContainer />
      </ModalProvider>
    </AuthProvider>
  );
}